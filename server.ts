import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// 1. Memory Analyzer API Route
app.post("/api/analyze-memory", async (req, res) => {
  try {
    const { title, content, category, triggerContext } = req.body;

    const prompt = `You are Recall MemoryOS - an AI that scores human experiences and extracts personal preferences.
Analyze this user memory entry:
Title: ${title}
Content: ${content}
Optional Suggested Category: ${category || 'None'}
Optional Suggested Context: ${triggerContext || 'None'}

Evaluate and output JSON with:
1. category: "purchase" | "people" | "place" | "decision"
2. memoryScore: number from 1 to 100 based on:
   - Was it emotional or financial?
   - Is it tied to a specific location or context?
   - Can it prevent a future mistake (e.g. bad fit, bad food, forgot item)?
   - Is it something people usually forget?
3. scoreReasoning: 1-sentence brief explanation of why this score was given.
4. retentionRule: "once" | "until_completed" | "this_week" | "this_month" | "every_grocery" | "every_vacation" | "every_doctor" | "every_winter" | "forever"
5. triggerContext: Short trigger label like "Grocery Store", "Beach / Travel", "Clothes Shopping", "Pharmacy", "Restaurant / Dining", "Electronics", "Airport", etc.
6. tags: 2 to 5 relevant short tags.
7. preferenceExtracts: array of objects { category: "clothing" | "food" | "travel" | "shopping" | "general", trait: string, sentiment: "positive" | "negative" | "neutral" }
8. decisionDetails: if this entry describes a decision, choice, purchase, or rating, include { choice: string, reasoning: string, regrets: string or empty, rating: number 1-10, wouldRecommend: boolean }.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "purchase, people, place, or decision" },
            memoryScore: { type: Type.INTEGER, description: "Score 1 to 100" },
            scoreReasoning: { type: Type.STRING },
            retentionRule: { type: Type.STRING },
            triggerContext: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            preferenceExtracts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  trait: { type: Type.STRING },
                  sentiment: { type: Type.STRING }
                },
                required: ["category", "trait", "sentiment"]
              }
            },
            decisionDetails: {
              type: Type.OBJECT,
              properties: {
                choice: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                regrets: { type: Type.STRING },
                rating: { type: Type.INTEGER },
                wouldRecommend: { type: Type.BOOLEAN }
              }
            }
          },
          required: ["category", "memoryScore", "scoreReasoning", "retentionRule", "triggerContext", "tags", "preferenceExtracts"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/analyze-memory:", error);
    res.status(500).json({ error: error.message || "Failed to analyze memory" });
  }
});

// 2. Personal Decision Engine API Route
app.post("/api/personal-decision", async (req, res) => {
  try {
    const { query, memories, preferenceGraph, simulatedTrigger, language } = req.body;

    const langNotice = language && language !== 'en' ? `IMPORTANT: Provide all text response content in "${language}" language.` : '';

    const systemInstruction = `You are Recall MemoryOS - a Personal Decision Engine that gives advice based on the user's personal experiences, body measurements, past regrets, brand fit history, and personal preferences graph.
DO NOT give generic internet search answers (e.g., "Zara is a popular brand"). Instead answer specifically FOR THIS USER.
${langNotice}

User Profile:
- Height & Weight: ${preferenceGraph?.bodyProfile?.height || '5\'2"'}, ${preferenceGraph?.bodyProfile?.weight || '118 lbs'} (${preferenceGraph?.bodyProfile?.bodyType || 'Petite'})
- Top & Bottom Sizes: ${preferenceGraph?.bodyProfile?.topSize || 'XS'}, ${preferenceGraph?.bodyProfile?.bottomSize || 'Petite 0'}
- Fit Preferences: ${JSON.stringify(preferenceGraph?.bodyProfile?.fitPreferences || [])}
- Brand Fit History: ${JSON.stringify(preferenceGraph?.brandPreferences || [])}
- Food Preferences: ${JSON.stringify(preferenceGraph?.foodPreferences || {})}
- Travel & Packing History: ${JSON.stringify(preferenceGraph?.travelPreferences || {})}
- Shopping Rules & Budget: ${JSON.stringify(preferenceGraph?.shoppingPreferences || {})}
- Learned Behaviors: ${JSON.stringify(preferenceGraph?.learnedTraits || [])}

Context Trigger Active right now: ${simulatedTrigger || 'General'}

Stored Life Memories & Past Decisions (${memories?.length || 0} entries provided):
${JSON.stringify((memories || []).slice(0, 15).map((m: any) => ({
  title: m.title,
  content: m.content,
  category: m.category,
  score: m.memoryScore,
  trigger: m.triggerContext,
  decision: m.decisionDetails
})))}

Answering Query: "${query}"

Return a structured JSON response with:
1. answer: A direct, warm, hyper-personalized response addressing the user's specific query using their past memories and preferences graph. Explicitly reference why something works or doesn't work for them (e.g. "Because your inseam is short and Zara runs 3 inches long...", "Last time in Miami you forgot sunscreen...").
2. recommendations: Array of 2-4 actionable personal recommendation items.
3. memoriesUsed: Array of objects { id, title, score, relevanceReason } explaining which stored memories or graph nodes informed this decision.
4. preferenceHighlights: Array of key personal traits referenced (e.g. "Banana Republic Petite 0 = perfect fit", "Avoids loud restaurants").
5. warningsOrRegrets: Optional list of past mistakes or regrets to avoid repeating.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Query: ${query}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            memoriesUsed: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  relevanceReason: { type: Type.STRING }
                },
                required: ["title", "relevanceReason"]
              }
            },
            preferenceHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            warningsOrRegrets: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["answer", "recommendations", "memoriesUsed", "preferenceHighlights"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/personal-decision:", error);
    res.status(500).json({ error: error.message || "Failed to make personal decision recommendation" });
  }
});

// 3. Behavior Learning Engine API Route
app.post("/api/behavior-learning", async (req, res) => {
  try {
    const { memories, currentGraph } = req.body;

    const prompt = `Analyze these user memories and identify repeated behavior patterns or implicit preferences that should be added to their Personal Preference Graph.
Existing Learned Traits: ${JSON.stringify(currentGraph?.learnedTraits || [])}
Memories: ${JSON.stringify((memories || []).map((m: any) => ({ title: m.title, content: m.content, decision: m.decisionDetails })))}

Identify any NEW patterns (e.g. buying Uniqlo multiple times, consistently avoiding loud venues, specific packing habits).
Output JSON with newTraits: array of { trait, category: "clothing"|"food"|"travel"|"shopping"|"general", confidence: 1-100, explanation }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            newTraits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  trait: { type: Type.STRING },
                  category: { type: Type.STRING },
                  confidence: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["trait", "category", "confidence", "explanation"]
              }
            }
          },
          required: ["newTraits"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/behavior-learning:", error);
    res.status(500).json({ error: error.message || "Failed behavior learning analysis" });
  }
});

// 4. Voice Note & Multimodal Recording Processor API Route
app.post("/api/process-voice", async (req, res) => {
  try {
    const { transcript, memories, preferenceGraph } = req.body;

    if (!transcript || typeof transcript !== "string") {
      return res.status(400).json({ error: "Transcript string is required" });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const prompt = `You are Recall MemoryOS - a Multimodal Voice Recording Assistant that processes verbal notes into structured Memories and/or Scheduled Events.
Today's Date: ${todayStr}

User Spoken Transcript: "${transcript}"

Analyze what the user said and determine:
1. Intent:
   - "memory": User is recording a past experience, regret, rating, sizing fit, food preference, or lesson learned to remember long-term.
   - "schedule": User wants to schedule an upcoming task, appointment, shopping trip, getaway, or reminder for a specific date/time.
   - "both": User's note contains BOTH a past lesson/memory AND a future scheduled decision event.

2. If intent includes memory:
   - title: Punchy 3-7 word summary title
   - content: Clean formatted record of what was said
   - category: "purchase" | "people" | "place" | "decision"
   - memoryScore: 1-100 score based on emotional/financial impact and future decision value
   - scoreReasoning: 1 sentence explanation
   - retentionRule: "once" | "until_completed" | "this_week" | "this_month" | "every_grocery" | "every_vacation" | "every_doctor" | "every_winter" | "forever"
   - triggerContext: e.g. "At Grocery Store", "Beach Trip", "Browsing Clothes", "Pharmacy", "Electronics"
   - tags: 2-4 tags
   - preferenceExtracts: list of { category: "clothing"|"food"|"travel"|"shopping"|"general", trait: string, sentiment: "positive"|"negative"|"neutral" }
   - decisionDetails: optional { choice, reasoning, regrets, rating (1-10), wouldRecommend }

3. If intent includes schedule:
   - title: Event title (e.g. "Costco Grocery Run", "Miami Beach Flight", "Uniqlo SoHo Shopping")
   - date: ISO date string YYYY-MM-DD. Infer future date if relative (e.g. "next Tuesday" relative to ${todayStr}).
   - time: e.g. "09:30 AM" or "02:00 PM"
   - category: "grocery" | "clothing" | "travel" | "health" | "tech" | "general"
   - location: Location if mentioned
   - notes: Notes or items to buy/pack
   - personalizedAdvice: 1-2 sentence recommendation informed by user's preferences graph (e.g. "Remember Petite size 0 at Banana Republic", "Avoid Chobani Oat").

4. aiSummary: A friendly 1-2 sentence summary of what Recall extracted from the voice note.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING, description: "memory, schedule, or both" },
            aiSummary: { type: Type.STRING },
            transcript: { type: Type.STRING },
            memoryData: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                category: { type: Type.STRING },
                memoryScore: { type: Type.INTEGER },
                scoreReasoning: { type: Type.STRING },
                retentionRule: { type: Type.STRING },
                triggerContext: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                preferenceExtracts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      trait: { type: Type.STRING },
                      sentiment: { type: Type.STRING }
                    },
                    required: ["category", "trait", "sentiment"]
                  }
                },
                decisionDetails: {
                  type: Type.OBJECT,
                  properties: {
                    choice: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    regrets: { type: Type.STRING },
                    rating: { type: Type.INTEGER },
                    wouldRecommend: { type: Type.BOOLEAN }
                  }
                }
              },
              required: ["title", "content", "category", "memoryScore", "retentionRule", "triggerContext", "tags"]
            },
            scheduleData: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                date: { type: Type.STRING },
                time: { type: Type.STRING },
                category: { type: Type.STRING },
                location: { type: Type.STRING },
                notes: { type: Type.STRING },
                personalizedAdvice: { type: Type.STRING }
              },
              required: ["title", "date", "category"]
            }
          },
          required: ["intent", "aiSummary"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    parsed.transcript = transcript;
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/process-voice:", error);
    res.status(500).json({ error: error.message || "Failed to process voice note" });
  }
});


// Vite Integration for dev server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Recall server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

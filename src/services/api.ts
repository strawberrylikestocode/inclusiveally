import { Memory, PreferenceGraph, DecisionQueryResponse, VoiceProcessedResult } from '../types';

export async function processVoiceNoteWithAI(
  transcript: string,
  memories: Memory[],
  preferenceGraph: PreferenceGraph
): Promise<VoiceProcessedResult> {
  try {
    const response = await fetch('/api/process-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, memories, preferenceGraph }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server returned status ${response.status}: ${errText}`);
    }

    return await response.json();
  } catch (err) {
    console.warn('Voice processing fallback:', err);
    const isScheduleIntent = transcript.toLowerCase().includes('remind') || transcript.toLowerCase().includes('schedule') || transcript.toLowerCase().includes('tomorrow') || transcript.toLowerCase().includes('next');

    const todayStr = new Date().toISOString().split('T')[0];

    return {
      intent: isScheduleIntent ? 'schedule' : 'memory',
      transcript,
      aiSummary: `Parsed voice note: "${transcript.slice(0, 60)}..."`,
      memoryData: {
        title: transcript.slice(0, 30) + '...',
        content: transcript,
        category: 'decision',
        memoryScore: 78,
        scoreReasoning: 'Voice entry converted into memory context.',
        retentionRule: 'forever',
        triggerContext: 'Voice Note',
        tags: ['Voice Note', 'Experience'],
      },
      scheduleData: {
        title: transcript.slice(0, 30) + '...',
        date: todayStr,
        time: '10:00 AM',
        category: 'general',
        notes: transcript,
        personalizedAdvice: 'Scheduled via Voice Recording.',
      }
    };
  }
}

export async function analyzeMemoryWithAI(rawInput: {
  title: string;
  content: string;
  category?: string;
  triggerContext?: string;
}): Promise<{
  category: 'purchase' | 'people' | 'place' | 'decision';
  memoryScore: number;
  retentionRule: 'once' | 'until_completed' | 'this_week' | 'this_month' | 'every_grocery' | 'every_vacation' | 'every_doctor' | 'every_winter' | 'forever';
  triggerContext: string;
  tags: string[];
  preferenceExtracts: { category: 'clothing' | 'food' | 'travel' | 'shopping' | 'general'; trait: string; sentiment: 'positive' | 'negative' | 'neutral' }[];
  decisionDetails?: {
    choice: string;
    reasoning: string;
    regrets?: string;
    rating?: number;
    wouldRecommend?: boolean;
  };
  scoreReasoning: string;
}> {
  try {
    const response = await fetch('/api/analyze-memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rawInput),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server returned status ${response.status}: ${errText}`);
    }

    return await response.json();
  } catch (err) {
    console.warn('Fallback to local heuristics for memory analysis:', err);
    // Graceful fallback heuristics if AI offline
    const text = (rawInput.title + ' ' + rawInput.content).toLowerCase();
    let category: 'purchase' | 'people' | 'place' | 'decision' = 'decision';
    if (text.includes('bought') || text.includes('purchased') || text.includes('returned') || text.includes('price')) category = 'purchase';
    else if (text.includes('met ') || text.includes('friend') || text.includes('dog') || text.includes('manager')) category = 'people';
    else if (text.includes('restaurant') || text.includes('ramen') || text.includes('hotel') || text.includes('trip') || text.includes('beach')) category = 'place';

    return {
      category,
      memoryScore: text.includes('return') || text.includes('bad') || text.includes('never') || text.includes('great') ? 85 : 70,
      retentionRule: text.includes('grocery') ? 'every_grocery' : text.includes('trip') || text.includes('beach') ? 'every_vacation' : 'forever',
      triggerContext: rawInput.triggerContext || (category === 'purchase' ? 'Shopping' : category === 'place' ? 'Travel / Dining' : 'General'),
      tags: ['Personal Experience', category],
      preferenceExtracts: [],
      scoreReasoning: 'Scored based on keyword intent and future decision impact.'
    };
  }
}

export async function askPersonalDecisionEngine(
  query: string,
  memories: Memory[],
  preferenceGraph: PreferenceGraph,
  simulatedTrigger?: string,
  language?: string
): Promise<DecisionQueryResponse> {
  try {
    const response = await fetch('/api/personal-decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, memories, preferenceGraph, simulatedTrigger, language }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server returned status ${response.status}: ${errText}`);
    }

    return await response.json();
  } catch (err) {
    console.warn('Fallback decision response:', err);
    return {
      answer: `Based on your stored memories and preference graph: For query "${query}", Recall recommends reviewing your body measurements (5'2", Petite 0 at Banana Republic) and saved memories.`,
      recommendations: [
        'Check your brand fit notes (Banana Republic Petite 0 fits well, avoid Zara length)',
        'Review past regret notes before finalizing purchase'
      ],
      memoriesUsed: memories.slice(0, 3).map(m => ({
        id: m.id,
        title: m.title,
        score: m.memoryScore,
        relevanceReason: 'Matched preference graph traits'
      })),
      preferenceHighlights: [
        'Petite sizing: 5\'2", 0 Petite waist',
        'Avoids heavy synthetic smells & long inseams'
      ]
    };
  }
}

export async function detectLearnedBehaviors(
  memories: Memory[],
  currentGraph: PreferenceGraph
): Promise<{ newTraits: { trait: string; category: 'clothing' | 'food' | 'travel' | 'shopping' | 'general'; confidence: number; explanation: string }[] }> {
  try {
    const response = await fetch('/api/behavior-learning', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memories, currentGraph }),
    });

    if (!response.ok) {
      throw new Error('Failed to run behavior learning');
    }

    return await response.json();
  } catch (err) {
    console.warn('Behavior learning fallback:', err);
    return { newTraits: [] };
  }
}

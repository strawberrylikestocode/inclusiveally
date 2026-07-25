export type MemoryCategory = 'purchase' | 'people' | 'place' | 'decision';

export type RetentionRule =
  | 'once'
  | 'until_completed'
  | 'this_week'
  | 'this_month'
  | 'every_grocery'
  | 'every_vacation'
  | 'every_doctor'
  | 'every_winter'
  | 'forever';

export interface DecisionDetails {
  choice: string;
  reasoning: string;
  regrets?: string;
  rating?: number; // 1 to 10
  wouldRecommend?: boolean;
}

export interface PreferenceExtract {
  category: 'clothing' | 'food' | 'travel' | 'shopping' | 'general';
  trait: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface Memory {
  id: string;
  title: string;
  content: string;
  category: MemoryCategory;
  memoryScore: number; // 1 to 100
  retentionRule: RetentionRule;
  triggerContext: string; // e.g. "Grocery Store", "Beach Trip", "Airport", "Pharmacy", "Temperature < 50°F"
  tags: string[];
  createdAt: string;
  updatedAt: string;
  decisionDetails?: DecisionDetails;
  preferenceExtracts?: PreferenceExtract[];
  isArchived?: boolean;
  linkedMemoryId?: string; // for connected threads
  threadTitle?: string;
}

export interface BodyProfile {
  height: string;
  weight: string;
  bodyBuild: string;
  bodyType: string;
  topSize: string;
  bottomSize: string;
  shoeSize: string;
  fitPreferences: string[];
}

export interface BrandPreference {
  brand: string;
  rating: number; // 1 to 10
  fitNotes: string;
  usualCategory: string;
}

export interface FoodPreference {
  favoriteCuisines: string[];
  dislikes: string[];
  dietaryRestrictions: string[];
  atmosphere: string[];
  spiceLevel: string;
  budget: string;
  location: string;
}

export interface TravelPreference {
  seatPreference: string;
  accommodation: string[];
  packingMusts: string[];
  forgottenItemsHistory: string[];
}

export interface ShoppingPreference {
  budgetRange: string;
  impulseBuyRules: string[];
  salePreference: boolean;
  returnReasons: string[];
}

export interface LearnedTrait {
  id: string;
  category: 'clothing' | 'food' | 'travel' | 'shopping' | 'general';
  trait: string;
  confidenceScore: number; // 1 to 100
  occurrences: number;
  sourceMemoryCount: number;
}

export interface PreferenceGraph {
  bodyProfile: BodyProfile;
  brandPreferences: BrandPreference[];
  foodPreferences: FoodPreference;
  travelPreferences: TravelPreference;
  shoppingPreferences: ShoppingPreference;
  learnedTraits: LearnedTrait[];
}

export interface DecisionQueryResponse {
  answer: string;
  recommendations: string[];
  memoriesUsed: {
    id: string;
    title: string;
    score: number;
    relevanceReason: string;
  }[];
  preferenceHighlights: string[];
  warningsOrRegrets?: string[];
}

export interface ContextTrigger {
  id: string;
  name: string;
  iconName: string;
  description: string;
  activeMemoriesCount: number;
}

export interface ScheduledEvent {
  id: string;
  title: string;
  date: string; // e.g. "2026-07-28"
  time?: string; // e.g. "09:30 AM"
  category: 'grocery' | 'clothing' | 'travel' | 'health' | 'tech' | 'general';
  location?: string;
  notes?: string;
  isCompleted?: boolean;
  autoAttachedMemories: {
    id: string;
    title: string;
    memoryScore: number;
    tip: string;
  }[];
  personalizedAdvice?: string;
}

export interface VoiceProcessedResult {
  intent: 'memory' | 'schedule' | 'both';
  transcript: string;
  aiSummary: string;
  memoryData?: {
    title: string;
    content: string;
    category: MemoryCategory;
    memoryScore: number;
    scoreReasoning: string;
    retentionRule: RetentionRule;
    triggerContext: string;
    tags: string[];
    preferenceExtracts?: PreferenceExtract[];
    decisionDetails?: DecisionDetails;
  };
  scheduleData?: {
    title: string;
    date: string;
    time?: string;
    category: 'grocery' | 'clothing' | 'travel' | 'health' | 'tech' | 'general';
    location?: string;
    notes?: string;
    personalizedAdvice?: string;
  };
}


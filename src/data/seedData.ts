import { Memory, PreferenceGraph, ContextTrigger, ScheduledEvent } from '../types';

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    title: 'Lenovo ThinkPad X1 Carbon Purchase Decision',
    content: 'Bought Lenovo ThinkPad X1 Carbon over Dell XPS 13 because battery life was rated 14hrs vs 8hrs, and trackpoint/keyboard felt vastly superior. Avoided Dell due to terrible customer support during last laptop issue.',
    category: 'decision',
    memoryScore: 92,
    retentionRule: 'forever',
    triggerContext: 'Electronics Shopping',
    tags: ['Laptop', 'Work Tech', 'Battery', 'High Score'],
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    decisionDetails: {
      choice: 'Lenovo ThinkPad X1 Carbon',
      reasoning: 'Better battery life (14h vs 8h) and reliable keyboard. Poor experience with Dell support.',
      regrets: 'None. Rated 9.5/10 after 6 months.',
      rating: 9,
      wouldRecommend: true,
    },
    preferenceExtracts: [
      { category: 'shopping', trait: 'Prioritizes battery life and reliability over aesthetics', sentiment: 'positive' },
      { category: 'shopping', trait: 'Avoids Dell products due to past support experiences', sentiment: 'negative' }
    ]
  },
  {
    id: 'mem-2',
    title: 'Air Fryer Ninja Max XL Return Thread - Step 1',
    content: 'Bought Ninja Max XL 5.5qt Air Fryer on Amazon for $119. Basket felt a bit small for batch meals and coating smelled plasticky initially.',
    category: 'purchase',
    memoryScore: 78,
    retentionRule: 'forever',
    triggerContext: 'Kitchen Appliances',
    tags: ['Ninja', 'Air Fryer', 'Kitchen'],
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    threadTitle: 'Air Fryer Saga'
  },
  {
    id: 'mem-3',
    title: 'Air Fryer Returned & Upgraded - Step 2',
    content: 'Returned Ninja Air Fryer after 25 days because basket was difficult to clean and plastic odor persisted. Replaced with Cosori Dual Blaze Stainless Steel (6.8qt) which fits 4 chicken breasts and cleans effortlessly.',
    category: 'purchase',
    memoryScore: 88,
    retentionRule: 'forever',
    triggerContext: 'Kitchen Appliances',
    tags: ['Cosori', 'Air Fryer', 'Return Reason'],
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    linkedMemoryId: 'mem-2',
    threadTitle: 'Air Fryer Saga',
    decisionDetails: {
      choice: 'Cosori Dual Blaze 6.8qt',
      reasoning: 'Non-stick basket cleans easily, no synthetic smell, true dual heating elements.',
      rating: 10,
      wouldRecommend: true
    },
    preferenceExtracts: [
      { category: 'shopping', trait: 'Prefers dual-heating ceramic/stainless basket cooking appliances', sentiment: 'positive' },
      { category: 'shopping', trait: 'Dislikes appliances with lingering chemical odors', sentiment: 'negative' }
    ]
  },
  {
    id: 'mem-4',
    title: 'Clothing Fit Notes: Banana Republic vs Zara vs Uniqlo',
    content: 'Banana Republic Petite 0 and XS tops fit body proportions perfectly (5\'2", high waist). Zara inseams are consistently 2-3 inches too long even in Small. Uniqlo Airism basics in XS are 10/10 value.',
    category: 'purchase',
    memoryScore: 95,
    retentionRule: 'forever',
    triggerContext: 'Clothes Shopping',
    tags: ['Sizing', 'Body Fit', 'Banana Republic', 'Zara', 'Uniqlo'],
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    preferenceExtracts: [
      { category: 'clothing', trait: 'Banana Republic Petite 0 is exact match for waist and length', sentiment: 'positive' },
      { category: 'clothing', trait: 'Zara pants inseam is too long - skip bottoms', sentiment: 'negative' },
      { category: 'clothing', trait: 'Uniqlo Airism XS is staple go-to', sentiment: 'positive' }
    ]
  },
  {
    id: 'mem-5',
    title: 'Ramen & Sushi Spot Preferences in Brooklyn',
    content: 'Kyuramen in Park Slope: Tonkotsu broth is incredible (mild spice, 10/10). Atmosphere is cozy and quiet. Avoid Ichiran during peak 7 PM hours due to 45-min loud wait line.',
    category: 'place',
    memoryScore: 85,
    retentionRule: 'forever',
    triggerContext: 'Dining Out',
    tags: ['Ramen', 'Sushi', 'Brooklyn', 'Quiet atmosphere'],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    decisionDetails: {
      choice: 'Kyuramen Park Slope',
      reasoning: 'Rich pork broth, peaceful seating booth, quick service.',
      rating: 9,
      wouldRecommend: true
    },
    preferenceExtracts: [
      { category: 'food', trait: 'Loves rich mild spice Tonkotsu ramen', sentiment: 'positive' },
      { category: 'food', trait: 'Dislikes restaurants with loud noise levels or >30 min waits', sentiment: 'negative' }
    ]
  },
  {
    id: 'mem-6',
    title: 'Remind: Organic Bananas & Oat Milk',
    content: 'Buy 2 bunches of slightly green bananas and Planet Oat Unsweetened Oat Milk. Coffee tastes significantly sweeter with Planet Oat compared to Chobani Oat.',
    category: 'purchase',
    memoryScore: 70,
    retentionRule: 'every_grocery',
    triggerContext: 'Grocery Store',
    tags: ['Grocery', 'Oat Milk', 'Bananas', 'Costco / Target'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    preferenceExtracts: [
      { category: 'food', trait: 'Prefers Planet Oat Unsweetened over Chobani', sentiment: 'positive' }
    ]
  },
  {
    id: 'mem-7',
    title: 'Beach Trip Packing List & Forgotten Items Lesson',
    content: 'Last Miami trip forgot SPF 50 mineral sunscreen, portable Anker charger, and waterproof sandals. Sunburn ruined Day 2. Always bring 10,000mAh battery pack and extra microfiber towel.',
    category: 'place',
    memoryScore: 90,
    retentionRule: 'every_vacation',
    triggerContext: 'Beach Trip / Travel',
    tags: ['Packing', 'Beach', 'Sunscreen', 'Anker Charger', 'Miami'],
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    decisionDetails: {
      choice: 'Pack list update for future beach trips',
      reasoning: 'Prevent repeating sunburn and dead phone emergency.',
      rating: 10
    },
    preferenceExtracts: [
      { category: 'travel', trait: 'Requires SPF 50 mineral sunscreen and powerbank on every beach trip', sentiment: 'positive' }
    ]
  },
  {
    id: 'mem-8',
    title: 'Met Sarah Jenkins @ Brooklyn TCG Collectibles',
    content: 'Met Sarah Jenkins at Brooklyn TCG meetup. She owns a vintage card shop in Williamsburg. Mentioned her golden retriever named "Waffles". She asked for a website design quote for her shop by end of month.',
    category: 'people',
    memoryScore: 86,
    retentionRule: 'this_month',
    triggerContext: 'Networking & Meetups',
    tags: ['Sarah Jenkins', 'Brooklyn TCG', 'Dog: Waffles', 'Web Quote'],
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    decisionDetails: {
      choice: 'Send Web Quote follow-up email before Friday',
      reasoning: 'High potential client and warm introduction.',
      wouldRecommend: true
    }
  },
  {
    id: 'mem-9',
    title: 'Shampoo Warning: Avoid Herbal Essences Argan Oil',
    content: 'Tried Herbal Essences Argan Oil shampoo. Left scalp feeling heavy and greasy after 12 hours. Stick to Pureology Hydrate or Living Proof Full.',
    category: 'purchase',
    memoryScore: 82,
    retentionRule: 'forever',
    triggerContext: 'Pharmacy / Bathroom Supplies',
    tags: ['Shampoo', 'Haircare', 'Avoid Product', 'Pharmacy'],
    createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    decisionDetails: {
      choice: 'Never buy Herbal Essences again',
      reasoning: 'Heavy buildup and greasy scalp.',
      rating: 2,
      wouldRecommend: false
    },
    preferenceExtracts: [
      { category: 'shopping', trait: 'Avoid heavy oil shampoos; prefers lightweight hydrating formulas', sentiment: 'negative' }
    ]
  }
];

export const INITIAL_PREFERENCE_GRAPH: PreferenceGraph = {
  bodyProfile: {
    height: "5'2\"",
    weight: '118 lbs',
    bodyBuild: 'Petite Slim Build',
    bodyType: 'High-Waisted / Short Inseam',
    topSize: 'XS / 0',
    bottomSize: '0 Petite / 24 Waist',
    shoeSize: '6.5 US Women',
    fitPreferences: [
      'Prefers high-rise waistline bottoms',
      'Short inseams (25"-27" max ankle crop)',
      'Natural breathable fabrics (cotton, linen, airism)',
      'Fitted shoulders with relaxed chest cuts'
    ]
  },
  brandPreferences: [
    { brand: 'Banana Republic', rating: 9.5, fitNotes: 'Petite 0 pants and XS blazers fit perfectly without tailoring.', usualCategory: 'Workwear / Business Casual' },
    { brand: 'Uniqlo', rating: 9, fitNotes: 'Airism tees (XS) and cropped cardigans are staple 10/10 value.', usualCategory: 'Everyday Basics' },
    { brand: 'Zara', rating: 3, fitNotes: 'Pants inseams run 3 inches too long. Tops tend to fit stiffly.', usualCategory: 'Fast Fashion (Avoid Bottoms)' },
    { brand: 'Cosori', rating: 9.5, fitNotes: 'Kitchen appliances with stainless dual heating elements.', usualCategory: 'Kitchen Tech' },
    { brand: 'Lenovo', rating: 9.2, fitNotes: 'X1 Carbon line preferred over Dell due to battery and keyboards.', usualCategory: 'Laptops / Tech' }
  ],
  foodPreferences: {
    favoriteCuisines: ['Japanese / Ramen & Sushi', 'Korean BBQ', 'Thai Curry', 'Italian Pasta', 'Mediterranean'],
    dislikes: ['Overly sweet desserts / syrupy boba', 'Heavy fried fast food', 'Raw cilantro in large amounts'],
    dietaryRestrictions: ['Lactose sensitive (prefers Oat/Almond milk)', 'Low Sodium preference'],
    atmosphere: ['Cozy booths', 'Low-to-medium volume acoustic ambient', 'No long outdoor queues (>20 mins)'],
    spiceLevel: 'Medium-High (Enjoys habanero & chili oil)',
    budget: '$$ ($15 - $30 per meal)',
    location: 'Brooklyn & SoHo, New York'
  },
  travelPreferences: {
    seatPreference: 'Window seat (Right side of aircraft)',
    accommodation: ['Quiet Boutique Hotels', 'Airbnbs with dedicated workspace'],
    packingMusts: ['10,000mAh Anker Portable Powerbank', 'SPF 50 Mineral Sunscreen', 'Noise-canceling headphones', 'Microfiber quick-dry towel'],
    forgottenItemsHistory: ['Sunscreen in Miami (2025)', 'Multi-country outlet adapter in Tokyo (2024)']
  },
  shoppingPreferences: {
    budgetRange: '$40 - $120 per clothing item | Tech $500 - $1500',
    impulseBuyRules: ['Wait 48 hours for electronics over $200', 'Check return policy window before buying appliance'],
    salePreference: true,
    returnReasons: ['Uncomfortable fabric / synthetic smell', 'Inseam length mismatch', 'Poor battery life']
  },
  learnedTraits: [
    {
      id: 'trait-1',
      category: 'clothing',
      trait: 'Repeatedly buys Uniqlo XS basics and rates them 9/10+',
      confidenceScore: 98,
      occurrences: 5,
      sourceMemoryCount: 3
    },
    {
      id: 'trait-2',
      category: 'food',
      trait: 'Consistently avoids noisy restaurants with wait times exceeding 30 minutes',
      confidenceScore: 92,
      occurrences: 4,
      sourceMemoryCount: 2
    },
    {
      id: 'trait-3',
      category: 'travel',
      trait: 'Auto-includes Anker portable charger & mineral sunscreen on any trip tagged Beach or Vacation',
      confidenceScore: 95,
      occurrences: 3,
      sourceMemoryCount: 2
    },
    {
      id: 'trait-4',
      category: 'shopping',
      trait: 'Prefers long battery life and ergonomics over ultra-thin laptop design',
      confidenceScore: 90,
      occurrences: 2,
      sourceMemoryCount: 1
    }
  ]
};

export const INITIAL_SCHEDULED_EVENTS: ScheduledEvent[] = [
  {
    id: 'sched-1',
    title: 'Weekly Costco Grocery Run',
    date: '2026-07-28',
    time: '09:30 AM',
    category: 'grocery',
    location: 'Costco Wholesale - Sunset Park',
    notes: 'Restock kitchen staples and oat milk.',
    isCompleted: false,
    autoAttachedMemories: [
      {
        id: 'mem-6',
        title: 'Remind: Organic Bananas & Oat Milk',
        memoryScore: 70,
        tip: 'Buy Planet Oat Unsweetened over Chobani Oat. Pick 2 bunches slightly green bananas.'
      }
    ],
    personalizedAdvice: 'Optimal time is Tuesday morning 9:30 AM to avoid 40-minute weekend checkout lines based on past preferences.'
  },
  {
    id: 'sched-2',
    title: 'Miami Weekend Beach Getaway',
    date: '2026-08-14',
    time: '08:00 AM',
    category: 'travel',
    location: 'South Beach, Miami FL',
    notes: 'Packing and flight prep.',
    isCompleted: false,
    autoAttachedMemories: [
      {
        id: 'mem-7',
        title: 'Beach Trip Packing List & Forgotten Items Lesson',
        memoryScore: 90,
        tip: 'CRITICAL: Must pack SPF 50 Mineral Sunscreen & 10,000mAh Anker charger to avoid past Miami sunburn emergency.'
      }
    ],
    personalizedAdvice: 'Recall auto-linked your Miami 2025 memory. Ensure window seat right side is requested.'
  },
  {
    id: 'sched-3',
    title: 'Fall Workwear Wardrobe Refresh',
    date: '2026-08-20',
    time: '02:00 PM',
    category: 'clothing',
    location: 'Banana Republic & Uniqlo SoHo',
    notes: 'Looking for Petite blazer and XS basics.',
    isCompleted: false,
    autoAttachedMemories: [
      {
        id: 'mem-4',
        title: 'Clothing Fit Notes: Banana Republic vs Zara vs Uniqlo',
        memoryScore: 95,
        tip: 'Banana Republic Petite 0 and XS fit perfectly without tailoring. Skip Zara bottoms (inseam +3" too long).'
      }
    ],
    personalizedAdvice: 'Target Banana Republic Petite 0 tops/blazers and Uniqlo Airism XS basics.'
  }
];

export const CONTEXT_TRIGGERS: ContextTrigger[] = [
  {
    id: 'trig-grocery',
    name: 'At Grocery Store',
    iconName: 'ShoppingCart',
    description: 'Surfaces buy lists, ingredient preferences, & price notes (Costco vs Target)',
    activeMemoriesCount: 2
  },
  {
    id: 'trig-beach',
    name: 'Beach Trip / Travel',
    iconName: 'Sun',
    description: 'Surfaces packing checklists, forgotten items history, & hotel preferences',
    activeMemoriesCount: 2
  },
  {
    id: 'trig-clothes',
    name: 'Browsing Clothes',
    iconName: 'Shirt',
    description: 'Surfaces body measurements, brand inseams (Banana Republic vs Zara), & budget',
    activeMemoriesCount: 2
  },
  {
    id: 'trig-tech',
    name: 'Buying Electronics',
    iconName: 'Laptop',
    description: 'Surfaces past decision reasoning, battery preferences, & brand support ratings',
    activeMemoriesCount: 2
  },
  {
    id: 'trig-pharmacy',
    name: 'At Pharmacy / Bath',
    iconName: 'Pill',
    description: 'Surfaces shampoos/products to avoid and past skincare reactions',
    activeMemoriesCount: 1
  }
];

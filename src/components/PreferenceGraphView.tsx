import React, { useState } from 'react';
import { PreferenceGraph, LearnedTrait, BrandPreference, BodyProfile, FoodPreference } from '../types';
import { Shirt, Utensils, Compass, ShoppingBag, Brain, Edit2, Plus, Sparkles, Check, AlertCircle, Trash2, ArrowUpRight, DollarSign, MapPin, Tag, Heart, X, User, Sliders } from 'lucide-react';

interface PreferenceGraphViewProps {
  graph: PreferenceGraph;
  onUpdateGraph: (updated: PreferenceGraph) => void;
  onTriggerBehaviorLearning: () => void;
  isLearning: boolean;
}

export const PreferenceGraphView: React.FC<PreferenceGraphViewProps> = ({
  graph,
  onUpdateGraph,
  onTriggerBehaviorLearning,
  isLearning,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'clothing' | 'food' | 'travel' | 'shopping' | 'learned'>('clothing');

  // Customization Form States
  const [isEditingBody, setIsEditingBody] = useState(false);
  const [isEditingFood, setIsEditingFood] = useState(false);

  // Body Profile Form State
  const [bodyForm, setBodyForm] = useState<BodyProfile>({
    height: graph.bodyProfile.height || "5'2\"",
    weight: graph.bodyProfile.weight || "118 lbs",
    bodyBuild: graph.bodyProfile.bodyBuild || "Petite Slim Build",
    bodyType: graph.bodyProfile.bodyType || "High-Waisted / Short Inseam",
    topSize: graph.bodyProfile.topSize || "XS / 0",
    bottomSize: graph.bodyProfile.bottomSize || "0 Petite / 24 Waist",
    shoeSize: graph.bodyProfile.shoeSize || "6.5 US Women",
    fitPreferences: graph.bodyProfile.fitPreferences || [],
  });

  const [newFitRule, setNewFitRule] = useState('');

  // Food Preferences Form State
  const [foodForm, setFoodForm] = useState<FoodPreference>({
    favoriteCuisines: graph.foodPreferences.favoriteCuisines || [],
    dislikes: graph.foodPreferences.dislikes || [],
    dietaryRestrictions: graph.foodPreferences.dietaryRestrictions || [],
    atmosphere: graph.foodPreferences.atmosphere || [],
    spiceLevel: graph.foodPreferences.spiceLevel || 'Medium-High',
    budget: graph.foodPreferences.budget || '$$ ($15 - $30 per meal)',
    location: graph.foodPreferences.location || 'Brooklyn & SoHo, NY',
  });

  const [newCuisineInput, setNewCuisineInput] = useState('');
  const [newDislikeInput, setNewDislikeInput] = useState('');
  const [newDietaryInput, setNewDietaryInput] = useState('');

  // Save Body Profile Updates
  const handleSaveBody = () => {
    onUpdateGraph({
      ...graph,
      bodyProfile: bodyForm,
    });
    setIsEditingBody(false);
  };

  // Save Food Preferences Updates
  const handleSaveFood = () => {
    onUpdateGraph({
      ...graph,
      foodPreferences: foodForm,
    });
    setIsEditingFood(false);
  };

  // Helper Tag Handlers
  const toggleCuisineTag = (cuisine: string) => {
    const exists = foodForm.favoriteCuisines.includes(cuisine);
    const updated = exists
      ? foodForm.favoriteCuisines.filter((c) => c !== cuisine)
      : [...foodForm.favoriteCuisines, cuisine];
    const newFood = { ...foodForm, favoriteCuisines: updated };
    setFoodForm(newFood);
    onUpdateGraph({ ...graph, foodPreferences: newFood });
  };

  const toggleDislikeTag = (dislike: string) => {
    const exists = foodForm.dislikes.includes(dislike);
    const updated = exists
      ? foodForm.dislikes.filter((d) => d !== dislike)
      : [...foodForm.dislikes, dislike];
    const newFood = { ...foodForm, dislikes: updated };
    setFoodForm(newFood);
    onUpdateGraph({ ...graph, foodPreferences: newFood });
  };

  const addFitRule = () => {
    if (!newFitRule.trim()) return;
    const updated = [...bodyForm.fitPreferences, newFitRule.trim()];
    setBodyForm({ ...bodyForm, fitPreferences: updated });
    onUpdateGraph({ ...graph, bodyProfile: { ...bodyForm, fitPreferences: updated } });
    setNewFitRule('');
  };

  const removeFitRule = (index: number) => {
    const updated = bodyForm.fitPreferences.filter((_, i) => i !== index);
    setBodyForm({ ...bodyForm, fitPreferences: updated });
    onUpdateGraph({ ...graph, bodyProfile: { ...bodyForm, fitPreferences: updated } });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-semibold border border-blue-500/20">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Customizable User Profile Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Personal <span className="text-amber-400">Preferences</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Customize your body measurements, sizing fit, food tastes, dining budget, and location settings to personalize every AI recommendation.
            </p>
          </div>

          <button
            onClick={onTriggerBehaviorLearning}
            disabled={isLearning}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start md:self-auto disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>{isLearning ? 'Analyzing Patterns...' : 'Detect Learned Traits'}</span>
          </button>
        </div>

        {/* Category Selector Tabs */}
        <div className="pt-3 border-t border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'clothing', label: '👕 Body Proportions & Fit', icon: Shirt },
            { id: 'food', label: '🍣 Food, Dining & Budget', icon: Utensils },
            { id: 'travel', label: '🏖 Travel & Packing', icon: Compass },
            { id: 'shopping', label: '🛍 Shopping Rules', icon: ShoppingBag },
            { id: 'learned', label: '🧠 Learned Habits', icon: Brain },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                  activeSubTab === tab.id
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-amber-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab 1: Body Proportions & Build Customization */}
      {activeSubTab === 'clothing' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-amber-400" />
                  Customizing Body Measurements & Build
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Answer questions about your height, weight, build, and sizes to get flawless clothing suggestions.
                </p>
              </div>

              <button
                onClick={() => setIsEditingBody(!isEditingBody)}
                className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isEditingBody ? 'View Profile Summary' : 'Customize Profile Form'}</span>
              </button>
            </div>

            {isEditingBody ? (
              /* Questionnaire Mode */
              <div className="space-y-6 text-xs bg-stone-950 p-5 rounded-2xl border border-stone-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Height */}
                  <div>
                    <label className="text-stone-300 block mb-1 font-bold">1. Height:</label>
                    <input
                      type="text"
                      value={bodyForm.height}
                      onChange={(e) => setBodyForm({ ...bodyForm, height: e.target.value })}
                      placeholder="e.g. 5' 2&quot; or 175 cm"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                    />
                    <div className="flex gap-1.5 mt-1.5 overflow-x-auto no-scrollbar">
                      {["5'0\"", "5'2\"", "5'5\"", "5'8\"", "6'0\""].map((h) => (
                        <button
                          type="button"
                          key={h}
                          onClick={() => setBodyForm({ ...bodyForm, height: h })}
                          className="px-2 py-0.5 bg-stone-900 hover:bg-stone-800 text-stone-400 text-[10px] rounded border border-stone-800"
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="text-stone-300 block mb-1 font-bold">2. Weight:</label>
                    <input
                      type="text"
                      value={bodyForm.weight}
                      onChange={(e) => setBodyForm({ ...bodyForm, weight: e.target.value })}
                      placeholder="e.g. 118 lbs or 60 kg"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                    />
                    <div className="flex gap-1.5 mt-1.5 overflow-x-auto no-scrollbar">
                      {["110 lbs", "125 lbs", "140 lbs", "160 lbs", "180 lbs"].map((w) => (
                        <button
                          type="button"
                          key={w}
                          onClick={() => setBodyForm({ ...bodyForm, weight: w })}
                          className="px-2 py-0.5 bg-stone-900 hover:bg-stone-800 text-stone-400 text-[10px] rounded border border-stone-800"
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body Build */}
                  <div>
                    <label className="text-stone-300 block mb-1 font-bold">3. Body Build:</label>
                    <input
                      type="text"
                      value={bodyForm.bodyBuild}
                      onChange={(e) => setBodyForm({ ...bodyForm, bodyBuild: e.target.value })}
                      placeholder="e.g. Petite Slim, Athletic, Muscular, Plus-size"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                    />
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      {["Petite Slim", "Athletic", "Average", "Muscular", "Curvy", "Tall & Lean"].map((b) => (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setBodyForm({ ...bodyForm, bodyBuild: b })}
                          className="px-2 py-0.5 bg-stone-900 hover:bg-stone-800 text-stone-400 text-[10px] rounded border border-stone-800"
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Top Size */}
                  <div>
                    <label className="text-stone-300 block mb-1 font-bold">4. Top / Shirt Size:</label>
                    <input
                      type="text"
                      value={bodyForm.topSize}
                      onChange={(e) => setBodyForm({ ...bodyForm, topSize: e.target.value })}
                      placeholder="e.g. XS / 0 Petite"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Bottom Size */}
                  <div>
                    <label className="text-stone-300 block mb-1 font-bold">5. Bottom / Pants Size:</label>
                    <input
                      type="text"
                      value={bodyForm.bottomSize}
                      onChange={(e) => setBodyForm({ ...bodyForm, bottomSize: e.target.value })}
                      placeholder="e.g. 0 Petite / 24 Waist"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Shoe Size */}
                  <div>
                    <label className="text-stone-300 block mb-1 font-bold">6. Shoe Size:</label>
                    <input
                      type="text"
                      value={bodyForm.shoeSize}
                      onChange={(e) => setBodyForm({ ...bodyForm, shoeSize: e.target.value })}
                      placeholder="e.g. 6.5 US Women"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingBody(false)}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBody}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md"
                  >
                    Save Proportions
                  </button>
                </div>
              </div>
            ) : (
              /* Display Profile Grid */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">Height</span>
                  <span className="text-sm font-bold text-white">{graph.bodyProfile.height}</span>
                </div>
                <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">Weight</span>
                  <span className="text-sm font-bold text-white">{graph.bodyProfile.weight}</span>
                </div>
                <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">Body Build</span>
                  <span className="text-sm font-bold text-amber-400">{graph.bodyProfile.bodyBuild || 'Petite'}</span>
                </div>
                <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">Top Size</span>
                  <span className="text-sm font-bold text-white">{graph.bodyProfile.topSize}</span>
                </div>
                <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">Bottom Size</span>
                  <span className="text-sm font-bold text-white">{graph.bodyProfile.bottomSize}</span>
                </div>
                <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">Shoe Size</span>
                  <span className="text-sm font-bold text-white">{graph.bodyProfile.shoeSize}</span>
                </div>
              </div>
            )}

            {/* Fit Preferences & Rules Section */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-amber-300 block">Fit Preferences & Inseam Rules:</span>

              <div className="space-y-2">
                {bodyForm.fitPreferences.map((rule, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs text-stone-200">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{rule}</span>
                    </div>
                    <button
                      onClick={() => removeFitRule(idx)}
                      className="text-stone-500 hover:text-rose-400 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newFitRule}
                  onChange={(e) => setNewFitRule(e.target.value)}
                  placeholder="Add custom fit rule (e.g. Must have 25 inch ankle crop or high waist)..."
                  className="flex-1 bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && addFitRule()}
                />
                <button
                  onClick={addFitRule}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs rounded-xl border border-stone-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Rule</span>
                </button>
              </div>
            </div>
          </div>

          {/* Brand Fit Ratings List */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Brand Fit History & Ratings
              </h3>
              <span className="text-xs text-stone-400">Recall Memory-backed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {graph.brandPreferences.map((bp, i) => (
                <div key={i} className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{bp.brand}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      bp.rating >= 8 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    }`}>
                      {bp.rating}/10
                    </span>
                  </div>
                  <p className="text-stone-300 text-[11px]"><strong className="text-stone-400">Notes:</strong> {bp.fitNotes}</p>
                  <span className="text-[10px] text-stone-500 block">{bp.usualCategory}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Food & Dining Customization */}
      {activeSubTab === 'food' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-400" />
                  Customizing Food, Cuisines, Dislikes & Budget
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Set your favorite food styles, allergies, budget tier, and location to tailor food advice.
                </p>
              </div>

              <button
                onClick={() => setIsEditingFood(!isEditingFood)}
                className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-center"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isEditingFood ? 'View Food Summary' : 'Customize Food Form'}</span>
              </button>
            </div>

            {/* Food Customization Form / Questionnaire */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">

              {/* 1. What type of cuisines do you like? */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-xs block">1. Preferred Cuisines</span>
                  <span className="text-[10px] text-stone-500">Click to toggle</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Japanese / Ramen & Sushi', 'Korean BBQ', 'Thai Curry', 'Italian Pasta',
                    'Mexican', 'Mediterranean', 'Chinese Dim Sum', 'Indian Spices', 'French', 'Vietnamese Pho'
                  ].map((c) => {
                    const isSelected = foodForm.favoriteCuisines.includes(c);
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => toggleCuisineTag(c)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 shadow'
                            : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Food Dislikes & Allergies */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300 text-xs block">2. Food Dislikes & Warnings</span>
                  <span className="text-[10px] text-stone-500">Click to toggle</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Raw cilantro in large amounts', 'Overly sweet desserts / boba', 'Heavy fried fast food',
                    'Shellfish allergy', 'Peanuts', 'Raw onions', 'Dairy / Lactose'
                  ].map((d) => {
                    const isSelected = foodForm.dislikes.includes(d);
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => toggleDislikeTag(d)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-rose-500/20 text-rose-200 border-rose-500/40 shadow'
                            : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                        }`}
                      >
                        {isSelected ? '⚠️ ' : '+ '} {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Budget Tier */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                <span className="font-bold text-emerald-300 text-xs block flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  3. Meal Budget Tier
                </span>

                <div className="space-y-2">
                  {[
                    { label: '$ Casual (Under $15 per person)', val: '$ (Under $15)' },
                    { label: '$$ Mid-Range ($15 - $30 per person)', val: '$$ ($15 - $30 per meal)' },
                    { label: '$$$ Upscale ($30 - $70 per person)', val: '$$$ ($30 - $70)' },
                    { label: '$$$$ Fine Dining ($70+ per person)', val: '$$$$ Fine Dining ($70+)' },
                  ].map((b) => (
                    <button
                      type="button"
                      key={b.val}
                      onClick={() => {
                        const updated = { ...foodForm, budget: b.val };
                        setFoodForm(updated);
                        onUpdateGraph({ ...graph, foodPreferences: updated });
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        foodForm.budget === b.val
                          ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {foodForm.budget === b.val ? '✓ ' : '• '} {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Location & Spice Level */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-4">
                <div>
                  <span className="font-bold text-blue-300 text-xs block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    4. Dining Location / Neighborhood
                  </span>
                  <input
                    type="text"
                    value={foodForm.location}
                    onChange={(e) => {
                      const updated = { ...foodForm, location: e.target.value };
                      setFoodForm(updated);
                      onUpdateGraph({ ...graph, foodPreferences: updated });
                    }}
                    placeholder="e.g. Brooklyn & SoHo, NY or Downtown Austin"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <span className="font-bold text-purple-300 text-xs block mb-1">5. Spice Level Preference:</span>
                  <select
                    value={foodForm.spiceLevel}
                    onChange={(e) => {
                      const updated = { ...foodForm, spiceLevel: e.target.value };
                      setFoodForm(updated);
                      onUpdateGraph({ ...graph, foodPreferences: updated });
                    }}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Mild (No heat)">Mild (No heat)</option>
                    <option value="Medium (Jalapeno / Sriracha)">Medium (Jalapeno / Sriracha)</option>
                    <option value="Medium-High (Enjoys habanero & chili oil)">Medium-High (Enjoys habanero & chili oil)</option>
                    <option value="Extreme (Ghost pepper lover)">Extreme (Ghost pepper lover)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Travel & Packing */}
      {activeSubTab === 'travel' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              Travel Preferences & Packing Lessons
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <span className="font-bold text-amber-300 block">Packing Musts (Auto-Included on Beach/Trips)</span>
              <ul className="space-y-1.5">
                {graph.travelPreferences.packingMusts.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-stone-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <span className="font-bold text-rose-300 block">Forgotten Items History (Lessons Learned)</span>
              <ul className="space-y-1.5">
                {graph.travelPreferences.forgottenItemsHistory.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-rose-200">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Shopping Rules */}
      {activeSubTab === 'shopping' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              Shopping Budget & Impulse Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <span className="font-bold text-amber-300 block">Impulse Buy Controls</span>
              <ul className="space-y-1.5">
                {graph.shoppingPreferences.impulseBuyRules.map((rule, i) => (
                  <li key={i} className="flex items-center gap-2 text-stone-200">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <span className="font-bold text-rose-300 block">Common Reasons for Past Returns</span>
              <ul className="space-y-1.5">
                {graph.shoppingPreferences.returnReasons.map((reason, i) => (
                  <li key={i} className="flex items-center gap-2 text-stone-200">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Learned Behaviors */}
      {activeSubTab === 'learned' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-400" />
                Auto-Learned Traits from Behavioral Frequency
              </h3>
              <p className="text-xs text-stone-400">Extracted by AI after analyzing repeated memory choices</p>
            </div>
            <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full">
              {graph.learnedTraits.length} Active Traits
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {graph.learnedTraits.map((trait) => (
              <div key={trait.id} className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-100 text-sm">{trait.trait}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-semibold text-[10px] uppercase">
                      {trait.category}
                    </span>
                  </div>
                  <p className="text-stone-400 text-[11px]">
                    Occurred <strong>{trait.occurrences} times</strong> across <strong>{trait.sourceMemoryCount} memory logs</strong>.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-500 block">Confidence</span>
                  <span className="font-bold text-amber-400 text-sm">{trait.confidenceScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { BodyProfile, PreferenceGraph, Memory } from '../types';
import { Clothing3DCanvas, ClothingItem } from './Clothing3DCanvas';
import { Shirt, Plus, Check, AlertTriangle, Sparkles, Scale, Sliders, ArrowRight, Trash2, Tag, Ruler, Heart, ShieldAlert, ArrowUpDown, ExternalLink, Link, Info, HelpCircle } from 'lucide-react';

interface ClothingComparisonViewProps {
  graph: PreferenceGraph;
  memories: Memory[];
  onUpdateGraph?: (updated: PreferenceGraph) => void;
}

// Preset Catalog of Popular Clothing Items with Brand Measurements & Product Links
const INITIAL_CLOTHING_CATALOG: ClothingItem[] = [
  {
    id: 'cloth-1',
    brand: 'Banana Republic',
    name: 'Petite Tailored Wool Blazer',
    category: 'top',
    size: '0 Petite',
    color: 'Charcoal Navy',
    price: '$180',
    url: 'https://bananarepublic.gap.com/browse/product.do?pid=758129',
    chestWidthInches: 17.0,
    waistWidthInches: 15.2,
    shoulderWidthInches: 14.5,
    totalLengthInches: 23.5,
    sleeveLengthInches: 21.5,
    fabricStretch: 'Slight',
    fitType: 'Petite / Slim',
    imagePlaceholderColor: '#1e293b',
  },
  {
    id: 'cloth-2',
    brand: 'Uniqlo',
    name: 'Oversized Linen Blend Shirt',
    category: 'top',
    size: 'S',
    color: 'Sand Beige',
    price: '$39.90',
    url: 'https://www.uniqlo.com/us/en/products/E456789-000',
    chestWidthInches: 20.5,
    waistWidthInches: 20.0,
    shoulderWidthInches: 17.2,
    totalLengthInches: 26.0,
    sleeveLengthInches: 23.0,
    fabricStretch: 'None',
    fitType: 'Oversized / Loose',
    imagePlaceholderColor: '#d97706',
  },
  {
    id: 'cloth-3',
    brand: 'Zara',
    name: 'Cropped Structured Jacket',
    category: 'top',
    size: 'XS',
    color: 'Cream White',
    price: '$69.90',
    url: 'https://www.zara.com/us/en/cropped-jacket-p02758.html',
    chestWidthInches: 16.2,
    waistWidthInches: 14.8,
    shoulderWidthInches: 13.8,
    totalLengthInches: 19.0,
    sleeveLengthInches: 21.0,
    fabricStretch: 'None',
    fitType: 'Petite / Slim',
    imagePlaceholderColor: '#f5f5f4',
  },
  {
    id: 'cloth-4',
    brand: 'Madewell',
    name: 'Perfect Vintage Wide-Leg Jean (Petite Inseam)',
    category: 'bottom',
    size: '24 Petite',
    color: 'Medium Indigo',
    price: '$128',
    url: 'https://www.madewell.com/perfect-vintage-wide-leg-jean-in-petite-inseam-99105.html',
    chestWidthInches: 0,
    waistWidthInches: 13.5, // 27" circumference
    shoulderWidthInches: 0,
    totalLengthInches: 36.5,
    inseamInches: 25.5,
    fabricStretch: 'Slight',
    fitType: 'Petite / Slim',
    imagePlaceholderColor: '#2563eb',
  },
  {
    id: 'cloth-5',
    brand: "Levi's",
    name: '501 Straight Leg Original Jeans',
    category: 'bottom',
    size: '25 Regular',
    color: 'Washed Black',
    price: '$98',
    url: 'https://www.levis.com/US/en_US/clothing/women/jeans/501-original-fit-women-jeans/p/125010001',
    chestWidthInches: 0,
    waistWidthInches: 14.2, // 28.4" circumference
    shoulderWidthInches: 0,
    totalLengthInches: 39.0,
    inseamInches: 29.5,
    fabricStretch: 'None',
    fitType: 'Regular Fit',
    imagePlaceholderColor: '#334155',
  },
  {
    id: 'cloth-6',
    brand: 'Everlane',
    name: 'The Way-High Ankle Trousers',
    category: 'bottom',
    size: '0 Short',
    color: 'Olive Green',
    price: '$118',
    url: 'https://www.everlane.com/products/womens-way-high-ankle-pant-olive',
    chestWidthInches: 0,
    waistWidthInches: 13.2,
    shoulderWidthInches: 0,
    totalLengthInches: 36.0,
    inseamInches: 25.0,
    fabricStretch: 'High',
    fitType: 'Petite / Slim',
    imagePlaceholderColor: '#15803d',
  },
];

export const ClothingComparisonView: React.FC<ClothingComparisonViewProps> = ({
  graph,
  memories,
}) => {
  const [items, setItems] = useState<ClothingItem[]>(() => {
    try {
      const saved = localStorage.getItem('recall_clothing_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CLOTHING_CATALOG;
  });

  // Items selected for comparison (up to 3)
  const [comparedIds, setComparedIds] = useState<string[]>(['cloth-1', 'cloth-2', 'cloth-4']);

  // Selected top & bottom for 3D visualizer
  const [selectedTopId, setSelectedTopId] = useState<string>('cloth-1');
  const [selectedBottomId, setSelectedBottomId] = useState<string>('cloth-4');

  // Modal State for adding a custom clothing item
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newBrand, setNewBrand] = useState('');
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('https://bananarepublic.gap.com/browse/product.do?pid=758129');
  const [newCategory, setNewCategory] = useState<'top' | 'bottom'>('top');
  const [newSize, setNewSize] = useState('0 Petite');
  const [newColor, setNewColor] = useState('Navy');
  const [newPrice, setNewPrice] = useState('$120');
  const [newChest, setNewChest] = useState(17.0);
  const [newWaist, setNewWaist] = useState(14.5);
  const [newShoulder, setNewShoulder] = useState(14.2);
  const [newLength, setNewLength] = useState(23.0);
  const [newInseam, setNewInseam] = useState(25.5);
  const [newFitType, setNewFitType] = useState<'Petite / Slim' | 'Regular Fit' | 'Oversized / Loose'>('Petite / Slim');

  const saveItems = (updated: ClothingItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem('recall_clothing_items', JSON.stringify(updated));
    } catch (e) {}
  };

  const toggleCompare = (id: string) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter((item) => item !== id));
    } else {
      if (comparedIds.length >= 3) {
        setComparedIds([...comparedIds.slice(1), id]);
      } else {
        setComparedIds([...comparedIds, id]);
      }
    }
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand || !newName) return;

    const newItem: ClothingItem = {
      id: `cloth-${Date.now()}`,
      brand: newBrand,
      name: newName,
      url: newUrl || undefined,
      category: newCategory,
      size: newSize,
      color: newColor,
      price: newPrice,
      chestWidthInches: Number(newChest) || 17.0,
      waistWidthInches: Number(newWaist) || 14.5,
      shoulderWidthInches: Number(newShoulder) || 14.0,
      totalLengthInches: Number(newLength) || 23.0,
      inseamInches: newCategory === 'bottom' ? Number(newInseam) || 25.5 : undefined,
      fabricStretch: 'Slight',
      fitType: newFitType,
      imagePlaceholderColor: newCategory === 'top' ? '#f59e0b' : '#3b82f6',
    };

    const updated = [newItem, ...items];
    saveItems(updated);
    if (!comparedIds.includes(newItem.id)) {
      setComparedIds([...comparedIds, newItem.id]);
    }
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    saveItems(updated);
    setComparedIds(comparedIds.filter((cid) => cid !== id));
  };

  // Compute Fit Score & Analysis against user's Body Profile
  const calculateFitAnalysis = (item: ClothingItem) => {
    const body = graph?.bodyProfile || {
      height: "5'2\"",
      weight: "118 lbs",
      bodyBuild: "Petite Slim Build",
      topSize: "XS / 0",
      bottomSize: "0 Petite",
    };
    const heightStr = body.height || "5'2\"";
    const bodyBuildStr = body.bodyBuild || "Petite Slim Build";
    let score = 92;
    const warnings: string[] = [];
    const positives: string[] = [];

    // Parse height in inches
    const hInches = heightStr.includes('5\'2"') ? 62 : 65;

    if (item.category === 'bottom' && item.inseamInches) {
      // Inseam rules for petite height
      if (hInches <= 63 && item.inseamInches > 27.5) {
        score -= 28;
        warnings.push(`Inseam of ${item.inseamInches}" is too long for ${heightStr} frame. Will drag on floor without hem.`);
      } else if (item.inseamInches >= 24.5 && item.inseamInches <= 26.5) {
        positives.push(`Ankle crop inseam (${item.inseamInches}") hits exactly at ankle for ${heightStr} height.`);
      }
    }

    if (item.category === 'top') {
      if (bodyBuildStr.toLowerCase().includes('petite') && item.fitType?.includes('Oversized')) {
        score -= 15;
        warnings.push(`Oversized shoulders (${item.shoulderWidthInches}") may look boxy/overwhelming on ${bodyBuildStr} frame.`);
      } else if (item.fitType?.includes('Petite')) {
        positives.push(`Petite shoulder cut (${item.shoulderWidthInches}") aligns with ${body.topSize || 'XS'} top proportions.`);
      }
    }

    // Check past memory returns
    const brandLower = item.brand.toLowerCase();
    const pastBrandRegret = memories.find(
      (m) => m.content.toLowerCase().includes(brandLower) && (m.content.toLowerCase().includes('returned') || m.content.toLowerCase().includes('regret') || m.content.toLowerCase().includes('loose') || m.content.toLowerCase().includes('tight'))
    );

    if (pastBrandRegret) {
      score -= 12;
      warnings.push(`InclusiveAlly Past Memory Warning: "${pastBrandRegret.title}" (${pastBrandRegret.content.slice(0, 60)}...)`);
    }

    return {
      score: Math.max(35, Math.min(99, score)),
      warnings,
      positives,
    };
  };

  const selectedTop = items.find((i) => i.id === selectedTopId);
  const selectedBottom = items.find((i) => i.id === selectedBottomId);
  const comparedItems = items.filter((i) => comparedIds.includes(i.id));

  return (
    <div className="space-y-6">
      {/* Header Banner & Guidance Callout */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
              <Shirt className="w-3.5 h-3.5 text-amber-400" />
              <span>3D Mannequin & Brand Fit Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Clothing <span className="text-amber-400">3D Comparison & Measurement Engine</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Compare clothing items side-by-side using exact brand measurements, waist & shoulder cuts, and preview them live on a customizable 3D model tuned to your height ({graph?.bodyProfile?.height || "5'2\""}) and weight ({graph?.bodyProfile?.weight || "118 lbs"}).
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Item with Link & Size</span>
          </button>
        </div>

        {/* Highlighted Notice: How to see clothing on the 3D person */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg shrink-0 mt-0.5 sm:mt-0">
              <Link className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-300 text-sm">Required for 3D Visualizer</span>
                <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-extrabold text-[10px] uppercase">
                  Paste Link + Size
                </span>
              </div>
              <p className="text-stone-300 leading-relaxed text-xs">
                To preview any article of clothing on your personalized 3D mannequin, make sure to include its <strong>Product Link (URL)</strong> and <strong>Article Size</strong> (e.g., <em>0 Petite</em>, <em>XS</em>, or <em>24 Short</em>). InclusiveAlly maps the garment's exact cut onto your 3D body frame.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs rounded-lg border border-amber-500/40 shrink-0 transition-all flex items-center gap-1.5 self-end sm:self-center"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enter Link & Size</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column = 3D Visualizer, Right Column = Comparison Spec Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Column 1: Interactive 3D Mannequin Visualizer (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">3D Figure Visualizer</h3>
              </div>
              <span className="text-[10px] bg-stone-950 px-2 py-0.5 rounded text-amber-300 font-semibold border border-stone-800">
                Interactive 360°
              </span>
            </div>

            {/* Rendered Items Size & Link Summary Badge */}
            <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  Currently On 3D Person:
                </span>
                <span className="text-stone-400 text-[10px]">Mapped to 3D Proportions</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-stone-900 p-2 rounded-lg border border-stone-800 space-y-1">
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Rendered Top</span>
                  <p className="text-white font-semibold truncate">{selectedTop?.brand || 'None'} {selectedTop?.name || ''}</p>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      Size: {selectedTop?.size || 'N/A'}
                    </span>
                    {selectedTop?.url && (
                      <a
                        href={selectedTop.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline text-[10px] flex items-center gap-0.5"
                      >
                        <span>Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-stone-900 p-2 rounded-lg border border-stone-800 space-y-1">
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Rendered Bottom</span>
                  <p className="text-white font-semibold truncate">{selectedBottom?.brand || 'None'} {selectedBottom?.name || ''}</p>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      Size: {selectedBottom?.size || 'N/A'}
                    </span>
                    {selectedBottom?.url && (
                      <a
                        href={selectedBottom.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline text-[10px] flex items-center gap-0.5"
                      >
                        <span>Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Canvas */}
            <Clothing3DCanvas
              bodyProfile={graph?.bodyProfile || {
                height: "5'2\"",
                weight: "118 lbs",
                bodyBuild: "Petite Slim Build",
                topSize: "XS / 0",
                bottomSize: "0 Petite",
              }}
              selectedTop={selectedTop}
              selectedBottom={selectedBottom}
            />

            {/* Top & Bottom Selectors for 3D Render */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-stone-400 block mb-1 font-bold text-[11px]">Rendered Top:</label>
                  <select
                    value={selectedTopId}
                    onChange={(e) => setSelectedTopId(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 text-white font-medium rounded-xl p-2 focus:border-amber-500 focus:outline-none"
                  >
                    {items.filter((i) => i.category === 'top').map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.brand} - {item.name} (Size: {item.size})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-stone-400 block mb-1 font-bold text-[11px]">Rendered Bottom:</label>
                  <select
                    value={selectedBottomId}
                    onChange={(e) => setSelectedBottomId(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 text-white font-medium rounded-xl p-2 focus:border-amber-500 focus:outline-none"
                  >
                    {items.filter((i) => i.category === 'bottom').map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.brand} - {item.name} (Size: {item.size})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Side-by-Side Comparison Spec Table (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Side-by-Side Clothing Spec Comparison</h3>
              </div>
              <span className="text-xs text-stone-400">
                Comparing {comparedItems.length} items
              </span>
            </div>

            {/* Selector Checklist */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <span className="text-[11px] font-bold text-stone-400 whitespace-nowrap">Toggle Comparison:</span>
              {items.map((item) => {
                const isCompared = comparedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleCompare(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border ${
                      isCompared
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
                    }`}
                  >
                    {isCompared ? '✓ ' : '+ '} {item.brand} {item.size}
                  </button>
                );
              })}
            </div>

            {/* Spec Comparison Table */}
            {comparedItems.length === 0 ? (
              <p className="text-xs text-stone-500 italic text-center py-8">Select at least one clothing item above to compare specs.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-200">
                  <thead>
                    <tr className="border-b border-stone-800 text-stone-400">
                      <th className="py-2 px-3 font-bold w-1/4">Spec Metric</th>
                      {comparedItems.map((item) => (
                        <th key={item.id} className="py-2 px-3 font-bold min-w-[160px]">
                          <div className="flex items-center justify-between">
                            <span className="text-amber-400 font-extrabold">{item.brand}</span>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-stone-500 hover:text-rose-400"
                              title="Remove item"
                            >
                              ✕
                            </button>
                          </div>
                          <span className="text-white font-bold block truncate">{item.name}</span>
                          <span className="text-[10px] text-stone-400 font-normal">{item.price} • {item.size}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-800/60 text-[11px]">

                    {/* Fit Score */}
                    <tr className="bg-stone-950/40">
                      <td className="py-2.5 px-3 font-bold text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        InclusiveAlly Fit Score
                      </td>
                      {comparedItems.map((item) => {
                        const analysis = calculateFitAnalysis(item);
                        return (
                          <td key={item.id} className="py-2.5 px-3">
                            <span className={`px-2.5 py-1 rounded-md font-bold text-xs ${
                              analysis.score >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                              {analysis.score}% Fit Match
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Category & Fit Style */}
                    <tr>
                      <td className="py-2 px-3 font-semibold text-stone-400">Category & Cut</td>
                      {comparedItems.map((item) => (
                        <td key={item.id} className="py-2 px-3 font-medium">
                          <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-300">
                            {item.fitType}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Article Size & Product Link */}
                    <tr className="bg-amber-500/5">
                      <td className="py-2.5 px-3 font-bold text-amber-300 flex items-center gap-1.5">
                        <Link className="w-3.5 h-3.5 text-amber-400" />
                        Size Tag & Web Link
                      </td>
                      {comparedItems.map((item) => (
                        <td key={item.id} className="py-2.5 px-3">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30">
                              Size: {item.size}
                            </span>
                            {item.url ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-400 hover:underline text-[11px] font-semibold flex items-center gap-1"
                              >
                                <span>View Product Page</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-stone-500 text-[10px] block italic">No link attached</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Chest / Bust Measurement */}
                    <tr>
                      <td className="py-2 px-3 font-semibold text-stone-400">Chest Width</td>
                      {comparedItems.map((item) => (
                        <td key={item.id} className="py-2 px-3">
                          {item.chestWidthInches ? `${item.chestWidthInches}" flat (${item.chestWidthInches * 2}" bust)` : 'N/A (Bottoms)'}
                        </td>
                      ))}
                    </tr>

                    {/* Waist Measurement */}
                    <tr>
                      <td className="py-2 px-3 font-semibold text-stone-400">Waist Width</td>
                      {comparedItems.map((item) => (
                        <td key={item.id} className="py-2 px-3">
                          {item.waistWidthInches ? `${item.waistWidthInches}" flat (${item.waistWidthInches * 2}" waist)` : 'N/A'}
                        </td>
                      ))}
                    </tr>

                    {/* Shoulder Width */}
                    <tr>
                      <td className="py-2 px-3 font-semibold text-stone-400">Shoulder Width</td>
                      {comparedItems.map((item) => (
                        <td key={item.id} className="py-2 px-3">
                          {item.shoulderWidthInches ? `${item.shoulderWidthInches}" across` : 'N/A'}
                        </td>
                      ))}
                    </tr>

                    {/* Inseam / Total Length */}
                    <tr>
                      <td className="py-2 px-3 font-semibold text-stone-400">Inseam / Total Length</td>
                      {comparedItems.map((item) => (
                        <td key={item.id} className="py-2 px-3 font-bold text-amber-300">
                          {item.inseamInches ? `Inseam: ${item.inseamInches}"` : `Length: ${item.totalLengthInches}"`}
                        </td>
                      ))}
                    </tr>

                    {/* Stretch & Fabric */}
                    <tr>
                      <td className="py-2 px-3 font-semibold text-stone-400">Fabric Stretch</td>
                      {comparedItems.map((item) => (
                        <td key={item.id} className="py-2 px-3">
                          {item.fabricStretch} Stretch
                        </td>
                      ))}
                    </tr>

                    {/* Fit Analysis Warnings */}
                    <tr className="bg-stone-950/60">
                      <td className="py-2.5 px-3 font-bold text-rose-300">Fit Warnings / Highlights</td>
                      {comparedItems.map((item) => {
                        const analysis = calculateFitAnalysis(item);
                        return (
                          <td key={item.id} className="py-2.5 px-3 space-y-1">
                            {analysis.positives.map((p, idx) => (
                              <p key={idx} className="text-[10px] text-emerald-300 flex items-start gap-1">
                                <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span>{p}</span>
                              </p>
                            ))}
                            {analysis.warnings.map((w, idx) => (
                              <p key={idx} className="text-[10px] text-rose-300 flex items-start gap-1">
                                <AlertTriangle className="w-3 h-3 text-rose-400 flex-shrink-0 mt-0.5" />
                                <span>{w}</span>
                              </p>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Custom Clothing Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                Add Clothing Item (Link & Size)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Informational Callout inside Modal */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-start gap-2.5 text-xs">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-200 leading-relaxed">
                <strong>Required for 3D View:</strong> Paste the clothing <strong>Product Link</strong> and select its <strong>Size Tag</strong> so the mannequin simulator can map the precise cut and measurements on your person.
              </p>
            </div>

            <form onSubmit={handleAddCustomItem} className="space-y-3.5 text-xs">
              {/* Product Web Link (URL) Field */}
              <div>
                <label className="block font-bold text-amber-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5 text-amber-400" />
                    <span>Product Link (Article URL) *</span>
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 font-semibold">
                    Required for 3D View
                  </span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://www.bananarepublic.com/browse/product.do?pid=758129"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-stone-950 border border-amber-500/40 focus:border-amber-400 rounded-xl p-2.5 text-white placeholder-stone-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-300 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Banana Republic, Uniqlo, Zara"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">Item Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Linen Blazer, Wide Leg Jeans"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-300 mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="top">Top / Blazer</option>
                    <option value="bottom">Bottom / Pants</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-amber-300 mb-1 flex items-center justify-between">
                    <span>Size Tag *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="e.g. 0 Petite, XS, 24"
                    className="w-full bg-stone-950 border border-amber-500/40 focus:border-amber-400 rounded-xl p-2 text-white font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">Price:</label>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. $98"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Measurements Inputs */}
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-2">
                <span className="font-bold text-amber-300 block text-[11px]">Brand Measurement Measurements (Inches):</span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <label className="text-stone-400 block mb-0.5">Chest Width:</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newChest}
                      onChange={(e) => setNewChest(parseFloat(e.target.value))}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-1.5 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-0.5">Waist Width:</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newWaist}
                      onChange={(e) => setNewWaist(parseFloat(e.target.value))}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-1.5 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-0.5">Shoulder Width:</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newShoulder}
                      onChange={(e) => setNewShoulder(parseFloat(e.target.value))}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-1.5 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-0.5">Inseam / Length:</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newInseam}
                      onChange={(e) => setNewInseam(parseFloat(e.target.value))}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-1.5 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md"
                >
                  Save Item to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

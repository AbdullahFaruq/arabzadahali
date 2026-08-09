"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../components/ProductCard";
import { categories, colors, sizes, priceRanges } from "../data/products";
import { useStore } from "../context/StoreContext";
import Link from "next/link";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Rated", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
];

export default function ShopClient() {
  const { products } = useStore();
  const params = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "All");
  const [color, setColor] = useState("All");
  const [size, setSize] = useState("All");
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (color !== "All") list = list.filter((p) => p.color === color);
    if (size !== "All") list = list.filter((p) => p.size === size);
    if (priceRange !== null) { const r = priceRanges[priceRange]; list = list.filter((p) => p.price >= r.min && p.price <= r.max); }
    if (inStockOnly) list = list.filter((p) => p.inStock);
    switch (sort) {
      case "price-asc": return list.sort((a, b) => a.price - b.price);
      case "price-desc": return list.sort((a, b) => b.price - a.price);
      case "rating": return list.sort((a, b) => b.rating - a.rating);
      case "reviews": return list.sort((a, b) => b.reviews - a.reviews);
      default: return list;
    }
  }, [category, color, size, priceRange, sort, search, inStockOnly]);

  const activeFilters = [
    category !== "All" && category,
    color !== "All" && color,
    size !== "All" && size,
    priceRange !== null && priceRanges[priceRange].label,
    inStockOnly && "In Stock",
  ].filter(Boolean) as string[];

  const clearAll = () => { setCategory("All"); setColor("All"); setSize("All"); setPriceRange(null); setInStockOnly(false); };

  const FilterPanel = () => (
    <div className="space-y-7">
      <div>
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Category</h3>
        <div className="space-y-1">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${category === c ? "bg-amber-600 text-white font-semibold" : "text-stone-400 hover:text-white hover:bg-stone-800"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Price Range</h3>
        <div className="space-y-1">
          {priceRanges.map((r, i) => (
            <button key={r.label} onClick={() => setPriceRange(priceRange === i ? null : i)} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${priceRange === i ? "bg-amber-600 text-white font-semibold" : "text-stone-400 hover:text-white hover:bg-stone-800"}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button key={c} onClick={() => setColor(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${color === c ? "bg-amber-600 text-white" : "bg-stone-800 text-stone-400 hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button key={s} onClick={() => setSize(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${size === s ? "bg-amber-600 text-white" : "bg-stone-800 text-stone-400 hover:text-white"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => setInStockOnly(!inStockOnly)} className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${inStockOnly ? "bg-amber-600" : "bg-stone-700"}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${inStockOnly ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          <span className="text-sm text-stone-400">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-stone-950 min-h-screen text-white">
      <div className="border-b border-stone-800 bg-stone-900/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-4">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-300">Shop</span>
          </nav>
          <h1 className="text-4xl font-black text-white">All Carpets & Rugs</h1>
          <p className="text-stone-400 mt-1">{filtered.length} products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-white">Filters</h2>
              {activeFilters.length > 0 && <button onClick={clearAll} className="text-xs text-amber-500 hover:text-amber-400">Clear all</button>}
            </div>
            <FilterPanel />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 flex-1 min-w-48">
              <svg className="w-4 h-4 text-stone-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rugs..." className="bg-transparent text-sm text-white placeholder-stone-500 outline-none w-full" />
            </div>
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex items-center gap-2 bg-stone-900 border border-stone-800 text-stone-300 text-sm px-4 py-2.5 rounded-xl hover:border-amber-500/40 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
              Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-stone-900 border border-stone-800 text-stone-300 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-amber-500 transition-colors cursor-pointer">
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {activeFilters.map((f) => (
                <span key={f} className="flex items-center gap-1.5 bg-amber-600/20 border border-amber-600/30 text-amber-400 text-xs px-3 py-1.5 rounded-full font-medium">
                  {f} <button onClick={clearAll} className="hover:text-white">×</button>
                </span>
              ))}
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">No rugs found</h3>
              <p className="text-stone-500 mb-6">Try adjusting your filters</p>
              <button onClick={clearAll} className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-xl transition-colors">Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-stone-950 border-l border-stone-800 p-6 overflow-y-auto animate-slide-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-white text-lg">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-stone-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <FilterPanel />
            <button onClick={() => setSidebarOpen(false)} className="w-full mt-8 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 rounded-xl transition-colors">
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

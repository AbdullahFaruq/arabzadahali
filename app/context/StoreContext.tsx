"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { CartItem, Product } from "../types";
import { Slide, DiscoverSlide } from "../data/slides";

interface Toast { id: number; message: string; type: "success" | "error" | "info"; }

interface StoreCtx {
  cart: CartItem[];
  wishlist: number[];
  toasts: Toast[];
  products: Product[];
  slides: Slide[];
  discoverSlides: DiscoverSlide[];
  banner: string;
  updateBanner: (text: string) => void;
  addToCart: (p: Product, size?: string) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;
  cartCount: number;
  cartTotal: number;
  showToast: (msg: string, type?: Toast["type"]) => void;
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: number) => void;
  updateSlide: (s: Slide) => void;
  addSlide: (s: Omit<Slide, "id">) => void;
  deleteSlide: (id: number) => void;
  reorderSlides: (slides: Slide[]) => void;
  addDiscoverSlide: (s: Omit<DiscoverSlide, "id">) => void;
  updateDiscoverSlide: (s: DiscoverSlide) => void;
  deleteDiscoverSlide: (id: number) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

const DEFAULT_BANNER = "🎁 Free shipping on orders over ₺500 · Use code CARPET20 for 20% off";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [discoverSlides, setDiscoverSlides] = useState<DiscoverSlide[]>([]);
  const [banner, setBanner] = useState(DEFAULT_BANNER);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  // Cart & wishlist stay per-browser — a shopping cart doesn't need to sync
  // across devices. Everything else (products, slides, banner) is shared
  // site content and comes from the database below.
  useEffect(() => {
    try {
      const c = localStorage.getItem("cart");
      const w = localStorage.getItem("wishlist");
      if (c && c.length < 500000) setCart(JSON.parse(c));
      else if (c) localStorage.removeItem("cart");
      if (w && w.length < 500000) setWishlist(JSON.parse(w));
      else if (w) localStorage.removeItem("wishlist");
    } catch {}
  }, []);

  const safeSetItem = useCallback((key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.warn(`localStorage quota exceeded for ${key}. Resetting cached data.`);
      localStorage.removeItem(key);
      if (key === "cart") setCart([]);
      if (key === "wishlist") setWishlist([]);
    }
  }, []);

  useEffect(() => { safeSetItem("cart", JSON.stringify(cart)); }, [cart, safeSetItem]);
  useEffect(() => { safeSetItem("wishlist", JSON.stringify(wishlist)); }, [wishlist, safeSetItem]);

  // Site content — fetched from the API (backed by MongoDB) so admin edits
  // are visible to every visitor, not just the browser that made them.
  useEffect(() => {
    (async () => {
      try {
        const [p, s, d, settings] = await Promise.all([
          fetch("/api/products").then((r) => r.json()),
          fetch("/api/slides").then((r) => r.json()),
          fetch("/api/discover-slides").then((r) => r.json()),
          fetch("/api/settings").then((r) => r.json()),
        ]);
        setProducts(p);
        setSlides(s);
        setDiscoverSlides(d);
        setBanner(settings.banner ?? DEFAULT_BANNER);
      } catch {
        showToast("Couldn't load store content — check your connection", "error");
      }
    })();
  }, [showToast]);

  const addToCart = useCallback((p: Product, size = p.size) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === p.id && i.selectedSize === size);
      if (existing) return prev.map((i) => i.id === p.id && i.selectedSize === size ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...p, quantity: 1, selectedSize: size }];
    });
    showToast(`${p.name} added to cart`);
  }, [showToast]);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    showToast("Item removed from cart", "info");
  }, [showToast]);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => { setCart([]); showToast("Cart cleared", "info"); }, [showToast]);

  const toggleWishlist = useCallback((id: number) => {
    setWishlist((prev) => {
      const has = prev.includes(id);
      showToast(has ? "Removed from wishlist" : "Added to wishlist ♥", has ? "info" : "success");
      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }, [showToast]);

  const addProduct = useCallback(async (p: Omit<Product, "id">) => {
    try {
      const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      if (!res.ok) throw new Error();
      const created: Product = await res.json();
      setProducts((prev) => [...prev, created]);
      showToast(`"${created.name}" added successfully`);
    } catch {
      showToast("Failed to add product", "error");
    }
  }, [showToast]);

  const updateProduct = useCallback(async (p: Product) => {
    try {
      const res = await fetch(`/api/products/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      if (!res.ok) throw new Error();
      const updated: Product = await res.json();
      setProducts((prev) => prev.map((x) => x.id === updated.id ? updated : x));
      showToast(`"${updated.name}" updated`);
    } catch {
      showToast("Failed to update product", "error");
    }
  }, [showToast]);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((x) => x.id !== id));
      showToast("Product deleted", "info");
    } catch {
      showToast("Failed to delete product", "error");
    }
  }, [showToast]);

  const updateSlide = useCallback(async (s: Slide) => {
    try {
      const res = await fetch(`/api/slides/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
      if (!res.ok) throw new Error();
      const updated: Slide = await res.json();
      setSlides((prev) => prev.map((x) => x.id === updated.id ? updated : x));
      showToast("Slide updated");
    } catch {
      showToast("Failed to update slide", "error");
    }
  }, [showToast]);

  const addSlide = useCallback(async (s: Omit<Slide, "id">) => {
    try {
      const res = await fetch("/api/slides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
      if (!res.ok) throw new Error();
      const created: Slide = await res.json();
      setSlides((prev) => [...prev, created]);
      showToast("Slide added");
    } catch {
      showToast("Failed to add slide", "error");
    }
  }, [showToast]);

  const deleteSlide = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/slides/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSlides((prev) => prev.filter((x) => x.id !== id));
      showToast("Slide deleted", "info");
    } catch {
      showToast("Failed to delete slide", "error");
    }
  }, [showToast]);

  const updateBanner = useCallback(async (text: string) => {
    try {
      const res = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ banner: text }) });
      if (!res.ok) throw new Error();
      setBanner(text);
      showToast("Banner updated");
    } catch {
      showToast("Failed to update banner", "error");
    }
  }, [showToast]);

  const reorderSlides = useCallback(async (newOrder: Slide[]) => {
    setSlides(newOrder);
    try {
      const res = await fetch("/api/slides/reorder", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: newOrder.map((s) => s.id) }) });
      if (!res.ok) throw new Error();
    } catch {
      showToast("Failed to save new slide order", "error");
    }
  }, [showToast]);

  const addDiscoverSlide = useCallback(async (s: Omit<DiscoverSlide, "id">) => {
    try {
      const res = await fetch("/api/discover-slides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
      if (!res.ok) throw new Error();
      const created: DiscoverSlide = await res.json();
      setDiscoverSlides((prev) => [...prev, created]);
      showToast("Discovery slide added");
    } catch {
      showToast("Failed to add discovery slide", "error");
    }
  }, [showToast]);

  const updateDiscoverSlide = useCallback(async (s: DiscoverSlide) => {
    try {
      const res = await fetch(`/api/discover-slides/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
      if (!res.ok) throw new Error();
      const updated: DiscoverSlide = await res.json();
      setDiscoverSlides((prev) => prev.map((x) => x.id === updated.id ? updated : x));
      showToast("Discovery slide updated");
    } catch {
      showToast("Failed to update discovery slide", "error");
    }
  }, [showToast]);

  const deleteDiscoverSlide = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/discover-slides/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setDiscoverSlides((prev) => prev.filter((x) => x.id !== id));
      showToast("Discovery slide removed", "info");
    } catch {
      showToast("Failed to remove discovery slide", "error");
    }
  }, [showToast]);

  const isWishlisted = useCallback((id: number) => wishlist.includes(id), [wishlist]);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <Ctx.Provider value={{ cart, wishlist, toasts, products, slides, discoverSlides, banner, updateBanner, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, isWishlisted, cartCount, cartTotal, showToast, addProduct, updateProduct, deleteProduct, updateSlide, addSlide, deleteSlide, reorderSlides, addDiscoverSlide, updateDiscoverSlide, deleteDiscoverSlide }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium text-white backdrop-blur-sm border transition-all duration-300 ${t.type === "success" ? "bg-emerald-600/90 border-emerald-500/50" : t.type === "error" ? "bg-red-600/90 border-red-500/50" : "bg-slate-700/90 border-slate-600/50"}`}>
            <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

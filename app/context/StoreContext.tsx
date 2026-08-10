"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { CartItem, Product } from "../types";
import { products as initialProducts } from "../data/products";
import { Slide, initialSlides } from "../data/slides";

interface Toast { id: number; message: string; type: "success" | "error" | "info"; }

interface StoreCtx {
  cart: CartItem[];
  wishlist: number[];
  toasts: Toast[];
  products: Product[];
  slides: Slide[];
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
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [banner, setBanner] = useState("🎁 Free shipping on orders over ₺500 · Use code CARPET20 for 20% off");

  useEffect(() => {
    try {
      const c = localStorage.getItem("cart");
      const w = localStorage.getItem("wishlist");
      const p = localStorage.getItem("products");
      const s = localStorage.getItem("slides");
      if (c) setCart(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
      if (p) setProducts(JSON.parse(p));
      if (s) setSlides(JSON.parse(s));
      const b = localStorage.getItem("banner");
      if (b) setBanner(b);
    } catch {}
  }, []);

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("wishlist", JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem("products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("slides", JSON.stringify(slides)); }, [slides]);
  useEffect(() => { localStorage.setItem("banner", banner); }, [banner]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

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

  const addProduct = useCallback((p: Omit<Product, "id">) => {
    setProducts((prev) => [...prev, { ...p, id: Date.now() }]);
    showToast(`"${p.name}" added successfully`);
  }, [showToast]);

  const updateProduct = useCallback((p: Product) => {
    setProducts((prev) => prev.map((x) => x.id === p.id ? p : x));
    showToast(`"${p.name}" updated`);
  }, [showToast]);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));
    showToast("Product deleted", "info");
  }, [showToast]);

  const updateSlide = useCallback((s: Slide) => {
    setSlides((prev) => prev.map((x) => x.id === s.id ? s : x));
    showToast("Slide updated");
  }, [showToast]);

  const addSlide = useCallback((s: Omit<Slide, "id">) => {
    setSlides((prev) => [...prev, { ...s, id: Date.now() }]);
    showToast("Slide added");
  }, [showToast]);

  const deleteSlide = useCallback((id: number) => {
    setSlides((prev) => prev.filter((x) => x.id !== id));
    showToast("Slide deleted", "info");
  }, [showToast]);

  const updateBanner = useCallback((text: string) => { setBanner(text); showToast("Banner updated"); }, [showToast]);
  const reorderSlides = useCallback((s: Slide[]) => setSlides(s), []);

  const isWishlisted = useCallback((id: number) => wishlist.includes(id), [wishlist]);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <Ctx.Provider value={{ cart, wishlist, toasts, products, slides, banner, updateBanner, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, isWishlisted, cartCount, cartTotal, showToast, addProduct, updateProduct, deleteProduct, updateSlide, addSlide, deleteSlide, reorderSlides }}>
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

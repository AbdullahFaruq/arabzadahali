"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { useStore } from "../context/StoreContext";
import ProductForm from "../components/ProductForm";
import { Product } from "../types";
import { Slide, DiscoverSlide, accentOptions } from "../data/slides";
import ImageUploader from "../components/ImageUploader";

type Tab = "products" | "slides" | "discover" | "settings";

const emptySlide: Omit<Slide, "id"> = {
  image: "", tag: "", title: "", sub: "", cta: "Shop Now", href: "/shop", accent: "from-amber-500 to-orange-500",
};

const emptyDiscoverSlide: DiscoverSlide = {
  id: 0,
  image: "", title: "", subtitle: "", href: "/shop",
};

export default function AdminPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { products, slides, discoverSlides, addProduct, updateProduct, deleteProduct, updateSlide, addSlide, deleteSlide, banner, updateBanner, addDiscoverSlide, updateDiscoverSlide, deleteDiscoverSlide } = useStore();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("products");
  const [productSearch, setProductSearch] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProductConfirm, setDeleteProductConfirm] = useState<number | null>(null);
  const [editSlide, setEditSlide] = useState<Slide | null>(null);
  const [showAddSlide, setShowAddSlide] = useState(false);
  const [deleteSlideConfirm, setDeleteSlideConfirm] = useState<number | null>(null);
  const [editDiscoverSlide, setEditDiscoverSlide] = useState<DiscoverSlide | null>(null);
  const [showAddDiscoverSlide, setShowAddDiscoverSlide] = useState(false);
  const [deleteDiscoverSlideConfirm, setDeleteDiscoverSlideConfirm] = useState<number | null>(null);
  const [bannerText, setBannerText] = useState(banner);
  const [newSlide, setNewSlide] = useState<Omit<Slide, "id">>(emptySlide);
  const [newDiscoverSlide, setNewDiscoverSlide] = useState<DiscoverSlide>(emptyDiscoverSlide);

  const role = (user?.publicMetadata as { role?: string })?.role;
  const isAdmin = isSignedIn && role === "admin";

  useEffect(() => {
    if (isLoaded && !isAdmin) router.replace("/");
  }, [isLoaded, isAdmin, router]);

  if (!isLoaded || !isAdmin) return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const stats = [
    { label: "Products", value: products.length, icon: "📦", color: "text-amber-400" },
    { label: "In Stock", value: products.filter((p) => p.inStock).length, icon: "✅", color: "text-emerald-400" },
    { label: "Out of Stock", value: products.filter((p) => !p.inStock).length, icon: "❌", color: "text-red-400" },
    { label: "Slides", value: slides.length, icon: "🖼️", color: "text-blue-400" },
  ];

  const inputCls = "w-full bg-stone-800 border border-stone-700 text-white placeholder-stone-500 px-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors";
  const labelCls = "block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2";

  return (
    <div className="bg-stone-950 min-h-screen text-white">
      {/* Topbar */}
      <div className="bg-stone-900 border-b border-stone-800 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <span className="font-black text-white">Arabzada</span>
          <span className="bg-amber-600/20 border border-amber-600/30 text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="text-sm text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            View Store
          </Link>
          <button onClick={() => signOut(() => router.push("/"))} className="text-sm bg-stone-800 hover:bg-red-500/20 border border-stone-700 hover:border-red-500/40 text-stone-300 hover:text-red-400 px-4 py-2 rounded-xl transition-all">
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-stone-400 mt-1">Welcome back, <span className="text-amber-400 font-semibold">{user.firstName ?? user.emailAddresses[0]?.emailAddress}</span></p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 hover:border-stone-700 transition-colors">
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className={`text-3xl font-black ${s.color} mb-1`}>{s.value}</div>
              <div className="text-xs text-stone-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-stone-900 border border-stone-800 rounded-2xl p-1 mb-8 w-fit">
          {([
            { key: "products", label: "📦 Products" },
            { key: "slides", label: "🖼️ Hero Slides" },
            { key: "discover", label: "✨ Keşfet Slider" },
            { key: "settings", label: "⚙️ Settings" },
          ] as { key: Tab; label: string }[]).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? "bg-amber-600 text-white shadow-lg" : "text-stone-400 hover:text-white"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 w-72">
                <svg className="w-4 h-4 text-stone-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products..." className="bg-transparent text-sm text-white placeholder-stone-500 outline-none w-full" />
              </div>
              <button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30">
                + Add Product
              </button>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-800">
                      <th className="text-left text-xs font-bold text-stone-400 uppercase tracking-widest px-5 py-4">Product</th>
                      <th className="text-left text-xs font-bold text-stone-400 uppercase tracking-widest px-4 py-4 hidden md:table-cell">Category</th>
                      <th className="text-left text-xs font-bold text-stone-400 uppercase tracking-widest px-4 py-4">Price</th>
                      <th className="text-left text-xs font-bold text-stone-400 uppercase tracking-widest px-4 py-4 hidden sm:table-cell">Stock</th>
                      <th className="text-right text-xs font-bold text-stone-400 uppercase tracking-widest px-5 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0 bg-stone-800" onError={(e) => { e.currentTarget.src = "https://placehold.co/48x48/1c1917/78716c?text=?"; }} />
                            <div>
                              <p className="text-sm font-semibold text-white line-clamp-1">{p.name}</p>
                              <p className="text-xs text-stone-500">{p.material} · {p.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <span className="text-xs bg-stone-800 text-stone-300 px-2.5 py-1 rounded-lg">{p.category}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-bold text-white">{p.price.toLocaleString("tr-TR")}₺</span>
                          {p.originalPrice && <span className="text-xs text-stone-500 line-through ml-1.5">{p.originalPrice.toLocaleString("tr-TR")}₺</span>}
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${p.inStock ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                            {p.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setEditProduct(p)} className="text-xs font-semibold bg-stone-800 hover:bg-amber-600/20 border border-stone-700 hover:border-amber-500/40 text-stone-300 hover:text-amber-400 px-3 py-1.5 rounded-xl transition-all">
                              ✏️ Edit
                            </button>
                            {deleteProductConfirm === p.id ? (
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => { deleteProduct(p.id); setDeleteProductConfirm(null); }} className="text-xs font-bold bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-xl transition-colors">Confirm</button>
                                <button onClick={() => setDeleteProductConfirm(null)} className="text-xs text-stone-500 hover:text-white px-2 py-1.5 transition-colors">Cancel</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteProductConfirm(p.id)} className="text-xs font-semibold bg-stone-800 hover:bg-red-500/20 border border-stone-700 hover:border-red-500/40 text-stone-300 hover:text-red-400 px-3 py-1.5 rounded-xl transition-all">
                                🗑️
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-16 text-stone-500">
                    <div className="text-4xl mb-3">📦</div>
                    <p>No products found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── SLIDES TAB ── */}
        {tab === "slides" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-stone-400 text-sm">{slides.length} slides · changes reflect on homepage immediately</p>
              <button onClick={() => { setNewSlide(emptySlide); setShowAddSlide(true); }} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30">
                + Add Slide
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {slides.map((slide, idx) => (
                <div key={slide.id} className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-stone-700 transition-colors">
                  {/* Preview */}
                  <div className="relative h-40 bg-stone-800 overflow-hidden">
                    {slide.image ? (
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-600 text-sm">No image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r ${slide.accent} text-white`}>{slide.tag || "Tag"}</span>
                      <p className="text-white font-black text-sm mt-1 leading-tight whitespace-pre-line line-clamp-2">{slide.title || "Title"}</p>
                    </div>
                    <div className="absolute top-3 right-3 bg-stone-900/80 text-stone-400 text-xs px-2 py-1 rounded-lg">Slide {idx + 1}</div>
                  </div>
                  {/* Actions */}
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white line-clamp-1">{slide.title || "Untitled"}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{slide.cta} → {slide.href}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditSlide({ ...slide })} className="text-xs font-semibold bg-stone-800 hover:bg-amber-600/20 border border-stone-700 hover:border-amber-500/40 text-stone-300 hover:text-amber-400 px-3 py-1.5 rounded-xl transition-all">
                        ✏️ Edit
                      </button>
                      {deleteSlideConfirm === slide.id ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => { deleteSlide(slide.id); setDeleteSlideConfirm(null); }} className="text-xs font-bold bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1.5 rounded-xl transition-colors">Confirm</button>
                          <button onClick={() => setDeleteSlideConfirm(null)} className="text-xs text-stone-500 hover:text-white px-2 py-1.5">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteSlideConfirm(slide.id)} className="text-xs font-semibold bg-stone-800 hover:bg-red-500/20 border border-stone-700 hover:border-red-500/40 text-stone-300 hover:text-red-400 px-3 py-1.5 rounded-xl transition-all">
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DISCOVER TAB ── */}
        {tab === "discover" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-stone-400 text-sm">{discoverSlides.length} discovery images · auto-rotating homepage gallery</p>
              <button onClick={() => { setNewDiscoverSlide({ ...emptyDiscoverSlide, id: 0 }); setShowAddDiscoverSlide(true); }} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30">
                + Add Image
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {discoverSlides.map((slide, idx) => (
                <div key={slide.id} className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-stone-700 transition-colors">
                  <div className="relative h-52 bg-stone-800 overflow-hidden">
                    {slide.image ? (
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-600 text-sm">No image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/10 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-white font-black text-base leading-tight whitespace-pre-line line-clamp-2">{slide.title || "Untitled"}</p>
                    </div>
                    <div className="absolute top-3 right-3 bg-stone-900/80 text-stone-400 text-xs px-2 py-1 rounded-lg">#{idx + 1}</div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-stone-300 line-clamp-2">{slide.subtitle || "No subtitle"}</p>
                    <p className="text-xs text-stone-500 mt-2">Link: {slide.href || "/shop"}</p>
                    <div className="flex items-center justify-end gap-2 mt-4">
                      <button onClick={() => setEditDiscoverSlide({ ...slide })} className="text-xs font-semibold bg-stone-800 hover:bg-amber-600/20 border border-stone-700 hover:border-amber-500/40 text-stone-300 hover:text-amber-400 px-3 py-1.5 rounded-xl transition-all">
                        ✏️ Edit
                      </button>
                      {deleteDiscoverSlideConfirm === slide.id ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => { deleteDiscoverSlide(slide.id); setDeleteDiscoverSlideConfirm(null); }} className="text-xs font-bold bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1.5 rounded-xl transition-colors">Confirm</button>
                          <button onClick={() => setDeleteDiscoverSlideConfirm(null)} className="text-xs text-stone-500 hover:text-white px-2 py-1.5">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteDiscoverSlideConfirm(slide.id)} className="text-xs font-semibold bg-stone-800 hover:bg-red-500/20 border border-stone-700 hover:border-red-500/40 text-stone-300 hover:text-red-400 px-3 py-1.5 rounded-xl transition-all">
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div className="max-w-2xl space-y-6">
            {/* Banner */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-1">Announcement Banner</h3>
              <p className="text-stone-500 text-sm mb-4">The top bar shown on every page.</p>
              <div className="bg-amber-900/40 border border-amber-800/40 rounded-xl px-4 py-2.5 text-amber-100 text-xs text-center mb-4">{bannerText}</div>
              <textarea
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                rows={2}
                className={inputCls + " resize-none mb-3"}
                placeholder="🎁 Free shipping on orders over ₺500 · Use code CARPET20 for 20% off"
              />
              <button
                onClick={() => updateBanner(bannerText)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm"
              >
                Save Banner
              </button>
            </div>

            {/* Account */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-1">Your Account</h3>
              <p className="text-stone-500 text-sm mb-4">Manage your profile via Clerk</p>
              <div className="flex items-center gap-4 p-4 bg-stone-800 rounded-xl mb-4">
                {user.imageUrl
                  ? <img src={user.imageUrl} className="w-12 h-12 rounded-full object-cover" alt="" />
                  : <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-white font-black text-lg">{user.firstName?.[0] ?? "A"}</div>
                }
                <div>
                  <p className="font-bold text-white">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-stone-400">{user.emailAddresses[0]?.emailAddress}</p>
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">Administrator</span>
                </div>
              </div>
              <a href="https://dashboard.clerk.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 transition-colors">
                Manage users in Clerk Dashboard →
              </a>
            </div>

            {/* Data */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-1">Data</h3>
              <p className="text-stone-500 text-sm mb-4">Products and slides are stored in localStorage. Reset to defaults if needed.</p>
              <div className="flex gap-3">
                <button onClick={() => { localStorage.removeItem("products"); window.location.reload(); }} className="text-sm bg-stone-800 hover:bg-red-500/20 border border-stone-700 hover:border-red-500/40 text-stone-300 hover:text-red-400 px-4 py-2.5 rounded-xl transition-all">
                  Reset Products
                </button>
                <button onClick={() => { localStorage.removeItem("slides"); window.location.reload(); }} className="text-sm bg-stone-800 hover:bg-red-500/20 border border-stone-700 hover:border-red-500/40 text-stone-300 hover:text-red-400 px-4 py-2.5 rounded-xl transition-all">
                  Reset Slides
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── ADD PRODUCT MODAL ── */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 w-full max-w-3xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">Add New Product</h2>
              <button onClick={() => setShowAddProduct(false)} className="text-stone-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <ProductForm onSubmit={(data) => { addProduct(data); setShowAddProduct(false); }} onCancel={() => setShowAddProduct(false)} submitLabel="Add Product" />
          </div>
        </div>
      )}

      {/* ── EDIT PRODUCT MODAL ── */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 w-full max-w-3xl shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <img src={editProduct.image} alt={editProduct.name} className="w-14 h-14 rounded-2xl object-cover bg-stone-800" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <div>
                <h2 className="text-xl font-black text-white">Edit Product</h2>
                <p className="text-stone-400 text-sm">{editProduct.name}</p>
              </div>
              <button onClick={() => setEditProduct(null)} className="ml-auto text-stone-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <ProductForm initial={editProduct} onSubmit={(data) => { updateProduct({ ...data, id: editProduct.id }); setEditProduct(null); }} onCancel={() => setEditProduct(null)} submitLabel="Save Changes" />
          </div>
        </div>
      )}

      {/* ── EDIT SLIDE MODAL ── */}
      {editSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">Edit Slide</h2>
              <button onClick={() => setEditSlide(null)} className="text-stone-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <SlideForm slide={editSlide} onChange={setEditSlide} onSave={() => { updateSlide(editSlide); setEditSlide(null); }} onCancel={() => setEditSlide(null)} />
          </div>
        </div>
      )}

      {/* ── ADD SLIDE MODAL ── */}
      {showAddSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">Add New Slide</h2>
              <button onClick={() => setShowAddSlide(false)} className="text-stone-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <SlideForm
              slide={newSlide as Slide}
              onChange={(s) => setNewSlide(s)}
              onSave={() => { addSlide(newSlide); setShowAddSlide(false); setNewSlide(emptySlide); }}
              onCancel={() => setShowAddSlide(false)}
            />
          </div>
        </div>
      )}

      {/* ── EDIT DISCOVERY SLIDE MODAL ── */}
      {editDiscoverSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">Edit Discovery Slide</h2>
              <button onClick={() => setEditDiscoverSlide(null)} className="text-stone-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <DiscoverSlideForm slides={editDiscoverSlide} onChange={setEditDiscoverSlide} onSave={() => { updateDiscoverSlide(editDiscoverSlide); setEditDiscoverSlide(null); }} onCancel={() => setEditDiscoverSlide(null)} />
          </div>
        </div>
      )}

      {/* ── ADD DISCOVERY SLIDE MODAL ── */}
      {showAddDiscoverSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">Add Discovery Slide</h2>
              <button onClick={() => setShowAddDiscoverSlide(false)} className="text-stone-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <DiscoverSlideForm slides={newDiscoverSlide} onChange={(s) => setNewDiscoverSlide(s)} onSave={() => { addDiscoverSlide({ image: newDiscoverSlide.image, title: newDiscoverSlide.title, subtitle: newDiscoverSlide.subtitle, href: newDiscoverSlide.href }); setShowAddDiscoverSlide(false); setNewDiscoverSlide({ ...emptyDiscoverSlide, id: 0 }); }} onCancel={() => setShowAddDiscoverSlide(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function SlideForm({ slide, onChange, onSave, onCancel }: {
  slide: Slide;
  onChange: (s: Slide) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const set = (key: keyof Slide, val: string) => onChange({ ...slide, [key]: val });
  const inputCls = "w-full bg-stone-800 border border-stone-700 text-white placeholder-stone-500 px-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors";
  const labelCls = "block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2";

  return (
    <div className="space-y-5">
      {/* Image */}
      <div>
        <label className={labelCls}>Image</label>
        <ImageUploader value={slide.image} onChange={(val) => set("image", val)} placeholder="https://images.unsplash.com/..." />
        {slide.image && (
          <div className="mt-3 relative h-36 rounded-xl overflow-hidden bg-stone-800">
            <img src={slide.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 to-transparent" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Tag / Badge</label>
          <input value={slide.tag} onChange={(e) => set("tag", e.target.value)} placeholder="New Collection 2025" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>CTA Button Text</label>
          <input value={slide.cta} onChange={(e) => set("cta", e.target.value)} placeholder="Shop Now" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Title (use \n for line break)</label>
        <input value={slide.title} onChange={(e) => set("title", e.target.value)} placeholder="Persian Royal\nMasterpieces" className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Subtitle</label>
        <textarea value={slide.sub} onChange={(e) => set("sub", e.target.value)} rows={2} placeholder="Short description..." className={inputCls + " resize-none"} />
      </div>

      <div>
        <label className={labelCls}>Link URL</label>
        <input value={slide.href} onChange={(e) => set("href", e.target.value)} placeholder="/shop?category=Persian" className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Accent Color</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {accentOptions.map((a) => (
            <button key={a} type="button" onClick={() => set("accent", a)} className={`h-8 w-24 rounded-xl bg-gradient-to-r ${a} text-white text-xs font-bold transition-all ${slide.accent === a ? "ring-2 ring-white scale-105" : "opacity-60 hover:opacity-100"}`}>
              {slide.accent === a ? "✓" : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onSave} className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-black py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30">
          Save Slide
        </button>
        <button onClick={onCancel} className="px-6 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 font-semibold py-3.5 rounded-xl transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

function DiscoverSlideForm({ slides, onChange, onSave, onCancel }: {
  slides: DiscoverSlide;
  onChange: (s: DiscoverSlide) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const set = (key: keyof DiscoverSlide, val: string) => onChange({ ...slides, [key]: val });
  const inputCls = "w-full bg-stone-800 border border-stone-700 text-white placeholder-stone-500 px-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors";
  const labelCls = "block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2";

  return (
    <div className="space-y-5">
      <div>
        <label className={labelCls}>Image</label>
        <ImageUploader value={slides.image} onChange={(val) => set("image", val)} placeholder="https://images.unsplash.com/..." />
        {slides.image && (
          <div className="mt-3 relative h-40 rounded-xl overflow-hidden bg-stone-800">
            <img src={slides.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </div>
        )}
      </div>

      <div>
        <label className={labelCls}>Title</label>
        <input value={slides.title} onChange={(e) => set("title", e.target.value)} placeholder="Persian Royal Masterpieces" className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Subtitle</label>
        <textarea value={slides.subtitle} onChange={(e) => set("subtitle", e.target.value)} rows={2} placeholder="Hand-knotted heritage rugs with centuries of story." className={inputCls + " resize-none"} />
      </div>

      <div>
        <label className={labelCls}>Link URL</label>
        <input value={slides.href} onChange={(e) => set("href", e.target.value)} placeholder="/shop?category=Persian" className={inputCls} />
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onSave} className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-black py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30">
          Save Slide
        </button>
        <button onClick={onCancel} className="px-6 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 font-semibold py-3.5 rounded-xl transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

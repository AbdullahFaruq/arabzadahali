"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useStore } from "../context/StoreContext";

const navLinks = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Mağaza", href: "/shop" },
  { label: "Koleksiyonlar", href: "/shop" },
  { label: "Hakkımızda", href: "/about" },
  { label: "İletişim", href: "/contact" },
];

export default function Navbar() {
  const { cartCount, wishlist, products, banner } = useStore();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const role = (user?.publicMetadata as { role?: string })?.role;
  const isAdmin = isSignedIn && role === "admin";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const results = query.length > 1
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  return (
    <>
      <div className="bg-amber-900 text-amber-100 text-xs text-center py-2 px-4 font-medium tracking-wide">
        {banner}
      </div>

      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-stone-950/95 backdrop-blur-xl shadow-xl shadow-black/30" : "bg-stone-950"} border-b border-stone-800`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-base">A</span>
            </div>
            <div className="leading-none">
              <span className="block font-black text-lg text-white tracking-tight">Arabzada</span>
              <span className="block text-[10px] text-amber-500 font-medium tracking-widest uppercase">El Yapımı Halılar</span>
            </div>
          </Link>

          {/* Masaüstü menü */}
          <ul className="hidden lg:flex items-center gap-7">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="relative text-sm font-medium text-stone-400 hover:text-white transition-colors duration-200 group">
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-amber-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
            {isAdmin && (
              <li>
                <Link href="/admin" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  🛡️ Yönetim
                </Link>
              </li>
            )}
          </ul>

          {/* Sağ aksiyonlar */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Arama */}
            <div className="relative">
              <button onClick={() => setSearchOpen(!searchOpen)} className="w-9 h-9 flex items-center justify-center rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-12 w-80 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-800">
                    <svg className="w-4 h-4 text-stone-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Halı ara..." className="flex-1 bg-transparent text-sm text-white placeholder-stone-500 outline-none" />
                    <button onClick={() => { setSearchOpen(false); setQuery(""); }} className="text-stone-500 hover:text-white text-lg leading-none">×</button>
                  </div>
                  {results.length > 0 && (
                    <div className="py-2">
                      {results.map((p) => (
                        <Link key={p.id} href={`/shop/${p.id}`} onClick={() => { setSearchOpen(false); setQuery(""); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-stone-800 transition-colors">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm text-white font-medium">{p.name}</p>
                            <p className="text-xs text-amber-500">{p.price.toLocaleString("tr-TR")}₺</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {query.length > 1 && results.length === 0 && (
                    <p className="text-sm text-stone-500 text-center py-6">Sonuç bulunamadı</p>
                  )}
                </div>
              )}
            </div>

            {/* Favoriler */}
            <Link href="/wishlist" className="relative w-9 h-9 flex items-center justify-center rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>}
            </Link>

            {/* Sepet */}
            <Link href="/cart" className="relative flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span className="hidden sm:inline">Sepet</span>
              {cartCount > 0 && <span className="bg-white text-amber-700 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
            </Link>

            {/* Hesap */}
            {isLoaded && (
              isSignedIn ? (
                <div className="relative" ref={accountRef}>
                  <button onClick={() => setAccountOpen(!accountOpen)} className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-white text-sm font-semibold px-3 py-2 rounded-xl transition-all">
                    {user.imageUrl
                      ? <img src={user.imageUrl} className="w-6 h-6 rounded-full object-cover" alt="" />
                      : <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-xs font-black">{user.firstName?.[0] ?? "K"}</div>
                    }
                    <span className="hidden sm:inline max-w-24 truncate">{user.firstName ?? user.emailAddresses[0]?.emailAddress}</span>
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                      <div className="px-4 py-3 border-b border-stone-800">
                        <p className="text-sm font-bold text-white truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-stone-500 truncate">{user.emailAddresses[0]?.emailAddress}</p>
                        {isAdmin && <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Yönetici</span>}
                      </div>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors">
                          🛡️ Yönetim Paneli
                        </Link>
                      )}
                      <Link href="/wishlist" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors">
                        ♡ Favorilerim
                      </Link>
                      <button
                        onClick={() => { signOut(() => router.push("/")); setAccountOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-stone-800 transition-colors border-t border-stone-800"
                      >
                        ↩ Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/sign-in" className="flex items-center gap-1.5 text-[10px] sm:text-sm font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 px-2.5 sm:px-4 py-2 rounded-xl transition-all">
                  Giriş Yap
                </Link>
              )
            )}

            {/* Mobil menü butonu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-all ml-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobil menü */}
        {menuOpen && (
          <div className="lg:hidden border-t border-stone-800 bg-stone-950 px-4 py-4 flex flex-col gap-1 animate-fade-in">
            {navLinks.map((l) => (
              <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="text-stone-300 hover:text-white hover:bg-stone-800 px-4 py-3 rounded-xl font-medium transition-colors">
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-amber-400 hover:text-amber-300 hover:bg-stone-800 px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2">
                🛡️ Yönetim Paneli
              </Link>
            )}
            {!isSignedIn
              ? <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="text-stone-300 hover:text-white hover:bg-stone-800 px-4 py-3 rounded-xl font-medium transition-colors">Giriş Yap</Link>
              : <button onClick={() => { signOut(() => router.push("/")); setMenuOpen(false); }} className="text-left text-red-400 hover:bg-stone-800 px-4 py-3 rounded-xl font-medium transition-colors">Çıkış Yap</button>
            }
          </div>
        )}
      </nav>
    </>
  );
}

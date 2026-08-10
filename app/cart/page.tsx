"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "../context/StoreContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal } = useStore();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const discount = promoApplied ? cartTotal * 0.2 : 0;
  const shipping = cartTotal > 500 ? 0 : 49;
  const total = cartTotal - discount + shipping;

  const applyPromo = () => {
    if (promo.toUpperCase() === "CARPET20") setPromoApplied(true);
  };

  if (cart.length === 0) return (
    <div className="bg-stone-950 min-h-screen text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-3xl font-black text-white mb-3">Sepetiniz boş</h2>
        <p className="text-stone-400 mb-8">El yapımı halı koleksiyonumuzu keşfedin</p>
        <Link href="/shop" className="inline-block bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-amber-500/30">
          Halılara Göz At →
        </Link>
      </div>
    </div>
  );

  return (
    <div className="bg-stone-950 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <nav className="flex items-center gap-2 text-xs text-stone-500 mb-2">
              <Link href="/" className="hover:text-amber-400 transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-stone-300">Sepet</span>
            </nav>
            <h1 className="text-4xl font-black text-white">Alışveriş Sepeti</h1>
            <p className="text-stone-400 mt-1">{cart.reduce((s, i) => s + i.quantity, 0)} ürün</p>
          </div>
          <button onClick={clearCart} className="text-sm text-stone-500 hover:text-red-400 transition-colors">Sepeti Temizle</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ürünler */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 bg-stone-900 border border-stone-800 rounded-2xl p-4 hover:border-stone-700 transition-colors">
                <Link href={`/shop/${item.id}`} className="shrink-0">
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/shop/${item.id}`} className="font-bold text-white hover:text-amber-400 transition-colors text-sm leading-snug line-clamp-2">
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-stone-500">{item.material}</span>
                        <span className="text-xs bg-stone-800 text-stone-400 px-2 py-0.5 rounded-lg">Boyut: {item.selectedSize}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-stone-600 hover:text-red-400 transition-colors shrink-0 text-lg leading-none">×</button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-stone-800 rounded-xl overflow-hidden">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-700 transition-colors">−</button>
                      <span className="w-10 text-center text-white text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-700 transition-colors">+</button>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-white">{(item.price * item.quantity).toLocaleString("tr-TR")}₺</p>
                      {item.quantity > 1 && <p className="text-xs text-stone-500">{item.price.toLocaleString("tr-TR")}₺ / adet</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sipariş Özeti */}
          <div className="lg:col-span-1">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-black text-white mb-6">Sipariş Özeti</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Ara Toplam</span>
                  <span className="text-white font-semibold">{cartTotal.toLocaleString("tr-TR")}₺</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">İndirim (%20)</span>
                    <span className="text-emerald-400 font-semibold">−{discount.toLocaleString("tr-TR")}₺</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Kargo</span>
                  <span className={shipping === 0 ? "text-emerald-400 font-semibold" : "text-white font-semibold"}>
                    {shipping === 0 ? "Ücretsiz" : `${shipping}₺`}
                  </span>
                </div>
                {shipping > 0 && <p className="text-xs text-stone-500">Ücretsiz kargo için {(500 - cartTotal).toLocaleString("tr-TR")}₺ daha ekle</p>}
              </div>

              <div className="border-t border-stone-800 pt-4 mb-5">
                <div className="flex justify-between">
                  <span className="font-bold text-white">Toplam</span>
                  <span className="text-2xl font-black text-white">{total.toLocaleString("tr-TR")}₺</span>
                </div>
              </div>

              {/* Promosyon */}
              <div className="mb-5">
                <div className="flex gap-2">
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="İndirim kodu"
                    className="flex-1 bg-stone-800 border border-stone-700 text-white placeholder-stone-500 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors"
                  />
                  <button onClick={applyPromo} className="bg-stone-700 hover:bg-stone-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    Uygula
                  </button>
                </div>
                {promoApplied && <p className="text-xs text-emerald-400 mt-2">✓ CARPET20 kodu uygulandı — %20 indirim!</p>}
                {!promoApplied && <p className="text-xs text-stone-600 mt-2">Dene: CARPET20</p>}
              </div>

              <Link href="/checkout" className="block w-full text-center bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30 mb-3">
                Ödemeye Geç →
              </Link>
              <Link href="/shop" className="block w-full text-center text-sm text-stone-400 hover:text-white transition-colors py-2">
                ← Alışverişe Devam Et
              </Link>

              <div className="mt-5 pt-5 border-t border-stone-800 flex items-center justify-center gap-4 text-xs text-stone-600">
                <span>🔒 Güvenli</span>
                <span>↩️ 30 gün iade</span>
                <span>🚚 Hızlı teslimat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import HeroSlider from "./components/HeroSlider";
import ProductCard from "./components/ProductCard";
import NewsletterForm from "./components/NewsletterForm";
import { products, categories } from "./data/products";

const featured = products.filter((p) => p.badge).slice(0, 4);
const bestSellers = products.sort((a, b) => b.reviews - a.reviews).slice(0, 4);

const categoryImages: Record<string, string> = {
  İran: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&q=80",
  Fas: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
  Türk: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
  Modern: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  Vintage: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&q=80",
  Doğal: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80",
};

const trustBadges = [
  { icon: "🚚", title: "Ücretsiz Kargo", sub: "500₺ üzeri siparişlerde" },
  { icon: "↩️", title: "30 Gün İade", sub: "Kolay ve sorunsuz iade" },
  { icon: "🔒", title: "Güvenli Ödeme", sub: "256-bit SSL şifreleme" },
  { icon: "🏆", title: "Özgünlük Garantisi", sub: "Sertifikalı orijinal halılar" },
  { icon: "📞", title: "Uzman Destek", sub: "Haftanın 7 günü" },
];

export default function Home() {
  return (
    <main className="bg-stone-950 text-white min-h-screen">
      <HeroSlider />

      {/* Güven rozetleri */}
      <section className="border-y border-stone-800 bg-stone-900/50">
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-5 gap-4">
          {trustBadges.map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <span className="text-2xl">{b.icon}</span>
              <div>
                <p className="text-xs font-bold text-white">{b.title}</p>
                <p className="text-xs text-stone-500">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kategoriye Göre Alışveriş */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2">Keşfet</p>
            <h2 className="text-4xl font-black text-white">Kategoriye Göre Alışveriş</h2>
          </div>
          <Link href="/shop" className="text-sm text-stone-400 hover:text-amber-400 transition-colors font-medium">
            Tümünü Gör →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.filter((c) => c !== "Tümü" && categoryImages[c]).map((cat) => (
            <Link key={cat} href={`/shop?category=${cat}`} className="group relative overflow-hidden rounded-2xl aspect-square bg-stone-800">
              <img src={categoryImages[cat]} alt={cat} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <span className="text-sm font-bold text-white">{cat}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Öne Çıkan Ürünler */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2">Özenle Seçildi</p>
            <h2 className="text-4xl font-black text-white">Öne Çıkan Halılar</h2>
          </div>
          <Link href="/shop" className="text-sm text-stone-400 hover:text-amber-400 transition-colors font-medium">
            Tümünü Gör →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl h-72 md:h-96">
          <img src="https://images.unsplash.com/photo-1600166898405-da9535204843?w=1400&q=80" alt="banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/60 to-transparent" />
          <div className="absolute inset-0 flex items-center px-10 md:px-16">
            <div className="max-w-lg">
              <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">Sınırlı Sayıda</span>
              <h3 className="text-3xl md:text-5xl font-black text-white mt-2 mb-4 leading-tight">Afgan Kabile<br />Koleksiyonu</h3>
              <p className="text-stone-400 mb-6 text-sm md:text-base">Müze kalitesinde el dokuma halılar. Sadece 3 adet kaldı.</p>
              <Link href="/shop?category=İran" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-7 py-3.5 rounded-2xl transition-all hover:shadow-lg hover:shadow-amber-500/30">
                Hemen Al →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Çok Satanlar */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2">En Çok Sevilen</p>
            <h2 className="text-4xl font-black text-white">Çok Satanlar</h2>
          </div>
          <Link href="/shop" className="text-sm text-stone-400 hover:text-amber-400 transition-colors font-medium">
            Tümünü Gör →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Neden Biz */}
      <section className="bg-stone-900/50 border-y border-stone-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2">Neden Bizi Seçmelisiniz</p>
            <h2 className="text-4xl font-black text-white">Arabzada Farkı</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🧵", title: "Usta İşçiliği", desc: "Her halı, nesiller boyu aktarılan yüzyıllık tekniklerle deneyimli ustalar tarafından el yapımı olarak üretilmektedir." },
              { icon: "🌿", title: "Sürdürülebilir Malzeme", desc: "Yalnızca doğal ve etik kaynaklı malzemeler kullanıyoruz — yün, ipek, pamuk ve jüt — çevre dostu boyalarla." },
              { icon: "📜", title: "Özgünlük Sertifikası", desc: "Her halı, menşeini, malzemesini ve işçiliğini doğrulayan bir sertifika ile birlikte gelir." },
            ].map((item) => (
              <div key={item.title} className="text-center p-8 bg-stone-900 border border-stone-800 rounded-2xl hover:border-amber-500/30 transition-colors">
                <div className="text-5xl mb-5">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bülten */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-amber-950/60 via-stone-900 to-stone-900 border border-amber-900/40 rounded-3xl p-10 md:p-16 text-center">
          <p className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-3">Haberdar Ol</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Özel Tekliflerden Haberdar Ol</h2>
          <p className="text-stone-400 mb-8 max-w-md mx-auto">Yeni koleksiyonlara erken erişim, dekorasyon ipuçları ve üyelere özel indirimler için abone ol.</p>
          <NewsletterForm />
          <p className="text-xs text-stone-600 mt-4">Spam yok. İstediğin zaman abonelikten çıkabilirsin.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-stone-950">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-black text-base">A</span>
              </div>
              <div>
                <span className="block font-black text-white">Arabzada</span>
                <span className="block text-[10px] text-amber-500 tracking-widest uppercase">El Yapımı Halılar</span>
              </div>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed">1998'den bu yana dünyanın en güzel el yapımı halılarını sunuyoruz. Özgünlük garantili.</p>
          </div>
          {[
            { title: "Mağaza", links: ["Tüm Halılar", "İran", "Fas", "Modern", "Vintage", "Dış Mekan"] },
            { title: "Yardım", links: ["Kargo Bilgisi", "İade", "Ölçü Rehberi", "Bakım Rehberi", "SSS"] },
            { title: "Kurumsal", links: ["Hakkımızda", "Blog", "Basın", "Kariyer", "İletişim"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}><Link href="/shop" className="text-stone-500 hover:text-amber-400 text-sm transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-stone-800 px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-600 text-xs">
          <span>© 2025 Arabzada. Tüm hakları saklıdır.</span>
          <div className="flex gap-5">
            {["Gizlilik Politikası", "Kullanım Koşulları", "Çerez Politikası"].map((l) => (
              <Link key={l} href="/" className="hover:text-stone-400 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

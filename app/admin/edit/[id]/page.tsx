"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useStore } from "../../../context/StoreContext";
import ProductForm from "../../../components/ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { products, updateProduct } = useStore();
  const router = useRouter();

  const role = (user?.publicMetadata as { role?: string })?.role;
  const isAdmin = isSignedIn && role === "admin";

  useEffect(() => {
    if (isLoaded && (!isSignedIn || !isAdmin)) router.replace("/");
  }, [isLoaded, isSignedIn, isAdmin, router]);

  const product = products.find((p) => p.id === Number(id));

  if (!isLoaded || !isAdmin) return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="bg-stone-950 min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-5xl mb-4">📦</div>
        <h2 className="text-2xl font-black mb-3">Product not found</h2>
        <Link href="/admin" className="text-amber-500 hover:text-amber-400 transition-colors">← Back to Admin</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-stone-950 min-h-screen text-white">
      <div className="bg-stone-900 border-b border-stone-800 px-6 py-3 flex items-center justify-between">
        <span className="bg-amber-600/20 border border-amber-600/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Admin Panel</span>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-stone-400 hover:text-white transition-colors">← View Store</Link>
          <button onClick={() => signOut(() => router.push("/"))} className="text-sm bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 px-4 py-2 rounded-xl transition-colors">
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link href="/admin" className="hover:text-amber-400 transition-colors">Admin</Link>
          <span>/</span>
          <span className="text-stone-300">Edit Product</span>
        </nav>

        <div className="flex items-start gap-4 mb-8">
          <img src={product.image} alt={product.name} className="w-16 h-16 rounded-2xl object-cover bg-stone-800 shrink-0" />
          <div>
            <h1 className="text-2xl font-black text-white">{product.name}</h1>
            <p className="text-stone-400 text-sm mt-1">ID: {product.id} · {product.category}</p>
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8">
          <ProductForm
            initial={product}
            onSubmit={(data) => { updateProduct({ ...data, id: product.id }); router.push("/admin"); }}
            onCancel={() => router.push("/admin")}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </div>
  );
}

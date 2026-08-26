"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "../context/StoreContext";

const IBAN = "TR970020500009745808400002";
const ACCOUNT_NAME = "FAZAL HAQ ARABZADA";
const WHATSAPP_PHONE = "905523852376";

export default function CheckoutPage() {
  const { cart, cartTotal } = useStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const copyToClipboard = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 1500);
    } catch {
      setCopiedField(null);
    }
  };

  const whatsappLink = useMemo(() => {
    const orderSummary = cart
      .map((item) => `${item.name} (${item.quantity}x)`)
      .join(", ");

    const message = `Hello, I want to complete my order. ${
      orderSummary ? `Items: ${orderSummary}.` : ""
    } Total: ${cartTotal.toLocaleString("tr-TR")}₺.`;

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  }, [cart, cartTotal]);

  if (cart.length === 0) {
    return (
      <div className="bg-stone-950 min-h-screen text-white flex items-center justify-center">
        <div className="text-center max-w-xl px-6">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-3xl font-black text-white mb-3">Your cart is empty</h2>
          <p className="text-stone-400 mb-8">Add a product before you continue to checkout.</p>
          <Link href="/shop" className="inline-block bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-amber-500/30">
            Browse products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-950 min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-amber-400 transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-stone-300">Checkout</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-4xl font-black text-white">Checkout</h1>
          <p className="text-stone-400 mt-2">{totalItems} item(s) selected for payment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
            <h2 className="text-xl font-black text-white mb-5">Order summary</h2>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 border-b border-stone-800 pb-4 last:border-b-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover bg-stone-800" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-white leading-snug">{item.name}</p>
                        <p className="text-xs text-stone-400 mt-1">Size: {item.selectedSize}</p>
                      </div>
                      <p className="font-bold text-white">{(item.price * item.quantity).toLocaleString("tr-TR")}₺</p>
                    </div>
                    <p className="text-sm text-stone-400 mt-2">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-stone-800 pt-5">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Total</span>
                <span className="text-3xl font-black text-white">{cartTotal.toLocaleString("tr-TR")}₺</span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-gradient-to-br from-amber-500/10 to-stone-900 border border-amber-500/30 rounded-3xl p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Bank transfer</p>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black text-white">Account holder</h2>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ACCOUNT_NAME, "name")}
                      className="text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors"
                    >
                      {copiedField === "name" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="bg-stone-950/70 border border-stone-700 rounded-2xl px-4 py-3 text-base font-semibold text-amber-100 break-all">
                    {ACCOUNT_NAME}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black text-white">IBAN</h2>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(IBAN, "iban")}
                      className="text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors"
                    >
                      {copiedField === "iban" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="bg-stone-950/70 border border-stone-700 rounded-2xl px-4 py-3 text-base font-semibold text-amber-200 break-all">
                    {IBAN}
                  </div>
                </div>
              </div>

              <p className="text-sm text-stone-400 mt-4">Please use the total amount shown above and send the payment confirmation in WhatsApp.</p>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Instant message</p>
              <h2 className="text-2xl font-black text-white mt-3">Contact on WhatsApp</h2>
              <p className="text-sm text-stone-400 mt-2">Send your payment and order details directly to the store.</p>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3.5 rounded-2xl transition-all hover:shadow-lg hover:shadow-emerald-500/30"
              >
                WhatsApp order confirmation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

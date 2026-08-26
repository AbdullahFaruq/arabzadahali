// The store's WhatsApp line: +90 552 385 23 76.
// Click-to-chat links need the international form: country code 90, no trunk 0.
export const WHATSAPP_PHONE = "905523852376";
export const WHATSAPP_DISPLAY = "+90 552 385 23 76";

// wa.me is WhatsApp's documented click-to-chat link and the most broadly
// supported across iOS, Android and desktop. Bare (no query string) is the
// most reliable "open this chat" form; `text` only prefills the draft.
export const whatsappChatUrl = (text?: string) =>
  text
    ? `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${WHATSAPP_PHONE}`;

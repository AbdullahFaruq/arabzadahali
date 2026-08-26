// The store's WhatsApp line: +90 552 385 23 76.
// Click-to-chat links need the international form: country code 90, no trunk 0.
export const WHATSAPP_PHONE = "905523852376";
export const WHATSAPP_DISPLAY = "+90 552 385 23 76";

// WhatsApp's canonical click-to-chat endpoint. `type=phone_number` is what makes
// it open the direct chat rather than falling back to the contact picker, and
// `app_absent=0` hands off to the installed app instead of the web client.
export const whatsappChatUrl = (text?: string) => {
  const params = new URLSearchParams({
    phone: WHATSAPP_PHONE,
    type: "phone_number",
    app_absent: "0",
  });
  if (text) params.set("text", text);
  return `https://api.whatsapp.com/send/?${params.toString()}`;
};

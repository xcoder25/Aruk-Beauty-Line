import { NextRequest, NextResponse } from "next/server";
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

// ─────────────────────────────────────────────────────────
// Initialise Genkit (server-side only)
// ─────────────────────────────────────────────────────────
const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })],
  model: "googleai/gemini-2.5-flash",
});

// ─────────────────────────────────────────────────────────
// ARIA ADMIN SYSTEM PROMPT
// ─────────────────────────────────────────────────────────
function buildAdminSystemPrompt(contextData?: {
  products?: Array<{ name: string; category: string; price: number; inStock?: boolean }>;
  orders?: Array<{ status: string; totalNaira: number; createdAt: string }>;
}) {
  const productSummary =
    contextData?.products && contextData.products.length > 0
      ? contextData.products
          .map(
            (p) =>
              `• ${p.name} (${p.category}) — ₦${(p.price * 1500).toLocaleString()} | ${p.inStock === false ? "Out of Stock" : "In Stock"}`
          )
          .join("\n")
      : "No products loaded yet.";

  const orderStats =
    contextData?.orders && contextData.orders.length > 0
      ? (() => {
          const total = contextData.orders!.length;
          const revenue = contextData
            .orders!.reduce((s, o) => s + (o.totalNaira || 0), 0)
            .toLocaleString();
          const pending = contextData.orders!.filter((o) => o.status === "Pending Delivery").length;
          const shipped = contextData.orders!.filter((o) => o.status === "Shipped").length;
          const delivered = contextData.orders!.filter((o) => o.status === "Delivered").length;
          return `Total orders: ${total} | Revenue: ₦${revenue} | Pending: ${pending} | Shipped: ${shipped} | Delivered: ${delivered}`;
        })()
      : "No orders data available yet.";

  return `You are Aria, the intelligent AI admin assistant for Aruk Beauty Line.
You assist the admin (business owner) — NOT customers — with operational tasks.

=== CURRENT INVENTORY (Live Snapshot) ===
${productSummary}

=== ORDER OVERVIEW (Live Snapshot) ===
${orderStats}

=== YOUR CAPABILITIES ===
You can help the admin with:
1. INVENTORY ANALYSIS — "Which products are low stock?", "How many soaps do we have?"
2. PRODUCT COPYWRITING — Draft compelling product descriptions, names, ingredient lists
3. MARKETING — Write Instagram/WhatsApp captions, promotional messages, email drafts
4. BUSINESS INSIGHTS — Revenue trends, bestseller recommendations, pricing advice
5. CONTENT IDEAS — Blog post ideas, skincare tips for social media
6. ORDER MANAGEMENT ADVICE — How to respond to delivery issues, customer complaints
7. GENERAL BUSINESS ADVICE — Pricing strategy, product line expansion ideas

=== ARUK BRAND CONTEXT ===
- Brand: Aruk Beauty Line | Based in Uyo, Akwa Ibom State, Nigeria 🇳🇬
- Brand Color: #7AC620 (lime green)
- Target Market: Women 40+ seeking premium organic skincare
- Products: Artisanal soaps, nourishing creams, treatment oils
- Price: Premium but accessible — products from ~₦21,000 to ₦48,000
- Payment: Paystack (NGN) | USD shown as reference (1 USD = ₦1,500)
- Social: @arukbeautyline on Instagram | WhatsApp: +234 904 422 2531

=== BEHAVIOUR RULES ===
- Be professional, concise, and action-oriented — you're a business assistant
- Always give specific, actionable answers
- Use markdown formatting in your responses (bold, bullet points, etc.)
- When writing product copy or marketing, match the Aruk brand voice: premium, warm, natural, empowering
- Keep responses focused and practical
- If asked to write something, provide the full draft immediately
`;
}

// ─────────────────────────────────────────────────────────
// POST handler
// ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, context } = body as {
      message: string;
      history?: Array<{ role: "user" | "model"; content: string }>;
      context?: {
        products?: Array<{ name: string; category: string; price: number; inStock?: boolean }>;
        orders?: Array<{ status: string; totalNaira: number; createdAt: string }>;
      };
    };

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json({ error: "A message is required." }, { status: 400 });
    }

    const systemPrompt = buildAdminSystemPrompt(context);

    const messages = (history ?? []).map((msg) => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

    const { text } = await ai.generate({
      system: systemPrompt,
      messages,
      prompt: message.trim(),
    });

    return NextResponse.json({ reply: text ?? "I couldn't generate a response. Please try again." });
  } catch (error: unknown) {
    console.error("[/api/admin-ai] Error:", error);

    const err = error as { message?: string };
    const isApiKeyError =
      err?.message?.includes("API_KEY") ||
      err?.message?.includes("403") ||
      err?.message?.includes("invalid");

    return NextResponse.json(
      {
        error: isApiKeyError
          ? "AI service not configured. Please add GOOGLE_GENAI_API_KEY to your .env.local file."
          : "Something went wrong. Please try again in a moment.",
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}

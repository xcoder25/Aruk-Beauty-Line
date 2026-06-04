import { NextRequest, NextResponse } from "next/server";
import { arukChat, ChatMessage } from "../../lib/genkit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body as {
      message: string;
      history: ChatMessage[];
    };

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "A message is required." },
        { status: 400 }
      );
    }

    // Call the Genkit-powered chat function (server-side — API key is safe)
    const reply = await arukChat(message.trim(), history ?? []);

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("[/api/chat] Error:", error);
    
    // Friendly error message
    const isApiKeyError =
      error?.message?.includes("API_KEY") ||
      error?.message?.includes("403") ||
      error?.message?.includes("invalid");

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

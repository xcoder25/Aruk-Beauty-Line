/**
 * Sends a branded order confirmation email to the customer
 * by calling the /api/send-order-email Next.js API route.
 */
export async function sendOrderConfirmationEmail(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  orderRef: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  totalNaira: number;
  createdAt: string;
}): Promise<void> {
  try {
    const res = await fetch("/api/send-order-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Email API error:", data);
    }
  } catch (err) {
    // Non-blocking — don't throw; order was still placed successfully
    console.error("Failed to send order confirmation email:", err);
  }
}

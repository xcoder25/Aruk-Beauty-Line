import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderEmailPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  orderRef: string;
  items: OrderItem[];
  subtotal: number;
  totalNaira: number;
  createdAt: string;
}

// Build the branded HTML email
function buildOrderEmailHtml(data: OrderEmailPayload): string {
  const {
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    customerCity,
    orderRef,
    items,
    subtotal,
    totalNaira,
    createdAt,
  } = data;

  const firstName = customerName.split(" ")[0];
  const deliveryFee = totalNaira - subtotal;
  const isFreeShipping = deliveryFee === 0;

  const orderDate = new Date(createdAt).toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f0ebe3; font-size: 14px; color: #2d2d2d;">
          <strong>${item.name}</strong><br/>
          <span style="color: #8a8070; font-size: 12px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f0ebe3; font-size: 14px; color: #2d2d2d; text-align: right; white-space: nowrap;">
          ₦${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmed — Aruk Beauty Line</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:'Georgia',serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,0.08);">

          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a2e0a 0%,#2d4d12 50%,#1a2e0a 100%);padding:40px 32px;text-align:center;">
              <!-- Logo Circle -->
              <div style="width:72px;height:72px;border-radius:50%;border:2px solid rgba(122,198,32,0.5);margin:0 auto 20px;overflow:hidden;background:#2d4d12;">
                <img src="https://arukbeautyline.com/aruk_logo_4k.png" alt="Aruk Beauty" width="72" height="72" style="object-fit:cover;display:block;" onerror="this.style.display='none'"/>
              </div>
              <!-- Success Check -->
              <div style="width:52px;height:52px;background:#7AC620;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
                <span style="color:white;font-size:26px;line-height:52px;display:block;text-align:center;">✓</span>
              </div>
              <h1 style="color:#ffffff;font-size:26px;margin:0 0 8px;font-family:'Georgia',serif;font-weight:bold;">Order Confirmed! 🎉</h1>
              <p style="color:#b4e878;font-size:14px;margin:0 0 16px;font-weight:300;">Thank you, ${firstName}! Your skin is in for a treat.</p>
              <div style="display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:100px;padding:6px 18px;">
                <span style="color:rgba(255,255,255,0.85);font-size:11px;font-family:monospace;letter-spacing:2px;text-transform:uppercase;">Ref: ${orderRef}</span>
              </div>
            </td>
          </tr>

          <!-- Order Date -->
          <tr>
            <td style="padding:20px 32px 0;text-align:center;">
              <p style="color:#9b8e80;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0;">${orderDate}</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:16px 32px;">
              <div style="height:1px;background:linear-gradient(to right,transparent,#e8ddd0,transparent);"></div>
            </td>
          </tr>

          <!-- Items Ordered -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ebe3;border-radius:12px;overflow:hidden;">
                <tr style="background:#faf7f2;">
                  <td colspan="2" style="padding:12px 16px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:#7AC620;border-bottom:1px solid #f0ebe3;">
                    🛍️ Items Ordered
                  </td>
                </tr>
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Payment Summary -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ebe3;border-radius:12px;overflow:hidden;">
                <tr style="background:#faf7f2;">
                  <td colspan="2" style="padding:12px 16px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:#7AC620;border-bottom:1px solid #f0ebe3;">
                    💳 Payment Summary
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:13px;color:#8a8070;">Products Subtotal</td>
                  <td style="padding:10px 16px;font-size:13px;color:#8a8070;text-align:right;">₦${subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:13px;color:#8a8070;border-bottom:1px solid #f0ebe3;">Delivery Fee</td>
                  <td style="padding:10px 16px;font-size:13px;color:#8a8070;text-align:right;border-bottom:1px solid #f0ebe3;">${isFreeShipping ? "FREE 🎉" : "₦7,500"}</td>
                </tr>
                <tr style="background:#f5f0e8;">
                  <td style="padding:14px 16px;font-size:15px;font-weight:bold;color:#1a2e0a;">Total Paid</td>
                  <td style="padding:14px 16px;font-size:15px;font-weight:bold;color:#7AC620;text-align:right;">₦${totalNaira.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:8px 16px;text-align:center;">
                    <span style="background:#dcfce7;color:#16a34a;font-size:10px;font-family:monospace;padding:4px 10px;border-radius:100px;border:1px solid #bbf7d0;">✓ Verified by Paystack</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Details -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ebe3;border-radius:12px;overflow:hidden;">
                <tr style="background:#faf7f2;">
                  <td style="padding:12px 16px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:#7AC620;border-bottom:1px solid #f0ebe3;">
                    📦 Delivery Information
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:11px;color:#9b8e80;text-transform:uppercase;letter-spacing:1px;padding-bottom:2px;">Full Name</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#2d2d2d;font-weight:600;padding-bottom:12px;">${customerName}</td>
                      </tr>
                      <tr>
                        <td style="font-size:11px;color:#9b8e80;text-transform:uppercase;letter-spacing:1px;padding-bottom:2px;">Email</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#2d2d2d;padding-bottom:12px;">${customerEmail}</td>
                      </tr>
                      <tr>
                        <td style="font-size:11px;color:#9b8e80;text-transform:uppercase;letter-spacing:1px;padding-bottom:2px;">Phone</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#2d2d2d;padding-bottom:12px;">${customerPhone}</td>
                      </tr>
                      <tr>
                        <td style="font-size:11px;color:#9b8e80;text-transform:uppercase;letter-spacing:1px;padding-bottom:2px;">Delivery Address</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#2d2d2d;">${customerAddress}, ${customerCity}, Nigeria 🇳🇬</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(122,198,32,0.08),rgba(197,168,128,0.08));border:1px solid rgba(122,198,32,0.2);border-radius:12px;padding:20px;">
                <tr>
                  <td style="text-align:center;padding:0 16px;">
                    <p style="font-size:13px;font-weight:bold;color:#1a2e0a;margin:0 0 12px;">What happens next?</p>
                    <p style="font-size:12px;color:#6b6055;margin:0 0 8px;">
                      <span style="background:rgba(122,198,32,0.15);color:#4a7d0f;border-radius:50%;width:18px;height:18px;display:inline-block;font-size:10px;font-weight:bold;line-height:18px;text-align:center;margin-right:6px;">1</span>
                      We confirm your order within 2 hours
                    </p>
                    <p style="font-size:12px;color:#6b6055;margin:0 0 8px;">
                      <span style="background:rgba(122,198,32,0.15);color:#4a7d0f;border-radius:50%;width:18px;height:18px;display:inline-block;font-size:10px;font-weight:bold;line-height:18px;text-align:center;margin-right:6px;">2</span>
                      Products are carefully packaged for you
                    </p>
                    <p style="font-size:12px;color:#6b6055;margin:0 0 16px;">
                      <span style="background:rgba(122,198,32,0.15);color:#4a7d0f;border-radius:50%;width:18px;height:18px;display:inline-block;font-size:10px;font-weight:bold;line-height:18px;text-align:center;margin-right:6px;">3</span>
                      Delivery within 1–3 business days in Uyo
                    </p>
                    <a href="https://wa.me/2349044222531" style="display:inline-block;background:#25D366;color:white;font-size:11px;font-weight:bold;padding:8px 20px;border-radius:100px;text-decoration:none;">
                      💬 Track via WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#faf7f2;padding:24px 32px;text-align:center;border-top:1px solid #f0ebe3;">
              <p style="font-size:13px;font-weight:bold;color:#1a2e0a;margin:0 0 4px;font-family:'Georgia',serif;">Aruk Beauty Line 🌿</p>
              <p style="font-size:11px;color:#9b8e80;margin:0 0 12px;">Handcrafted in Uyo, Akwa Ibom · Nigeria</p>
              <p style="font-size:10px;color:#b0a090;margin:0;">
                Questions? WhatsApp us at <a href="https://wa.me/2349044222531" style="color:#7AC620;text-decoration:none;">+234 904 422 2531</a>
              </p>
              <p style="font-size:10px;color:#c0b0a0;margin:8px 0 0;">© ${new Date().getFullYear()} Aruk Beauty Line. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderEmailPayload = await req.json();

    const {
      customerName,
      customerEmail,
      orderRef,
      items,
      subtotal,
      totalNaira,
      createdAt,
    } = body;

    // Validate required fields
    if (!customerEmail || !orderRef || !items?.length) {
      return NextResponse.json(
        { error: "Missing required order fields." },
        { status: 400 }
      );
    }

    // Create SMTP transporter using custom domain SMTP credentials from env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,           // e.g. mail.arukbeautyline.com
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE !== "false", // true for port 465, false for 587
      auth: {
        user: process.env.SMTP_USER,         // e.g. orders@arukbeautyline.com
        pass: process.env.SMTP_PASS,         // your email password
      },
    });

    const htmlContent = buildOrderEmailHtml(body);

    // Plain text fallback
    const textContent = `
Order Confirmed — Aruk Beauty Line

Hi ${customerName.split(" ")[0]},

Your order has been confirmed and payment verified via Paystack.

Order Reference: ${orderRef}
Date: ${new Date(createdAt).toLocaleString("en-NG")}

Items:
${items.map((item) => `  - ${item.name} x${item.quantity} — ₦${(item.price * item.quantity).toLocaleString()}`).join("\n")}

Subtotal: ₦${subtotal.toLocaleString()}
Delivery: ${totalNaira - subtotal === 0 ? "FREE" : "₦7,500"}
Total Paid: ₦${totalNaira.toLocaleString()}

We'll confirm your order within 2 hours and deliver within 1–3 business days in Uyo.

Track via WhatsApp: https://wa.me/2349044222531

— Aruk Beauty Line 🌿
Handcrafted in Uyo, Nigeria
    `.trim();

    await transporter.sendMail({
      from: `"Aruk Beauty Line" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `✅ Order Confirmed — Ref: ${orderRef} | Aruk Beauty Line`,
      text: textContent,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Order email send error:", error);
    return NextResponse.json(
      { error: "Failed to send confirmation email.", detail: error?.message },
      { status: 500 }
    );
  }
}

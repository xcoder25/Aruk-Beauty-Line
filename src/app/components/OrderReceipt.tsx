"use client";

import Image from "next/image";
import { Check, Download, ShoppingBag, MapPin, Phone, Mail, User, Sparkles } from "lucide-react";

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderReceiptProps {
  orderRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  items: ReceiptItem[];
  subtotalUsd: number;
  totalNaira: number;
  createdAt: string;
  onClose: () => void;
}

export default function OrderReceipt({
  orderRef,
  customerName,
  customerEmail,
  customerPhone,
  customerAddress,
  customerCity,
  items,
  subtotalUsd,
  totalNaira,
  createdAt,
  onClose,
}: OrderReceiptProps) {
  const orderDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-grow overflow-y-auto bg-gradient-to-b from-background to-accent/10 receipt-container">
      {/* Success Confetti Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a2e0a] via-[#2d4d12] to-[#1a2e0a] p-8 text-center">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#7AC620]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `receiptSparkle ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#7AC620]/50 shadow-lg shadow-[#7AC620]/20">
            <Image src="/aruk_logo_4k.png" alt="Aruk Beauty" fill style={{ objectFit: "cover" }} />
          </div>
        </div>

        {/* Success Badge */}
        <div className="flex justify-center mb-4">
          <div
            className="w-14 h-14 rounded-full bg-[#7AC620] flex items-center justify-center shadow-xl shadow-[#7AC620]/40"
            style={{ animation: "receiptCheckBounce 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both" }}
          >
            <Check className="w-7 h-7 text-white stroke-[3]" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white font-serif mb-1">Order Confirmed! 🎉</h2>
        <p className="text-[#b4e878] text-sm font-light">
          Thank you, {customerName.split(" ")[0]}! Your skin is in for a treat.
        </p>
        <div className="mt-3 inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
          <span className="text-[10px] font-mono text-white/80 tracking-widest uppercase">
            Ref: {orderRef}
          </span>
        </div>
      </div>

      {/* Receipt Body */}
      <div className="p-5 space-y-4">

        {/* Order Date */}
        <div className="text-center">
          <p className="text-[10px] text-muted uppercase tracking-widest font-medium">{orderDate}</p>
        </div>

        {/* Divider with logo */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <Sparkles className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Items Ordered */}
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-accent/30 border-b border-border/60 flex items-center gap-2">
            <ShoppingBag className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Items Ordered</h3>
          </div>
          <div className="divide-y divide-border/40">
            {items.map((item, idx) => (
              <div key={idx} className="px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-foreground leading-snug">{item.name}</p>
                  <p className="text-[10px] text-muted mt-0.5">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-accent/30 border-b border-border/60">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Payment Summary</h3>
          </div>
          <div className="p-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-muted">
              <span>Products Subtotal</span>
              <span>₦{subtotalUsd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Delivery Fee</span>
              <span>{subtotalUsd >= 75000 ? "FREE 🎉" : "₦7,500"}</span>
            </div>
            <div className="h-px bg-border/60" />
            <div className="flex justify-between font-bold text-foreground text-sm">
              <span>Total Paid</span>
              <span className="text-primary">₦{totalNaira.toLocaleString()}</span>
            </div>
            <div className="mt-1 text-center">
              <span className="text-[9px] font-mono bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                ✓ Verified by Paystack
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-accent/30 border-b border-border/60">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Delivery Information</h3>
          </div>
          <div className="p-4 space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider font-medium">Full Name</p>
                <p className="font-semibold text-foreground mt-0.5">{customerName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider font-medium">Email</p>
                <p className="font-medium text-foreground mt-0.5">{customerEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider font-medium">Phone</p>
                <p className="font-medium text-foreground mt-0.5">{customerPhone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider font-medium">Delivery Address</p>
                <p className="font-medium text-foreground mt-0.5 leading-relaxed">
                  {customerAddress},<br />
                  {customerCity}, Nigeria 🇳🇬
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-gradient-to-br from-[#7AC620]/10 to-[#C5A880]/10 border border-[#7AC620]/20 rounded-2xl p-4 text-center space-y-2">
          <p className="text-xs font-bold text-foreground">What happens next?</p>
          <div className="flex justify-center gap-1 items-center text-[10px] text-muted">
            <span className="bg-primary/15 text-primary rounded-full w-4 h-4 flex items-center justify-center font-bold text-[9px] flex-shrink-0">1</span>
            <span>We confirm your order within 2 hours</span>
          </div>
          <div className="flex justify-center gap-1 items-center text-[10px] text-muted">
            <span className="bg-primary/15 text-primary rounded-full w-4 h-4 flex items-center justify-center font-bold text-[9px] flex-shrink-0">2</span>
            <span>Products are carefully packaged for you</span>
          </div>
          <div className="flex justify-center gap-1 items-center text-[10px] text-muted">
            <span className="bg-primary/15 text-primary rounded-full w-4 h-4 flex items-center justify-center font-bold text-[9px] flex-shrink-0">3</span>
            <span>Delivery within 1-3 business days in Uyo</span>
          </div>
          <a
            href="https://wa.me/2349044222531"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-1 bg-[#25D366] text-white text-[10px] font-semibold px-3 py-1.5 rounded-full"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.115-2.886-6.981-1.862-1.865-4.34-2.89-6.984-2.891-5.439 0-9.865 4.421-9.869 9.867-.001 1.73.454 3.42 1.316 4.908l-.975 3.565 3.654-.958z"/>
            </svg>
            Track via WhatsApp
          </a>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pb-2">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 border border-border/80 bg-card text-foreground/80 hover:text-foreground text-[10px] font-semibold uppercase tracking-wider py-3 rounded-full transition-all hover:border-primary/50 hover:bg-accent/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Save Receipt
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider py-3 rounded-full transition-all hover:bg-primary/90 shadow-md shadow-primary/20 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Shop More
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[9px] text-muted pb-2">
          Aruk Beauty Line · Uyo, Akwa Ibom · Nigeria 🌿
        </p>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes receiptCheckBounce {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(5deg); }
          80% { transform: scale(0.92) rotate(-3deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes receiptSparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @media print {
          .receipt-container { overflow: visible !important; }
        }
      `}</style>
    </div>
  );
}

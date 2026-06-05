"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Products, { Product } from "../components/Products";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";
import OrderReceipt from "../components/OrderReceipt";
import RoutineFinder from "../components/RoutineFinder";
import Image from "next/image";
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ShieldCheck, 
  CreditCard, 
  ArrowLeft, 
  Loader2,
  Sparkles,
  Leaf
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { sendOrderConfirmationEmail } from "../lib/sendOrderEmail";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function StorePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRoutineOpen, setIsRoutineOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });

  // Checkout and Paystack States
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "success">("cart");
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [custCity, setCustCity] = useState("Uyo");
  const [paying, setPaying] = useState(false);
  const [lastOrderRef, setLastOrderRef] = useState("");
  const [completedOrder, setCompletedOrder] = useState<{
    orderRef: string;
    items: CartItem[];
    subtotal: number;
    totalNaira: number;
    createdAt: string;
  } | null>(null);

  // Load Paystack script dynamically on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("aruk_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to parse saved cart", err);
      }
    }
    setIsCartLoaded(true);
  }, []);

  // Save cart to localStorage on updates
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem("aruk_cart", JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]);

  // Sync scroll lock with cart drawer
  useEffect(() => {
    if (isCartOpen || isRoutineOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, isRoutineOpen]);

  // Reset checkout step when cart drawer closes
  useEffect(() => {
    if (!isCartOpen) {
      const timer = setTimeout(() => {
        setCheckoutStep("cart");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast({ message: "", show: false });
    }, 3000);
  };

  const handleAddToBag = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        showToast(`Added another ${product.name} to your bag.`);
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showToast(`${product.name} added to your bag.`);
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleAddMultipleToBag = (products: any[]) => {
    setCart((prevCart) => {
      let newCart = [...prevCart];
      products.forEach((prod) => {
        const existing = newCart.find((item) => item.product.id === prod.id);
        if (existing) {
          newCart = newCart.map((item) =>
            item.product.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          newCart.push({ product: prod, quantity: 1 });
        }
      });
      return newCart;
    });
    showToast(`Added skin routine products to your bag!`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId: string, name: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    showToast(`Removed ${name} from your bag.`);
  };

  // Launch Paystack payment popup
  const handlePaystackCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail || !custPhone || !custAddress || !custCity) {
      showToast("Please fill in all delivery details.");
      return;
    }

    setPaying(true);

    try {
      const deliveryFee = subtotal >= freeShippingThreshold ? 0 : 7500;
      const totalNaira = subtotal + deliveryFee;

      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_df9800d984bc8502f1a602bd1a73eeec84ad1292",
        email: custEmail,
        amount: totalNaira * 100,
        currency: "NGN",
        callback: async (response: any) => {
          const orderRef = response.reference;
          setLastOrderRef(orderRef);
          try {
            const createdTime = new Date().toISOString();
            await addDoc(collection(db, "orders"), {
              name: custName,
              email: custEmail,
              phone: custPhone,
              address: custAddress,
              city: custCity,
              items: cart.map((item) => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
              })),
              subtotalUsd: subtotal,
              totalNaira: totalNaira,
              paystackReference: orderRef,
              status: "Pending Delivery",
              createdAt: createdTime,
            });
            
            setCompletedOrder({
              orderRef,
              items: [...cart],
              subtotal,
              totalNaira,
              createdAt: createdTime,
            });
            // Send order confirmation email (non-blocking)
            sendOrderConfirmationEmail({
              customerName: custName,
              customerEmail: custEmail,
              customerPhone: custPhone,
              customerAddress: custAddress,
              customerCity: custCity,
              orderRef,
              items: cart.map((item) => ({
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
              })),
              subtotal,
              totalNaira,
              createdAt: createdTime,
            });
            setCart([]);
            setCheckoutStep("success");
            showToast("Order placed! Confirmation email sent.");
          } catch (dbErr) {
            console.error("Firestore logging error: ", dbErr);
            showToast("Payment verified, failed to record order on server. Contact support.");
          } finally {
            setPaying(false);
          }
        },
        onClose: () => {
          setPaying(false);
          showToast("Payment cancellation received.");
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Paystack error: ", err);
      showToast("Could not trigger Paystack popups.");
      setPaying(false);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 75000;
  const needsMoreForFreeShipping = freeShippingThreshold - subtotal;
  const shippingPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0D1108] text-foreground transition-all">
      {/* Toast Notification */}
      <div
        className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[60] bg-foreground text-background dark:bg-background dark:text-foreground dark:border dark:border-border px-4 py-3 sm:px-5 sm:py-4 rounded-2xl shadow-2xl flex items-center space-x-3 transition-all duration-300 transform max-w-xs sm:max-w-none mx-auto sm:mx-0 ${
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"
        }`}
      >
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary flex-shrink-0" />
        <span className="text-xs font-semibold">{toast.message}</span>
      </div>

      {/* Floating WhatsApp Widget */}
      <a
        href="https://wa.me/2349044222531"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-40 bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center border-2 border-white dark:border-[#11100F] group"
        aria-label="Chat & Order on WhatsApp"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.115-2.886-6.981-1.862-1.865-4.34-2.89-6.984-2.891-5.439 0-9.865 4.421-9.869 9.867-.001 1.73.454 3.42 1.316 4.908l-.975 3.565 3.654-.958zm11.596-5.45c-.302-.151-1.787-.882-2.057-.98-.27-.099-.467-.147-.662.147-.196.294-.758.955-.93 1.151-.171.196-.341.221-.643.07-1.282-.641-2.115-1.09-2.946-2.515-.221-.379-.221-.652-.07-.803.136-.137.302-.351.453-.526.151-.176.201-.301.302-.503.101-.201.05-.378-.025-.526-.076-.151-.662-1.597-.907-2.186-.239-.575-.483-.497-.662-.506-.171-.008-.368-.01-.565-.01-.197 0-.517.074-.788.368-.27.294-1.031 1.008-1.031 2.459 0 1.451 1.054 2.854 1.202 3.051.147.196 2.074 3.167 5.024 4.444.702.304 1.25.486 1.677.622.705.224 1.347.193 1.854.117.565-.084 1.788-.731 2.04-1.438.252-.706.252-1.312.177-1.438-.076-.126-.271-.201-.573-.352z"/>
        </svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 ease-out whitespace-nowrap text-[10px] font-bold uppercase tracking-wider pl-0 group-hover:pl-2">
          Chat & Order
        </span>
      </a>

      {/* Navigation */}
      <Navbar
        cartCount={totalItems}
        onCartClick={() => setIsCartOpen(true)}
        onOpenRoutineFinder={() => setIsRoutineOpen(true)}
      />

      {/* ── STORE ELEGANT BANNER ── */}
      <div className="relative pt-28 pb-16 bg-gradient-to-r from-[#141d0c] to-[#0a1005] border-b border-primary/20 text-white overflow-hidden">
        {/* Abstract decorative leaf in background */}
        <Leaf className="absolute right-10 bottom-[-30px] w-64 h-64 text-[#7AC620]/5 pointer-events-none transform rotate-12" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left relative z-10">
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-primary mb-3">
            <Leaf className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#7AC620]">Aruk Skincare Boutique</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Our Complete Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#b4e878] font-light mt-3 max-w-2xl leading-relaxed">
            Browse our full catalog of 99.5% organic, pocket-friendly skin products. Specially formulated in micro-batches to nourish, restore healthy radiance, and repair mature skin. Handcrafted in Uyo, Nigeria.
          </p>
        </div>
      </div>

      {/* Products Grid Component */}
      <Products onAddToBag={handleAddToBag} />

      {/* Footer */}
      <Footer />

      {/* Customer Skincare AI Assistant */}
      <ChatBot />

      {/* Skincare Quiz Quiz Modal */}
      <RoutineFinder
        isOpen={isRoutineOpen}
        onClose={() => setIsRoutineOpen(false)}
        onAddMultipleToBag={handleAddMultipleToBag}
      />

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-background border-l border-border flex flex-col shadow-2xl animate-fade-in">
              
              {/* STEP 1: CART LIST VIEW */}
              {checkoutStep === "cart" && (
                <>
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                      <h3 className="font-serif text-lg font-bold text-foreground">Your Shopping Bag ({totalItems})</h3>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-accent/40 hover:bg-accent border border-border/80 p-2 rounded-full text-foreground/85 hover:text-foreground transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Free Shipping Meter */}
                  <div className="px-6 py-4 bg-accent/20 border-b border-border text-xs">
                    {subtotal >= freeShippingThreshold ? (
                      <p className="font-semibold text-primary">🎉 You qualify for Free Carbon-Neutral Shipping!</p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-muted font-light">
                          Add <strong className="font-semibold text-foreground">₦{needsMoreForFreeShipping.toLocaleString()}</strong> more for free shipping.
                        </p>
                        <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                          <div className="bg-primary h-full transition-all duration-500" style={{ width: `${shippingPercent}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Items list */}
                  <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-accent/40 flex items-center justify-center text-primary">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="font-serif text-base font-bold text-foreground">Your bag is empty</h4>
                          <p className="text-xs text-muted font-light mt-1 max-w-[200px] mx-auto">
                            Add some artisanal organic soaps or whipped body creams to start.
                          </p>
                        </div>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider hover:bg-primary/95 transition-all shadow-md shadow-primary/5 cursor-pointer"
                        >
                          Browse Collection
                        </button>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-4 p-4 border border-border/80 rounded-2xl bg-card"
                        >
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-accent/20 flex-shrink-0">
                            {item.product.image ? (
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary">🌱</div>
                            )}
                          </div>

                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs font-bold text-foreground leading-tight line-clamp-1">{item.product.name}</h4>
                              <button
                                onClick={() => handleRemoveFromCart(item.product.id, item.product.name)}
                                className="text-muted hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-[10px] text-muted block mt-0.5">{item.product.size}</span>
                            
                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center border border-border/80 rounded-full bg-background px-1.5 py-0.5">
                                <button
                                  onClick={() => handleUpdateQuantity(item.product.id, -1)}
                                  className="text-muted hover:text-foreground p-1 cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold text-foreground px-2.5 min-w-[20px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.product.id, 1)}
                                  className="text-muted hover:text-foreground p-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="text-xs font-bold text-foreground">
                                ₦{(item.product.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer calculations */}
                  {cart.length > 0 && (
                    <div className="p-6 border-t border-border bg-card space-y-4">
                      <div className="space-y-2.5 text-xs text-muted">
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>{subtotal >= freeShippingThreshold ? "FREE" : "₦7,500"}</span>
                        </div>
                        <div className="flex justify-between font-bold text-foreground text-sm pt-2.5 border-t border-border/40">
                          <span>Total Subtotal</span>
                          <span>₦{subtotal.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="pt-2 space-y-3">
                        <button
                          onClick={() => setCheckoutStep("shipping")}
                          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3.5 rounded-full shadow-lg shadow-primary/10 hover:bg-primary/95 text-xs uppercase tracking-wider cursor-pointer"
                        >
                          <CreditCard className="w-4 h-4" /> Proceed to Checkout
                        </button>
                        <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted">
                          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                          <span>SSL Secured E-Commerce Checkout</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: SHIPPING DETAILS FORM */}
              {checkoutStep === "shipping" && (
                <>
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <button
                      onClick={() => setCheckoutStep("cart")}
                      className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <h3 className="font-serif text-base font-bold text-foreground">Delivery Details</h3>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-accent/40 hover:bg-accent border border-border/80 p-2 rounded-full text-foreground/85 hover:text-foreground transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-grow overflow-y-auto p-6">
                    <form onSubmit={handlePaystackCheckout} id="shipping-form" className="space-y-4 text-xs text-foreground">
                      <div className="space-y-1.5">
                        <label className="font-semibold uppercase tracking-wider block text-[10px]">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sarah Umoh"
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold uppercase tracking-wider block text-[10px]">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. sarah@example.com"
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold uppercase tracking-wider block text-[10px]">Delivery Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +234 904 422 2531"
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold uppercase tracking-wider block text-[10px]">Delivery Street Address *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 12 Abak Road"
                          value={custAddress}
                          onChange={(e) => setCustAddress(e.target.value)}
                          className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-semibold uppercase tracking-wider block text-[10px]">City *</label>
                          <input
                            type="text"
                            required
                            placeholder="Uyo"
                            value={custCity}
                            onChange={(e) => setCustCity(e.target.value)}
                            className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-semibold uppercase tracking-wider block text-[10px]">Country</label>
                          <input
                            type="text"
                            disabled
                            value="Nigeria 🇳🇬"
                            className="w-full bg-accent/20 border border-border/80 rounded-xl px-4 py-3 text-xs text-muted cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="p-6 border-t border-border bg-card space-y-4">
                    <div className="space-y-2 text-xs text-muted">
                      <div className="flex justify-between">
                        <span>Products Subtotal</span>
                        <span>₦{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping Fee</span>
                        <span>{subtotal >= freeShippingThreshold ? "FREE" : "₦7,500"}</span>
                      </div>
                      <div className="flex justify-between font-bold text-foreground text-sm pt-2.5 border-t border-border/40">
                        <span>Naira Total</span>
                        <span className="text-primary font-bold">
                          ₦{(subtotal + (subtotal >= freeShippingThreshold ? 0 : 7500)).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-3">
                      <button
                        type="submit"
                        form="shipping-form"
                        disabled={paying}
                        className="w-full bg-[#25D366] hover:bg-[#1ebd53] text-white font-semibold py-3.5 rounded-full shadow-lg shadow-green-500/10 text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
                      >
                        {paying ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Starting Payment...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" /> Pay with Paystack
                          </>
                        )}
                      </button>
                      <div className="flex items-center justify-center gap-1.5 text-[9px] text-muted">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span>Paystack Checkout. Bank, Card & USSD accepted.</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* STEP 3: TRANSACTION SUCCESS RECEIPT */}
              {checkoutStep === "success" && completedOrder && (
                <OrderReceipt
                  orderRef={completedOrder.orderRef}
                  customerName={custName}
                  customerEmail={custEmail}
                  customerPhone={custPhone}
                  customerAddress={completedOrder.items.length > 0 ? custAddress : ""}
                  customerCity={custCity}
                  items={completedOrder.items.map((item) => ({
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                  }))}
                  subtotalUsd={completedOrder.subtotal}
                  totalNaira={completedOrder.totalNaira}
                  createdAt={completedOrder.createdAt}
                  onClose={() => {
                    setIsCartOpen(false);
                    setCheckoutStep("cart");
                    setCompletedOrder(null);
                  }}
                />
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

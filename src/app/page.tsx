"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products, { Product } from "./components/Products";
import Ingredients from "./components/Ingredients";
import RoutineFinder from "./components/RoutineFinder";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck, CreditCard } from "lucide-react";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRoutineOpen, setIsRoutineOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });

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

  // Calculations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 50;
  const needsMoreForFreeShipping = freeShippingThreshold - subtotal;
  const shippingPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <div className="relative min-h-screen">
      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 bg-foreground text-background dark:bg-background dark:text-foreground dark:border dark:border-border px-5 py-4 rounded-2xl shadow-2xl flex items-center space-x-3.5 transition-all duration-300 transform ${
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        <span className="text-xs font-semibold">{toast.message}</span>
      </div>

      {/* Main Pages */}
      <Navbar
        cartCount={totalItems}
        onCartClick={() => setIsCartOpen(true)}
        onOpenRoutineFinder={() => setIsRoutineOpen(true)}
      />

      <Hero onOpenRoutineFinder={() => setIsRoutineOpen(true)} />

      <Products onAddToBag={handleAddToBag} />

      <Ingredients />

      <Testimonials />

      <Footer />

      {/* Skincare Quiz Modal */}
      <RoutineFinder
        isOpen={isRoutineOpen}
        onClose={() => setIsRoutineOpen(false)}
        onAddMultipleToBag={handleAddMultipleToBag}
      />

      {/* Shopping Cart Slider Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-background border-l border-border flex flex-col shadow-2xl animate-fade-in">
              {/* Header */}
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
                      Add <strong className="font-semibold text-foreground">${needsMoreForFreeShipping.toFixed(2)}</strong> more for free shipping.
                    </p>
                    <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-500" style={{ width: `${shippingPercent}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-accent/40 flex items-center justify-center text-primary">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-foreground">Your bag is empty</h4>
                      <p className="text-xs text-muted font-light mt-1 max-w-[200px] mx-auto">
                        Add some artisanal organic bar soaps or nourishing body creams to start.
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
                      {/* Product Image preview */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-accent/20 flex-shrink-0">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-accent/30 to-accent/40 flex items-center justify-center text-primary/30 font-bold">
                            🌱
                          </div>
                        )}
                      </div>

                      {/* Info & Quantity controls */}
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
                          {/* Quantity selectors */}
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
                          
                          {/* Price */}
                          <span className="text-xs font-bold text-foreground">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Foot */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-border bg-card space-y-4">
                  <div className="space-y-2.5 text-xs text-muted">
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{subtotal >= freeShippingThreshold ? "FREE" : "$4.99"}</span>
                    </div>
                    <div className="flex justify-between font-bold text-foreground text-sm pt-2.5 border-t border-border/40">
                      <span>Total Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <button
                      onClick={() => alert(`This is a demo checkout. Order subtotal: $${subtotal.toFixed(2)}`)}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3.5 rounded-full shadow-lg shadow-primary/10 hover:bg-primary/95 text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" /> Proceed to Checkout
                    </button>
                    
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      <span>SSL Encrypted Checkout. Carbon Neutral Shipping.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

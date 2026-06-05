"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search, Sparkles, Store } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onOpenRoutineFinder: () => void;
}

export default function Navbar({ cartCount, onCartClick, onOpenRoutineFinder }: NavbarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/40 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="flex items-center gap-2">
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border border-border/80 dark:border-primary/30 shadow-sm transition-transform duration-300 hover:scale-105">
                <Image
                  src="/aruk_logo_4k.png"
                  alt="Aruk Logo"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/store" className={`text-sm font-bold tracking-wide transition-colors ${pathname === "/store" ? "text-primary" : "text-foreground/80 hover:text-primary"}`}>
              Shop Store 🌿
            </a>
            <a href={isHome ? "#products" : "/#products"} className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors">
              Our Products
            </a>
            <a href={isHome ? "#ingredients" : "/#ingredients"} className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors">
              Organic Ingredients
            </a>
            <a href={isHome ? "#about" : "/#about"} className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors">
              Our Story
            </a>
            <a href={isHome ? "#testimonials" : "/#testimonials"} className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors">
              Reviews
            </a>
            <button
              onClick={onOpenRoutineFinder}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full transition-all border border-primary/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Skin Routine Finder
            </button>
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-foreground/70 hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={onCartClick} className="relative text-foreground/75 hover:text-primary transition-colors p-1.5">
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-background">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu & Cart Controls */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={onCartClick} className="relative text-foreground/75 p-1.5">
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-background">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground/80 hover:text-primary focus:outline-none p-1.5"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden absolute w-full bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-3">
          <a
            href="/store"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2.5 rounded-md text-base font-bold transition-all ${
              pathname === "/store" ? "bg-primary/10 text-primary" : "hover:bg-primary/5 text-foreground"
            }`}
          >
            Shop Store 🌿
          </a>
          <a
            href={isHome ? "#products" : "/#products"}
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-md text-base font-medium hover:bg-primary/5 hover:text-primary transition-all text-foreground"
          >
            Our Products
          </a>
          <a
            href={isHome ? "#ingredients" : "/#ingredients"}
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-md text-base font-medium hover:bg-primary/5 hover:text-primary transition-all text-foreground"
          >
            Organic Ingredients
          </a>
          <a
            href={isHome ? "#about" : "/#about"}
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-md text-base font-medium hover:bg-primary/5 hover:text-primary transition-all text-foreground"
          >
            Our Story
          </a>
          <a
            href={isHome ? "#testimonials" : "/#testimonials"}
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-md text-base font-medium hover:bg-primary/5 hover:text-primary transition-all text-foreground"
          >
            Reviews
          </a>
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenRoutineFinder();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-full text-sm font-semibold uppercase tracking-wider bg-primary text-white hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
          >
            <Sparkles className="w-4 h-4" />
            Skin Routine Finder
          </button>
        </div>
      </div>
    </nav>
  );
}

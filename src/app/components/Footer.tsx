"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, ArrowRight, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer id="about" className="bg-background border-t border-border pt-16 pb-8 text-foreground/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Newsletter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-border/60 items-center">
          <div className="lg:col-span-6 space-y-2">
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">Join the Aruk Circle</h3>
            <p className="text-xs text-muted font-light leading-relaxed max-w-md">
              Subscribe to receive early notifications of fresh soap curing batches, skin wellness tips, and exclusive access to new product formulations.
            </p>
          </div>
          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="bg-primary/10 border border-primary/20 text-primary px-5 py-3.5 rounded-full flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider animate-pulse">
                <Sparkles className="w-4 h-4" /> Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-card border border-border/80 px-5 py-3.5 rounded-full text-xs focus:outline-none focus:border-primary/60"
                  />
                  <Mail className="absolute right-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider hover:bg-primary/95 transition-all shadow-md shadow-primary/5 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Subscribe <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-12 text-xs">
          
          {/* Brand Info Column */}
          <div className="space-y-4">
            <div className="relative w-[110px] h-[45px]">
              <Image
                src="/aruk_logo.png"
                alt="Aruk Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="text-muted leading-relaxed font-light">
              Crafting pure, organic soaps, whipped body creams, and luxury botanical oils designed to replenish, calm, and revitalize. Pure skincare, small batches.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full border border-border/80 flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-border/80 flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Navigation */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-foreground">Explore Shop</h4>
            <ul className="space-y-2 font-light text-muted">
              <li><a href="#products" className="hover:text-primary transition-colors">Artisanal Bar Soaps</a></li>
              <li><a href="#products" className="hover:text-primary transition-colors">Whipped Creams & Gels</a></li>
              <li><a href="#products" className="hover:text-primary transition-colors">Treatment Oils & Serums</a></li>
              <li><a href="#products" className="hover:text-primary transition-colors">Signature Gift Bundles</a></li>
            </ul>
          </div>

          {/* Philosophy Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-foreground">Our Philosophy</h4>
            <ul className="space-y-2 font-light text-muted">
              <li><a href="#ingredients" className="hover:text-primary transition-colors">Active Ingredients Dictionary</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">The Saponification Process</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">Sustainably Wildcrafted Sourcing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Environment and Green Shipping</a></li>
            </ul>
          </div>

          {/* Contact and Support */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-foreground">Customer Support</h4>
            <ul className="space-y-2 font-light text-muted">
              <li><span>Email: hello@arukbotanicals.com</span></li>
              <li><span>Phone: +1 (800) 555-ARUK</span></li>
              <li><span>Hours: Mon - Fri, 9am - 5pm EST</span></li>
              <li><a href="#" className="hover:text-primary transition-colors underline">FAQs & Returns Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Lower Copyright Section */}
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-muted font-light gap-4">
          <div className="flex items-center space-x-1.5">
            <span>© {new Date().getFullYear()} Aruk Botanicals. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-secondary fill-secondary" />
            <span>for natural skin health.</span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

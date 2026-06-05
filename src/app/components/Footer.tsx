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
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border/80 dark:border-primary/20 shadow-sm">
              <Image
                src="/aruk_logo_4k.png"
                alt="Aruk Logo"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <p className="text-muted leading-relaxed font-light">
              ArukBeautyLine is a one-stop shop for all your body care (head to toe) products. We formulate and produce products that are safe, pocket-friendly, 99.5% organic and of premium quality.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="https://www.instagram.com/arukbeautyline/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-border/80 flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=100069622313936" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-border/80 flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://wa.me/2349044222531" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-border/80 flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.115-2.886-6.981-1.862-1.865-4.34-2.89-6.984-2.891-5.439 0-9.865 4.421-9.869 9.867-.001 1.73.454 3.42 1.316 4.908l-.975 3.565 3.654-.958zm11.596-5.45c-.302-.151-1.787-.882-2.057-.98-.27-.099-.467-.147-.662.147-.196.294-.758.955-.93 1.151-.171.196-.341.221-.643.07-1.282-.641-2.115-1.09-2.946-2.515-.221-.379-.221-.652-.07-.803.136-.137.302-.351.453-.526.151-.176.201-.301.302-.503.101-.201.05-.378-.025-.526-.076-.151-.662-1.597-.907-2.186-.239-.575-.483-.497-.662-.506-.171-.008-.368-.01-.565-.01-.197 0-.517.074-.788.368-.27.294-1.031 1.008-1.031 2.459 0 1.451 1.054 2.854 1.202 3.051.147.196 2.074 3.167 5.024 4.444.702.304 1.25.486 1.677.622.705.224 1.347.193 1.854.117.565-.084 1.788-.731 2.04-1.438.252-.706.252-1.312.177-1.438-.076-.126-.271-.201-.573-.352z"/>
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
              <li><a href="#about" className="hover:text-primary transition-colors">Formulation Standards</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">Sustainably Organic Sourcing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Green & Safe Deliveries</a></li>
            </ul>
          </div>

          {/* Contact and Support */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-foreground">Location & Orders</h4>
            <ul className="space-y-2 font-light text-muted">
              <li><span>Production: Uyo, Akwa Ibom State, NG 📍</span></li>
              <li><span>WhatsApp: +234 904 422 2531</span></li>
              <li><a href="https://wa.me/2349044222531" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline font-medium">Chat to Order</a></li>
              <li><span>Email: hello@arukbeautyline.com</span></li>
            </ul>
          </div>

        </div>

        {/* Lower Copyright Section */}
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-muted font-light gap-4">
          <div className="flex items-center space-x-1.5">
            <span>© {new Date().getFullYear()} Aruk Beauty Line. All rights reserved.</span>
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

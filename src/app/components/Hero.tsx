import Image from "next/image";
import { ArrowRight, Leaf, Sparkles, Award } from "lucide-react";

interface HeroProps {
  onOpenRoutineFinder: () => void;
}

export default function Hero({ onOpenRoutineFinder }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2] to-[#F5EFE6] dark:from-[#11100F] dark:via-[#11100F] dark:to-[#1A1816]">
      {/* Subtle organic light accent blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Left Column */}
          <div className="lg:col-span-7 flex flex-col space-y-6 sm:space-y-8 text-center lg:text-left animate-fade-in">
            {/* Tag / Badge */}
            <div className="flex items-center justify-center lg:justify-start space-x-2">
              <span className="flex items-center gap-1 bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-widest">
                <Leaf className="w-3.5 h-3.5" /> Handcrafted Botanical Skincare
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground font-semibold leading-[1.15] tracking-tight">
              Pure. Organic.<br />
              <span className="text-primary italic font-normal">Radiant Skin</span> By Nature.
            </h1>

            {/* Paragraph */}
            <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Elevate your self-care ritual with <strong className="font-semibold text-foreground/90">Aruk</strong>. 
              Our small-batch artisanal soaps and luxury hydrating creams are meticulously formulated from cold-pressed seed oils, pure essential extracts, and nourishing minerals. Zero synthetics, just skin-loving purity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#products"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold tracking-wide text-sm px-8 py-4 rounded-full shadow-lg shadow-primary/15 hover:shadow-primary/25"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={onOpenRoutineFinder}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-border bg-card hover:bg-accent/40 text-foreground transition-all font-semibold tracking-wide text-sm px-8 py-4 rounded-full"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                Find Your Perfect Routine
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-border grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-1">
                <div className="flex items-center space-x-1.5 text-primary">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Artisanal</span>
                </div>
                <span className="text-[11px] text-muted">100% Handcrafted</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-1">
                <div className="flex items-center space-x-1.5 text-primary">
                  <Leaf className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Vegan & Clean</span>
                </div>
                <span className="text-[11px] text-muted">Cruelty-free formulas</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-1">
                <div className="flex items-center space-x-1.5 text-primary">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Pure Ingredients</span>
                </div>
                <span className="text-[11px] text-muted">No toxins or parabens</span>
              </div>
            </div>
          </div>

          {/* Image Right Column */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center animate-fade-in" style={{ animationDelay: "200ms" }}>
            
            {/* Main Image Framed */}
            <div className="relative w-full max-w-[380px] sm:max-w-[450px] aspect-[4/5] rounded-[2rem] overflow-hidden border-[10px] border-card shadow-2xl shadow-stone-800/10">
              <Image
                src="/spa_facial.png"
                alt="Aruk Skincare Treatment Experience"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              {/* Dark overlay gradients for premium look */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Small Overlay Gold Card */}
            <div className="absolute -bottom-6 -left-4 sm:left-4 bg-background/90 backdrop-blur-md border border-border px-5 py-4 rounded-2xl shadow-xl flex items-center space-x-3.5 max-w-[220px]">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <Leaf className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Cold-Pressed</h4>
                <p className="text-[10px] text-muted leading-tight mt-0.5">Retaining maximum nutrients for skin.</p>
              </div>
            </div>

            {/* Small Floating Round Badge */}
            <div className="absolute -top-4 -right-4 sm:-right-2 bg-primary text-primary-foreground w-18 h-18 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-background animate-pulse text-center p-1">
              <span className="text-[10px] font-bold uppercase tracking-wider leading-none">Fresh</span>
              <span className="text-[11px] font-extrabold uppercase mt-0.5 leading-none">Batch</span>
              <span className="text-[8px] font-medium opacity-85 mt-0.5">Strictly Limited</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

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
              <span className="flex items-center gap-1 bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
                <Leaf className="w-3.5 h-3.5" /> 99.5% Organic Body & Face Care
              </span>
              <span className="bg-secondary/10 text-secondary border border-secondary/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                📍 Uyo, NG
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground font-semibold leading-[1.15] tracking-tight">
              Restore Your Natural<br />
              <span className="text-primary italic font-normal">Radiance After 40</span>.
            </h1>

            {/* Paragraph */}
            <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Safe, effective organic products formulated by <strong className="font-semibold text-foreground/90">Aruk Beauty Line</strong> to repair damaged skin, fade blemishes, and restore youthful elasticity. Premium quality body care from head to toe—crafted to be exceptionally pocket-friendly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#products"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold tracking-wide text-sm px-8 py-4 rounded-full shadow-lg shadow-primary/15 hover:shadow-primary/25"
              >
                Shop Our Collection
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/2349044222531"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] dark:text-[#4ade80] transition-all font-semibold tracking-wide text-sm px-8 py-4 rounded-full"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.115-2.886-6.981-1.862-1.865-4.34-2.89-6.984-2.891-5.439 0-9.865 4.421-9.869 9.867-.001 1.73.454 3.42 1.316 4.908l-.975 3.565 3.654-.958zm11.596-5.45c-.302-.151-1.787-.882-2.057-.98-.27-.099-.467-.147-.662.147-.196.294-.758.955-.93 1.151-.171.196-.341.221-.643.07-1.282-.641-2.115-1.09-2.946-2.515-.221-.379-.221-.652-.07-.803.136-.137.302-.351.453-.526.151-.176.201-.301.302-.503.101-.201.05-.378-.025-.526-.076-.151-.662-1.597-.907-2.186-.239-.575-.483-.497-.662-.506-.171-.008-.368-.01-.565-.01-.197 0-.517.074-.788.368-.27.294-1.031 1.008-1.031 2.459 0 1.451 1.054 2.854 1.202 3.051.147.196 2.074 3.167 5.024 4.444.702.304 1.25.486 1.677.622.705.224 1.347.193 1.854.117.565-.084 1.788-.731 2.04-1.438.252-.706.252-1.312.177-1.438-.076-.126-.271-.201-.573-.352z"/>
                </svg>
                Order via WhatsApp
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-border grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-1">
                <div className="flex items-center space-x-1.5 text-primary">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">99.5% Organic</span>
                </div>
                <span className="text-[11px] text-muted">Premium Ingredients</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-1">
                <div className="flex items-center space-x-1.5 text-primary">
                  <Leaf className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Skin Repair</span>
                </div>
                <span className="text-[11px] text-muted">Restoring Radiance over 40</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-1">
                <div className="flex items-center space-x-1.5 text-primary">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Pocket Friendly</span>
                </div>
                <span className="text-[11px] text-muted">Affordable Luxury Skincare</span>
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

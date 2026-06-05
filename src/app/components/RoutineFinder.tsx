"use client";

import { useState } from "react";
import { X, Sparkles, Check, ChevronRight, ShoppingBag, Award } from "lucide-react";
import { Product } from "./Products";

interface RoutineFinderProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMultipleToBag: (products: any[]) => void;
}

// Minimal stub matching Products.tsx definitions to add to bag
const QUIZ_PRODUCTS = {
  lavenderSoap: {
    id: "p1",
    name: "Lavender Oats Calm Soap",
    category: "soap",
    categoryLabel: "Artisanal Bar Soap",
    price: 14,
    size: "150g / 5.3 oz",
    image: "/spa_facial.png"
  },
  honeySoap: {
    id: "p2",
    name: "Honey Amber Glow Soap",
    category: "soap",
    categoryLabel: "Artisanal Bar Soap",
    price: 14,
    size: "150g / 5.3 oz",
    image: "/aruk.jpg"
  },
  sheaCream: {
    id: "p3",
    name: "Shea Butter Deep Hydration Cream",
    category: "cream",
    categoryLabel: "Nourishing Cream",
    price: 28,
    size: "200ml / 6.8 fl oz",
    image: "/spa_facial.png"
  },
  roseGel: {
    id: "p4",
    name: "Rosewater Radiance Face Gel",
    category: "cream",
    categoryLabel: "Facial Cream & Gel",
    price: 32,
    size: "50ml / 1.7 fl oz",
    image: "/spa_facial.png"
  },
  charcoalSoap: {
    id: "p5",
    name: "Activated Charcoal Mint Detox Soap",
    category: "soap",
    categoryLabel: "Artisanal Bar Soap",
    price: 15,
    size: "150g / 5.3 oz",
    image: "/aruk.jpg"
  },
  elixirOil: {
    id: "p6",
    name: "Botanical Glow Facial Elixir",
    category: "oil",
    categoryLabel: "Treatment Oil",
    price: 38,
    size: "30ml / 1.0 fl oz"
  }
};

export default function RoutineFinder({ isOpen, onClose, onAddMultipleToBag }: RoutineFinderProps) {
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState("");
  const [goal, setGoal] = useState("");
  const [preference, setPreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleNextStep = (selection: string) => {
    if (step === 1) {
      setSkinType(selection);
      setStep(2);
    } else if (step === 2) {
      setGoal(selection);
      setStep(3);
    } else if (step === 3) {
      setPreference(selection);
      calculateRoutine(skinType, goal, selection);
    }
  };

  const calculateRoutine = (type: string, skincareGoal: string, pref: string) => {
    setLoading(true);
    setTimeout(() => {
      let recommendedProducts: any[] = [];
      let routineTitle = "";
      let routineDesc = "";

      // Logic matching choices
      if (type === "dry" || skincareGoal === "hydrate") {
        recommendedProducts = [QUIZ_PRODUCTS.lavenderSoap, QUIZ_PRODUCTS.sheaCream];
        routineTitle = "Deep Moisture Restoration Ritual";
        routineDesc = "Ideal for thirsty, flaking, or dry skin. Our Lavender Oats soap calms and preps the skin barrier while the Whipped Shea Butter Cream infuses long-lasting hydration.";
      } else if (type === "oily" || skincareGoal === "clear") {
        recommendedProducts = [QUIZ_PRODUCTS.charcoalSoap, QUIZ_PRODUCTS.roseGel];
        routineTitle = "Clarifying Charcoal & Rose Balance";
        routineDesc = "Formulated to control excess sebum and clarify pores. The Activated Charcoal bar extracts pollutants and oils, and the cooling Rosewater Face Gel hydrates without clog risks.";
      } else if (type === "sensitive" || skincareGoal === "calm") {
        recommendedProducts = [QUIZ_PRODUCTS.lavenderSoap, QUIZ_PRODUCTS.roseGel];
        routineTitle = "Soothing Rose & Lavender Sanctuary";
        routineDesc = "Meticulously designed for reactive, red, or easily irritated skin. Combines the mild soothing power of colloidal oatmeal and Bulgarian rosewater.";
      } else {
        recommendedProducts = [QUIZ_PRODUCTS.honeySoap, QUIZ_PRODUCTS.elixirOil];
        routineTitle = "Golden Radiance Revitalizing System";
        routineDesc = "Our ultimate nourishment package. Wild honey soap brightens the complexion while the cold-pressed face oil delivers essential vitamins for a signature healthy skin glow.";
      }

      setResult({
        title: routineTitle,
        description: routineDesc,
        products: recommendedProducts,
        code: "ARUKNATURAL"
      });
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  const handleReset = () => {
    setStep(1);
    setSkinType("");
    setGoal("");
    setPreference("");
    setResult(null);
  };

  const handleAddAllToCart = () => {
    if (result) {
      onAddMultipleToBag(result.products);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-fade-in">
      <div className="bg-background border border-border max-w-lg w-full rounded-[2.5rem] overflow-hidden shadow-2xl relative p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 bg-accent/40 hover:bg-accent border border-border/80 p-2 rounded-full text-foreground/80 hover:text-foreground transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header indicator */}
        {step < 4 && (
          <div className="flex items-center space-x-1.5 text-primary mb-3">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Routine Finder (Step {step}/3)</span>
          </div>
        )}

        {/* STEP 1: Skin Type */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-foreground">What is your primary skin type?</h3>
              <p className="text-muted text-xs font-light mt-1.5">This helps us select bases that won&apos;t strip or clog your pores.</p>
            </div>
            <div className="grid grid-cols-1 gap-3.5 pt-2">
              <button
                onClick={() => handleNextStep("dry")}
                className="flex items-center justify-between p-5 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-accent/40 text-left transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Dry / Sensitive</h4>
                  <p className="text-[11px] text-muted font-light mt-0.5">Feels tight, shows dry patches, reactive.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </button>

              <button
                onClick={() => handleNextStep("oily")}
                className="flex items-center justify-between p-5 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-accent/40 text-left transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Oily / Acne-Prone</h4>
                  <p className="text-[11px] text-muted font-light mt-0.5">Visible shine, large pores, prone to blemishes.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </button>

              <button
                onClick={() => handleNextStep("sensitive")}
                className="flex items-center justify-between p-5 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-accent/40 text-left transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Redness / Reactive</h4>
                  <p className="text-[11px] text-muted font-light mt-0.5">Easily irritated by products, redness prone.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </button>

              <button
                onClick={() => handleNextStep("normal")}
                className="flex items-center justify-between p-5 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-accent/40 text-left transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Normal / Balanced</h4>
                  <p className="text-[11px] text-muted font-light mt-0.5">Even texture, occasional minor dry/oily areas.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Goal */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-foreground">What is your primary skincare goal?</h3>
              <p className="text-muted text-xs font-light mt-1.5">What change would you most like to see in your skin?</p>
            </div>
            <div className="grid grid-cols-1 gap-3.5 pt-2">
              <button
                onClick={() => handleNextStep("hydrate")}
                className="flex items-center justify-between p-5 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-accent/40 text-left transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Deep Hydration & Plumping</h4>
                  <p className="text-[11px] text-muted font-light mt-0.5">Restore deep moisture reserves and eliminate tight lines.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </button>

              <button
                onClick={() => handleNextStep("clear")}
                className="flex items-center justify-between p-5 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-accent/40 text-left transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Clear Complexion & Detoxify</h4>
                  <p className="text-[11px] text-muted font-light mt-0.5">Extract excess sebum, minimize pores, and calm acne breakouts.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </button>

              <button
                onClick={() => handleNextStep("calm")}
                className="flex items-center justify-between p-5 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-accent/40 text-left transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Soften Redness & Irritation</h4>
                  <p className="text-[11px] text-muted font-light mt-0.5">Rebuild damaged barriers and calm environmental flare-ups.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </button>

              <button
                onClick={() => handleNextStep("radiance")}
                className="flex items-center justify-between p-5 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-accent/40 text-left transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Healthy Golden Radiance</h4>
                  <p className="text-[11px] text-muted font-light mt-0.5">Exfoliate dead layers to reveal a natural, bright skin tone.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </button>
            </div>
            <button onClick={() => setStep(1)} className="text-xs text-muted hover:text-foreground transition-colors underline pt-2">
              Back to Skin Type
            </button>
          </div>
        )}

        {/* STEP 3: Preference */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-foreground">Which texture do you prefer?</h3>
              <p className="text-muted text-xs font-light mt-1.5">Choose the type of skincare product you enjoy using daily.</p>
            </div>
            <div className="grid grid-cols-1 gap-3.5 pt-2">
              <button
                onClick={() => handleNextStep("bars")}
                className="flex items-center justify-between p-5 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-accent/40 text-left transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Artisanal Bar Soaps</h4>
                  <p className="text-[11px] text-muted font-light mt-0.5">You love clean rinses, botanical aromas, and creamy soap lathers.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </button>

              <button
                onClick={() => handleNextStep("creams")}
                className="flex items-center justify-between p-5 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-accent/40 text-left transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Whipped Body Creams & Gels</h4>
                  <p className="text-[11px] text-muted font-light mt-0.5">You prefer velvety whipped layers, oils, or nourishing face moisturizers.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </button>

              <button
                onClick={() => handleNextStep("both")}
                className="flex items-center justify-between p-5 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-accent/40 text-left transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Both (The Complete Routine)</h4>
                  <p className="text-[11px] text-muted font-light mt-0.5">Cleanse with organic soaps, lock in nutrients with creams.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </button>
            </div>
            <button onClick={() => setStep(2)} className="text-xs text-muted hover:text-foreground transition-colors underline pt-2">
              Back to Goals
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <h3 className="font-serif text-lg font-bold text-foreground">Analyzing Your Skin Profile...</h3>
            <p className="text-xs text-muted font-light">Customizing your Aruk herbal routine.</p>
          </div>
        )}

        {/* STEP 4: Results */}
        {step === 4 && result && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-3">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">Your Skincare Prescription</h3>
              <h4 className="text-primary text-xs font-bold uppercase tracking-wider mt-1">{result.title}</h4>
            </div>

            <p className="text-xs text-muted leading-relaxed font-light text-center px-2">
              {result.description}
            </p>

            {/* Recommended Products Showcase */}
            <div className="space-y-3 pt-2">
              {result.products.map((prod: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-card border border-border/80 rounded-2xl">
                  <div className="flex items-center space-x-3.5">
                    <span className="w-8 h-8 rounded-lg bg-accent/40 flex items-center justify-center text-sm font-semibold text-primary">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-foreground">{prod.name}</h5>
                      <span className="text-[10px] text-muted">{prod.categoryLabel} ({prod.size})</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-foreground">${prod.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-foreground">10% Bundle Discount Applied!</p>
                <p className="text-[10px] text-muted mt-0.5">Use at checkout to redeem savings.</p>
              </div>
              <span className="bg-primary text-primary-foreground font-bold px-3 py-1.5 rounded-lg tracking-widest uppercase">
                {result.code}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleAddAllToCart}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3.5 rounded-full shadow-lg shadow-primary/15 hover:bg-primary/95 text-xs uppercase tracking-wider cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" /> Add Routine to Bag
              </button>
              
              <div className="flex justify-between items-center text-xs">
                <button onClick={handleReset} className="text-muted hover:text-foreground transition-colors underline">
                  Retake Quiz
                </button>
                <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
                  Browse Store
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

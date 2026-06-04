import { Sparkles, ShieldCheck, Heart, Leaf } from "lucide-react";

interface Ingredient {
  emoji: string;
  name: string;
  benefits: string;
  description: string;
}

const INGREDIENTS_LIST: Ingredient[] = [
  {
    emoji: "🌰",
    name: "Raw Organic Shea Butter",
    benefits: "Deep Moisture & Skin Elasticity",
    description: "Cold-pressed from the nut of the African Shea tree, it contains high concentrations of fatty acids and vitamins to soften skin and reduce inflammation."
  },
  {
    emoji: "🌾",
    name: "Colloidal Oatmeal",
    benefits: "Soothes Dryness & Calms Eczema",
    description: "Finely ground oats lock in moisture and create a protective barrier. Renowned for calming redness, itchiness, and sensitive skin concerns."
  },
  {
    emoji: "🍯",
    name: "Raw Wildflower Honey",
    benefits: "Natural Humectant & Antibacterial",
    description: "A natural skin healer that attracts and retains moisture. Packed with antioxidants, honey helps clarify pores and gives skin a soft radiance."
  },
  {
    emoji: "🌸",
    name: "Lavender Essential Oil",
    benefits: "Calming Aromatherapy & Skin Healing",
    description: "Steam-distilled from fresh lavender blossoms. Beyond its soothing floral aroma, it has natural antiseptic and anti-inflammatory properties."
  },
  {
    emoji: "🥥",
    name: "Cold-Pressed Coconut Oil",
    benefits: "Rich Lather & Lauric Acid",
    description: "Provides a deeply cleansing lather in our soaps while delivering essential moisture and fatty acids that nourish the skin barrier."
  },
  {
    emoji: "🪴",
    name: "French Pink Clay",
    benefits: "Gentle Detox & Pore Refining",
    description: "The mildest of all clays, it gently draws out impurities, removes dead skin cells, and cleanses pores without stripping your skin's natural oils."
  }
];

export default function Ingredients() {
  return (
    <section id="ingredients" className="py-20 bg-background relative overflow-hidden">
      {/* Light accent circles */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-1.5 text-primary mb-2.5">
            <Sparkles className="w-4.5 h-4.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Our Philosophy</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
            100% Active. Zero Fillers.
          </h2>
          <p className="text-muted mt-4 text-sm sm:text-base font-light">
            We source only the finest food-grade oils, raw butter, and steam-distilled botanicals. Every ingredient is chosen for its specific nourishing properties.
          </p>
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INGREDIENTS_LIST.map((ing, i) => (
            <div
              key={i}
              className="bg-card border border-border/70 rounded-3xl p-8 hover:shadow-lg hover:shadow-stone-900/5 transition-all duration-300 hover:border-primary/30 flex flex-col justify-between"
            >
              <div>
                {/* Emoji / Icon frame */}
                <div className="w-14 h-14 rounded-2xl bg-accent/30 flex items-center justify-center text-2xl mb-6 shadow-inner">
                  {ing.emoji}
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-1.5">
                  {ing.name}
                </h3>
                <span className="text-[11px] font-bold text-primary tracking-wide uppercase block mb-4">
                  {ing.benefits}
                </span>
                <p className="text-xs text-muted leading-relaxed font-light">
                  {ing.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ingredient Commitments */}
        <div className="mt-16 pt-12 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4">
            <div className="p-2.5 rounded-full bg-primary/10 text-primary flex-shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Sustainably Sourced</h4>
              <p className="text-xs text-muted font-light leading-relaxed mt-1">
                We partner with local organic farms and fair-trade cooperatives to source raw butters and essential oils.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-2.5 rounded-full bg-primary/10 text-primary flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Zero Toxic Chemicals</h4>
              <p className="text-xs text-muted font-light leading-relaxed mt-1">
                Completely free of artificial colorants, synthetic fragrance oils, parabens, phthalates, and SLS.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-2.5 rounded-full bg-primary/10 text-primary flex-shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Fresh Small Batches</h4>
              <p className="text-xs text-muted font-light leading-relaxed mt-1">
                Our soaps cure for 6 weeks, and our creams are whipped weekly to ensure the botanical vitamins remain active.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

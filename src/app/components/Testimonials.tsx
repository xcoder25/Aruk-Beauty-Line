import { Star, Quote, ShieldCheck } from "lucide-react";

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  product: string;
  comment: string;
  date: string;
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    name: "Sarah O.",
    location: "Lagos, NG",
    rating: 5,
    product: "Shea Butter Deep Hydration Cream",
    comment: "At 46, finding creams that actually restore skin elasticity without feeling heavy was a real struggle. Aruk's whipped cream has repaired my dry skin barrier completely! My face looks and feels radiant.",
    date: "2 weeks ago"
  },
  {
    name: "Mfon U.",
    location: "Uyo, NG",
    rating: 5,
    product: "Lavender Oats Calm Soap",
    comment: "I had damaged my skin barrier with harsh chemicals. Switching to the Lavender Oats Calm Soap healed my reactive skin within 3 weeks. The oatmeal feels so calming and soft on the face.",
    date: "1 month ago"
  },
  {
    name: "Chioma A.",
    location: "Abuja, NG",
    rating: 5,
    product: "Botanical Glow Facial Elixir",
    comment: "This facial oil is a miracle worker for mature skin! At 52, my skin is glowing, and dark spots around my cheeks have visibly faded. My friends are asking for my skincare secrets!",
    date: "3 weeks ago"
  },
  {
    name: "Blessing E.",
    location: "Uyo, NG",
    rating: 5,
    product: "Honey Amber Glow Soap",
    comment: "The Honey Amber Glow Soap smells amazing. It has evened out my skin tone and leaves a rich, moisturizing lather. It is exceptionally pocket-friendly and handcrafted right here in Uyo!",
    date: "2 months ago"
  },
  {
    name: "Funmi K.",
    location: "Port Harcourt, NG",
    rating: 4.8,
    product: "Activated Charcoal Mint Detox Soap",
    comment: "The 99.5% organic ingredients are excellent for skin health. It draws out impurities without that dry, tight feel. My skin feels fresh, healthy, and hydrated all day.",
    date: "3 days ago"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-card/30 dark:bg-[#1A1816]/30 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-1.5 text-primary mb-2.5">
            <Quote className="w-4.5 h-4.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Testimonials</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
            Loved By Skin Lovers
          </h2>
          <p className="text-muted mt-4 text-sm sm:text-base font-light">
            Read stories of skin transformations and daily self-care rituals from verified Aruk customers.
          </p>
        </div>

        {/* Testimonials Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {TESTIMONIALS_DATA.map((t, idx) => (
            <div
              key={idx}
              className="break-inside-avoid bg-card border border-border/70 p-6 sm:p-8 rounded-3xl hover:shadow-lg hover:shadow-stone-900/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating */}
                <div className="flex justify-between items-center mb-5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(t.rating) ? "fill-current" : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted">{t.date}</span>
                </div>

                {/* Comment */}
                <p className="text-xs text-foreground/90 font-light leading-relaxed mb-6 italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="flex justify-between items-end pt-4 border-t border-border/40">
                <div>
                  <h4 className="text-xs font-bold text-foreground">{t.name}</h4>
                  <span className="text-[10px] text-muted">{t.location}</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-accent/40 text-[10px] text-foreground font-semibold px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  <span>Verified Purchase</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

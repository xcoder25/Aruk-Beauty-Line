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
    name: "Sarah M.",
    location: "Seattle, WA",
    rating: 5,
    product: "Shea Butter Deep Hydration Cream",
    comment: "My dry skin has never felt this soft and hydrated! The Whipped Shea Butter Cream absorbs quickly without any greasy residue, and the calming chamomile scent is pure heaven. It is a absolute daily essential for me now.",
    date: "2 weeks ago"
  },
  {
    name: "James R.",
    location: "Austin, TX",
    rating: 5,
    product: "Activated Charcoal Mint Detox Soap",
    comment: "I was skeptical about using bar soaps on my face, but Aruk's Charcoal Mint soap completely cleared up my chin breakouts in just a week. It cleanses deeply but doesn't leave that squeaky, dried-out feel. 10/10.",
    date: "1 month ago"
  },
  {
    name: "Elena P.",
    location: "New York, NY",
    rating: 5,
    product: "Lavender Oats Calm Soap",
    comment: "Finding a soap that doesn't trigger my rosacea was impossible until I found Aruk. The Lavender Oats bar is so gentle, it calms my skin redness instantly. The oatmeal scrub feel is amazing.",
    date: "3 weeks ago"
  },
  {
    name: "Marcus L.",
    location: "San Francisco, CA",
    rating: 5,
    product: "Botanical Glow Facial Elixir",
    comment: "This facial oil is magical. I put 3 drops on my face before bed and wake up with the most radiant, rested glow. It has helped fade my post-acne dark marks and feels like a luxurious skincare ritual in a bottle.",
    date: "2 months ago"
  },
  {
    name: "Clara T.",
    location: "Miami, FL",
    rating: 4.8,
    product: "Honey Amber Glow Soap",
    comment: "The scent of Honey Amber Glow soap is intoxicating—rich, warm, and natural. It provides a creamy lotion-like lather that makes taking a shower feel like a luxury ritual. Will definitely buy the 3-bar bundle next time!",
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

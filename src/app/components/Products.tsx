"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Plus, Leaf, Eye, ShieldCheck, Heart } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  category: "soap" | "cream" | "oil";
  categoryLabel: string;
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  ingredients: string[];
  size: string;
  image: string;
  isBestSeller?: boolean;
  isNew?: boolean;
}

const PRODUCTS_DATA: Product[] = [
  {
    id: "p1",
    name: "Lavender Oats Calm Soap",
    category: "soap",
    categoryLabel: "Artisanal Bar Soap",
    price: 14,
    rating: 4.9,
    reviewsCount: 124,
    description: "A soothing, exfoliating organic bar soap crafted with ground colloidal oatmeal and organic English lavender oil. Perfect for calming sensitive skin.",
    ingredients: ["Saponified Olive Oil", "Colloidal Oatmeal", "English Lavender Essential Oil", "Shea Butter"],
    size: "150g / 5.3 oz",
    image: "/spa_facial.png", // Fallback / premium texture
    isBestSeller: true
  },
  {
    id: "p2",
    name: "Honey Amber Glow Soap",
    category: "soap",
    categoryLabel: "Artisanal Bar Soap",
    price: 14,
    rating: 4.8,
    reviewsCount: 96,
    description: "Deeply moisturizing soap enriched with raw organic wildflower honey, beeswax, and sweet amber resin extracts. Leaves a rich, warm scent and a golden skin glow.",
    ingredients: ["Wildflower Honey", "Organic Beeswax", "Coconut Oil", "Amber Resin Extract"],
    size: "150g / 5.3 oz",
    image: "/aruk.jpg", // Using the client's aruk.jpg image!
    isNew: true
  },
  {
    id: "p3",
    name: "Shea Butter Deep Hydration Cream",
    category: "cream",
    categoryLabel: "Nourishing Cream",
    price: 28,
    rating: 4.9,
    reviewsCount: 202,
    description: "A rich, whipped hand and body lotion formulated with 20% raw organic shea butter, cold-pressed avocado oil, and soothing chamomile extract.",
    ingredients: ["Raw Shea Butter", "Avocado Oil", "Chamomile Extract", "Vitamin E"],
    size: "200ml / 6.8 fl oz",
    image: "/spa_facial.png", // Fallback premium beauty look
    isBestSeller: true
  },
  {
    id: "p4",
    name: "Rosewater Radiance Face Gel",
    category: "cream",
    categoryLabel: "Facial Cream & Gel",
    price: 32,
    rating: 4.7,
    reviewsCount: 88,
    description: "A light, cooling hydration jelly made with pure Bulgarian rose hydrosol and plant-derived hyaluronic acid. Instantly locks in moisture and plumps skin.",
    ingredients: ["Rose Hydrosol", "Hyaluronic Acid", "Aloe Vera Juice", "Green Tea Extract"],
    size: "50ml / 1.7 fl oz",
    image: "/spa_facial.png"
  },
  {
    id: "p5",
    name: "Activated Charcoal Mint Detox Soap",
    category: "soap",
    categoryLabel: "Artisanal Bar Soap",
    price: 15,
    rating: 4.9,
    reviewsCount: 143,
    description: "A clarifying deep-clean bar with activated bamboo charcoal to draw out impurities, blended with crisp double-mint essential oil to wake up your senses.",
    ingredients: ["Bamboo Activated Charcoal", "Peppermint Oil", "Spearmint Oil", "Castor Seed Oil"],
    size: "150g / 5.3 oz",
    image: "/aruk.jpg" // Using client's image as background
  },
  {
    id: "p6",
    name: "Botanical Glow Facial Elixir",
    category: "oil",
    categoryLabel: "Treatment Oil",
    price: 38,
    rating: 5.0,
    reviewsCount: 74,
    description: "An ultra-nourishing, non-greasy face oil loaded with cold-pressed rosehip seed oil, organic jojoba oil, and premium neroli flower extract for overnight repair.",
    ingredients: ["Rosehip Seed Oil", "Jojoba Seed Oil", "Neroli Essential Oil", "Marula Oil"],
    size: "30ml / 1.0 fl oz",
    image: "/spa_facial.png",
    isBestSeller: true
  }
];

interface ProductsProps {
  onAddToBag: (product: Product) => void;
}

export default function Products({ onAddToBag }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "soap" | "cream" | "oil">("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "products"));
        const loadedProducts: Product[] = [];
        querySnapshot.forEach((docSnap) => {
          loadedProducts.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });

        if (loadedProducts.length === 0) {
          console.log("Seeding default products to Cloud Firestore...");
          for (const prod of PRODUCTS_DATA) {
            await setDoc(doc(db, "products", prod.id), {
              name: prod.name,
              category: prod.category,
              categoryLabel: prod.categoryLabel,
              price: prod.price,
              rating: prod.rating,
              reviewsCount: prod.reviewsCount,
              description: prod.description,
              ingredients: prod.ingredients,
              size: prod.size,
              image: prod.image,
              isBestSeller: prod.isBestSeller || false,
              isNew: prod.isNew || false,
            });
          }
          setProducts(PRODUCTS_DATA);
        } else {
          setProducts(loadedProducts);
        }
      } catch (error) {
        console.error("Error loading products from Firestore, using local fallback: ", error);
        setProducts(PRODUCTS_DATA);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) => activeTab === "all" || product.category === activeTab
  );

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <section id="products" className="py-20 bg-card/30 dark:bg-[#1A1816]/30 border-t border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center space-x-1.5 text-primary mb-2.5">
            <Leaf className="w-4.5 h-4.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">The Collection</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
            Explore Handcrafted Purity
          </h2>
          <p className="text-muted mt-4 text-sm sm:text-base font-light">
            Formulated in micro-batches to guarantee freshness. Made from raw ingredients, essential oils, and herbal infusions to nourish, replenish, and repair.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 sm:mb-16">
          {(["all", "soap", "cream", "oil"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                  : "border border-border bg-card hover:bg-accent/40 text-foreground"
              }`}
            >
              {tab === "all" && "All Products"}
              {tab === "soap" && "Artisanal Soaps"}
              {tab === "cream" && "Nourishing Creams"}
              {tab === "oil" && "Oils & Serums"}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 animate-fade-in">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border/70 rounded-3xl overflow-hidden p-6 space-y-4 animate-pulse">
                <div className="aspect-square w-full bg-accent/20 rounded-2xl" />
                <div className="h-4 bg-accent/20 rounded w-1/3" />
                <div className="h-6 bg-accent/20 rounded w-3/4" />
                <div className="h-4 bg-accent/20 rounded w-1/2" />
                <div className="h-10 bg-accent/20 rounded-full w-full mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredProducts.map((product) => {
              const isFav = favorites.includes(product.id);
              return (
                <div
                key={product.id}
                className="group relative bg-card border border-border/70 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-stone-900/5 transition-all duration-500 flex flex-col h-full hover:-translate-y-1"
              >
                {/* Image Holder */}
                <div className="relative aspect-square w-full bg-accent/20 overflow-hidden flex items-center justify-center">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    /* Fallback luxury golden vector icon if no image */
                    <div className="w-full h-full bg-gradient-to-tr from-accent/30 via-primary/5 to-accent/40 flex items-center justify-center">
                      <Leaf className="w-16 h-16 text-primary/30" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    {product.isBestSeller && (
                      <span className="bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        Best Seller
                      </span>
                    )}
                    {product.isNew && (
                      <span className="bg-secondary text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  {/* Favorites Trigger */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 bg-background/85 hover:bg-background text-foreground/70 hover:text-red-500 p-2 rounded-full border border-border shadow-sm transition-all"
                  >
                    <Heart className={`w-4 h-4 transition-all ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                  </button>

                  {/* Quick View Button */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="bg-background text-foreground text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-full border border-border shadow-md hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Quick View
                    </button>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      {product.categoryLabel}
                    </span>
                    <span className="text-[10px] text-muted">{product.size}</span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating) ? "fill-current" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-foreground">{product.rating}</span>
                    <span className="text-[10px] text-muted">({product.reviewsCount})</span>
                  </div>

                  <p className="text-xs text-muted font-light leading-relaxed mb-6 flex-grow line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
                    <span className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => onAddToBag(product)}
                      className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 hover:border-primary text-xs font-bold px-4 py-2.5 rounded-full transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add to Bag
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* Highlight Banner (using client's photo) */}
        <div className="mt-20 bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 relative h-64 lg:h-[350px] w-full">
              <Image
                src="/aruk.jpg"
                alt="Aruk Handcrafted Organic Soap Soapmaking"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col space-y-4">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Formulated & Produced In-House
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
                99.5% Organic & Premium Quality
              </h3>
              <p className="text-muted text-xs sm:text-sm font-light leading-relaxed max-w-xl">
                We formulate and produce body care products that are both safe and pocket-friendly. Handcrafted in Uyo, our soaps and creams are completely free from harsh chemicals or fillers, using active plant nutrients to repair damaged skin and restore healthy radiance from head to toe.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground bg-accent/40 px-3.5 py-1.5 rounded-full">
                  <span>🍃</span> 99.5% Organic
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground bg-accent/40 px-3.5 py-1.5 rounded-full">
                  <span>💰</span> Pocket Friendly
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground bg-accent/40 px-3.5 py-1.5 rounded-full">
                  <span>📍</span> Handcrafted in Uyo
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-background border border-border max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-background/80 hover:bg-accent border border-border p-2 rounded-full text-foreground/80 hover:text-foreground transition-all cursor-pointer z-10"
            >
              <Plus className="w-5 h-5 rotate-45" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-square w-full bg-accent/20">
                {selectedProduct.image ? (
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-accent/30 via-primary/5 to-accent/40 flex items-center justify-center">
                    <Leaf className="w-16 h-16 text-primary/30" />
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    {selectedProduct.categoryLabel}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mt-1.5 mb-2.5">
                    {selectedProduct.name}
                  </h3>
                  <div className="flex items-center space-x-1.5 mb-4">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(selectedProduct.rating) ? "fill-current" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold">{selectedProduct.rating}</span>
                  </div>
                  <p className="text-xs text-muted font-light leading-relaxed mb-5">
                    {selectedProduct.description}
                  </p>
                  
                  {/* Size & Ingredients */}
                  <div className="space-y-2.5 mb-6 text-xs">
                    <div>
                      <span className="font-semibold text-foreground">Size: </span>
                      <span className="text-muted font-light">{selectedProduct.size}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground block mb-1">Key Ingredients:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProduct.ingredients.map((ing, i) => (
                          <span key={i} className="bg-accent/40 text-foreground px-2 py-0.5 rounded text-[10px]">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
                  <span className="text-xl font-bold text-foreground">${selectedProduct.price.toFixed(2)}</span>
                  <button
                    onClick={() => {
                      onAddToBag(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full transition-all shadow-md shadow-primary/10 hover:bg-primary/95 cursor-pointer text-xs uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" /> Add to Bag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

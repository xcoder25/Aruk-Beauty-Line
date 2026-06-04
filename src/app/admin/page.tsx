"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot 
} from "firebase/firestore";
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from "firebase/storage";
import { auth, db, storage } from "../lib/firebase";
import { 
  Lock, 
  Mail, 
  Plus, 
  Trash2, 
  LogOut, 
  Image as ImageIcon, 
  Upload, 
  Sparkles, 
  Leaf, 
  DollarSign, 
  Check, 
  Loader2 
} from "lucide-react";
import { Product } from "../components/Products";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Auth Form State
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  
  // Products Management State
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  
  // New Product Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"soap" | "cream" | "oil">("soap");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(false);
  
  // Uploading State
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [submitting, setSubmitting] = useState(false);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Monitor Firestore Products
  useEffect(() => {
    if (!user) return;
    
    setProductsLoading(true);
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const list: Product[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      setProducts(list);
      setProductsLoading(false);
    }, (error) => {
      console.error("Error subscribing to products: ", error);
      setProductsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle Login / Registration
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (!email || !password) {
      setAuthError("Please fill in all fields.");
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        setFormSuccess("Account registered successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setAuthError("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setAuthError("Password should be at least 6 characters.");
      } else if (err.code === "auth/invalid-credential") {
        setAuthError("Invalid email or password.");
      } else {
        setAuthError("An error occurred during authentication.");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setProducts([]);
  };

  // Handle Image Upload to Firebase Storage
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageUrl(""); // Clear manual URL if uploading file
    }
  };

  // Submit Product Form
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    
    if (!name || !price || !size || !description) {
      setFormError("Please fill in all required fields (Name, Price, Size, Description).");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("Please enter a valid price greater than 0.");
      return;
    }

    setSubmitting(true);

    try {
      let finalImageUrl = imageUrl;

      // 1. Upload file if selected
      if (imageFile) {
        setUploadProgress(0);
        finalImageUrl = await new Promise((resolve, reject) => {
          const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
          const uploadTask = uploadBytesResumable(storageRef, imageFile);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Storage upload error: ", error);
              reject("Failed to upload image file to Firebase Storage. Please check storage permissions.");
            },
            async () => {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadUrl);
            }
          );
        });
      }

      // 2. Set Category labels dynamically
      let categoryLabel = "Artisanal Bar Soap";
      if (category === "cream") categoryLabel = "Nourishing Body Cream";
      if (category === "oil") categoryLabel = "Treatment Oil & Serums";

      // 3. Format ingredients array
      const ingredients = ingredientsText
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      // 4. Save to Cloud Firestore
      await addDoc(collection(db, "products"), {
        name,
        category,
        categoryLabel,
        price: priceNum,
        rating: 5.0, // Default rating for new items
        reviewsCount: 1,
        description,
        ingredients: ingredients.length > 0 ? ingredients : ["Organic Botanicals"],
        size,
        image: finalImageUrl || "/spa_facial.png", // Use fallback if empty
        isBestSeller,
        isNew,
        createdAt: new Date().toISOString()
      });

      // Reset form
      setFormSuccess("Product uploaded successfully!");
      setName("");
      setPrice("");
      setSize("");
      setDescription("");
      setIngredientsText("");
      setImageFile(null);
      setImageUrl("");
      setIsBestSeller(false);
      setIsNew(false);
      setUploadProgress(-1);

      // Clear success notification
      setTimeout(() => setFormSuccess(""), 4000);

    } catch (err: any) {
      console.error(err);
      setFormError(err.toString() || "Failed to create product in Firestore.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteDoc(doc(db, "products", id));
        setFormSuccess(`Deleted ${name}.`);
        setTimeout(() => setFormSuccess(""), 3000);
      } catch (err) {
        console.error(err);
        setFormError(`Failed to delete ${name}.`);
      }
    }
  };

  // loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#11100F] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
          <p className="text-sm text-muted font-light">Securing Administrator Access...</p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!user) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#11100F] flex items-center justify-center p-4">
        <div className="absolute top-6 left-6 relative w-[100px] h-[40px]">
          <Image src="/aruk_logo.png" alt="Aruk Logo" fill style={{ objectFit: "contain" }} />
        </div>

        <div className="w-full max-w-md bg-card border border-border/80 rounded-[2.5rem] shadow-xl p-8 sm:p-10 animate-fade-in">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-1">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              {isRegistering ? "Register Admin Account" : "Aruk Admin Portal"}
            </h2>
            <p className="text-xs text-muted font-light leading-relaxed">
              {isRegistering 
                ? "Create administrator credentials to manage products." 
                : "Log in with credentials to modify Aruk products catalogue."}
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-xs font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@arukbeautyline.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-xl px-4 py-3.5 pl-10 text-xs focus:outline-none focus:border-primary/70 text-foreground"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-xl px-4 py-3.5 pl-10 text-xs focus:outline-none focus:border-primary/70 text-foreground"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-full text-xs uppercase tracking-wider hover:bg-primary/95 transition-all shadow-md shadow-primary/5 cursor-pointer mt-2"
            >
              {isRegistering ? "Register Account" : "Access Dashboard"}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setAuthError("");
              }}
              className="text-xs text-primary font-medium hover:underline transition-all"
            >
              {isRegistering ? "Already have an account? Sign In" : "New Admin? Register Account"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ADMIN DASHBOARD SCREEN
  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#11100F] text-foreground py-8 px-4 sm:px-6 lg:px-8">
      {/* Header bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-border gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-[110px] h-[45px]">
            <Image src="/aruk_logo.png" alt="Aruk Logo" fill style={{ objectFit: "contain" }} />
          </div>
          <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Admin Console
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-light text-muted">
          <span>Signed in as: <strong className="font-semibold text-foreground">{user.email}</strong></span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 border border-border bg-card hover:bg-accent/40 text-foreground px-4 py-2 rounded-full cursor-pointer transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        
        {/* Form Column - Left */}
        <div className="lg:col-span-5 bg-card border border-border/80 rounded-[2.5rem] p-6 sm:p-8 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-lg font-bold text-foreground">Upload Skincare Product</h3>
          </div>

          {formError && (
            <div className="mb-5 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-xs font-medium">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="mb-5 p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-green-600 text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4" /> {formSuccess}
            </div>
          )}

          <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider">Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lavender Oats Calm Soap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold uppercase tracking-wider">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="soap">Soap Bar</option>
                  <option value="cream">Whipped Cream</option>
                  <option value="oil">Oil / Serum</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold uppercase tracking-wider">Size *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 150g / 5.3 oz"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold uppercase tracking-wider flex items-center gap-1">
                  Price ($) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="14.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 pl-8 text-xs focus:outline-none focus:border-primary text-foreground"
                  />
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 cursor-pointer font-semibold uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  Best Seller
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  New Tag
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider">Key Ingredients (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Raw Shea Butter, Honey, Oatmeal, Lavender Oil"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider">Description *</label>
              <textarea
                rows={3}
                required
                placeholder="Describe product texture, benefits, and instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground resize-none"
              />
            </div>

            {/* Product Image Section */}
            <div className="border border-dashed border-border/80 rounded-2xl p-4 bg-background/50 space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-primary" /> Upload File (Storage)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:uppercase file:bg-primary/10 file:text-primary file:hover:bg-primary/20 cursor-pointer file:cursor-pointer"
                />
              </div>

              <div className="flex items-center text-[10px] text-muted gap-2">
                <div className="h-[1px] bg-border flex-grow" />
                <span>OR PASTE IMAGE URL fallback</span>
                <div className="h-[1px] bg-border flex-grow" />
              </div>

              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="e.g. /spa_facial.png or online link"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageFile(null); // Clear file upload if url pasted
                  }}
                  className="w-full bg-background border border-border/85 rounded-xl px-4 py-2.5 text-[10px] focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              {uploadProgress >= 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted font-bold">
                    <span>Uploading Image...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1">
                    <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-full tracking-wider uppercase hover:bg-primary/95 transition-all shadow-md shadow-primary/5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading product...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Save Skincare Product
                </>
              )}
            </button>
          </form>
        </div>

        {/* List Column - Right */}
        <div className="lg:col-span-7 bg-card border border-border/80 rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-lg font-bold text-foreground">Aruk Products Catalog ({products.length})</h3>
            </div>
          </div>

          {productsLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-xs text-muted font-light">Loading database items...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20 text-center space-y-4">
              <ImageIcon className="w-12 h-12 text-muted/40" />
              <div>
                <h4 className="text-sm font-semibold text-foreground">No Products Active</h4>
                <p className="text-xs text-muted font-light mt-1 max-w-[250px] mx-auto">
                  Create a new product on the left to display it on the Aruk Beauty Line homepage.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2">
              {products.map((prod) => (
                <div 
                  key={prod.id} 
                  className="flex items-center justify-between p-4 bg-background border border-border/80 rounded-2xl hover:border-primary/30 transition-all text-xs"
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-accent/20 flex-shrink-0">
                      {prod.image ? (
                        <Image src={prod.image} alt={prod.name} fill style={{ objectFit: "cover" }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">🌱</div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground leading-tight line-clamp-1">{prod.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-muted">
                        <span className="bg-accent/40 px-2 py-0.5 rounded uppercase font-medium">{prod.category}</span>
                        <span>{prod.size}</span>
                        {prod.isBestSeller && (
                          <span className="text-[9px] font-bold text-primary tracking-widest uppercase">BestSeller</span>
                        )}
                        {prod.isNew && (
                          <span className="text-[9px] font-bold text-secondary tracking-widest uppercase">New</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-foreground text-sm">${prod.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      className="text-muted hover:text-red-500 border border-border/80 hover:border-red-200 bg-card p-2.5 rounded-full transition-all cursor-pointer"
                      aria-label={`Delete ${prod.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

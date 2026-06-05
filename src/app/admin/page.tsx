"use client";

import { useState, useEffect, useRef } from "react";
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
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  updateDoc
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
  Loader2,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Edit2,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sliders,
  Eye,
  Phone,
  MapPin,
  X
} from "lucide-react";
import { Product } from "../components/Products";

// Type definitions for Orders
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  subtotalUsd: number;
  totalNaira: number;
  paystackReference: string;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders">("overview");

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
  
  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState<"soap" | "cream" | "oil">("soap");
  const [editPrice, setEditPrice] = useState("");
  const [editSize, setEditSize] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIngredientsText, setEditIngredientsText] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editIsBestSeller, setEditIsBestSeller] = useState(false);
  const [editIsNew, setEditIsNew] = useState(false);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  
  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Product Search/Filter
  const [prodSearch, setProdSearch] = useState("");
  const [prodCategoryFilter, setProdCategoryFilter] = useState<"all" | "soap" | "cream" | "oil">("all");

  // Order Search/Filter
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  // Uploading State
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [editUploadProgress, setEditUploadProgress] = useState(-1);
  const [submitting, setSubmitting] = useState(false);

  // ── AI ASSISTANT STATE ──
  const [ariaOpen, setAriaOpen] = useState(false);
  const [ariaMessages, setAriaMessages] = useState<Array<{ role: "user" | "model"; content: string; ts: number }>>([]);
  const [ariaInput, setAriaInput] = useState("");
  const [ariaLoading, setAriaLoading] = useState(false);
  const ariaEndRef = useRef<HTMLDivElement>(null);
  const ariaInputRef = useRef<HTMLTextAreaElement>(null);

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

  // Monitor Firestore Orders
  useEffect(() => {
    if (!user) return;
    
    setOrdersLoading(true);
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      // Sort: Newest orders first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(list);
      setOrdersLoading(false);
    }, (error) => {
      console.error("Error subscribing to orders: ", error);
      setOrdersLoading(false);
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
    setOrders([]);
    setActiveTab("overview");
  };

  // Handle Image Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageUrl(""); // Clear URL input
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditImageFile(e.target.files[0]);
      setEditImageUrl(""); // Clear URL input
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

      if (imageFile) {
        setUploadProgress(0);
        try {
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
                reject(error);
              },
              async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadUrl);
              }
            );
          });
        } catch (uploadErr) {
          console.warn("Storage upload failed, falling back to local asset path:", uploadErr);
          setFormError("Notice: Image file upload failed. Fell back to default organic placeholder.");
          finalImageUrl = "/spa_facial.png"; 
        }
      }

      let categoryLabel = "Artisanal Bar Soap";
      if (category === "cream") categoryLabel = "Nourishing Body Cream";
      if (category === "oil") categoryLabel = "Treatment Oil & Serums";

      const ingredients = ingredientsText
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      await addDoc(collection(db, "products"), {
        name,
        category,
        categoryLabel,
        price: priceNum,
        rating: 5.0,
        reviewsCount: 1,
        description,
        ingredients: ingredients.length > 0 ? ingredients : ["Organic Botanicals"],
        size,
        image: finalImageUrl || "/spa_facial.png",
        isBestSeller,
        isNew,
        createdAt: new Date().toISOString()
      });

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

      setTimeout(() => setFormSuccess(""), 4000);

    } catch (err: any) {
      console.error(err);
      setFormError(err.toString() || "Failed to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Product Modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditPrice(product.price.toString());
    setEditSize(product.size);
    setEditDescription(product.description);
    setEditIngredientsText(product.ingredients.join(", "));
    setEditImageUrl(product.image || "");
    setEditIsBestSeller(product.isBestSeller || false);
    setEditIsNew(product.isNew || false);
    setEditImageFile(null);
  };

  // Save Product Changes
  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setFormError("");
    setFormSuccess("");
    setSubmitting(true);

    try {
      let finalImageUrl = editImageUrl;

      if (editImageFile) {
        setEditUploadProgress(0);
        try {
          finalImageUrl = await new Promise((resolve, reject) => {
            const storageRef = ref(storage, `products/${Date.now()}_${editImageFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, editImageFile);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setEditUploadProgress(progress);
              },
              (error) => {
                console.error("Storage upload error: ", error);
                reject(error);
              },
              async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadUrl);
              }
            );
          });
        } catch (uploadErr) {
          console.warn("Storage upload failed, falling back to existing image path:", uploadErr);
          setFormError("Notice: New image file upload failed. Maintained current product image.");
          // finalImageUrl retains editImageUrl value
        }
      }

      let categoryLabel = "Artisanal Bar Soap";
      if (editCategory === "cream") categoryLabel = "Nourishing Body Cream";
      if (editCategory === "oil") categoryLabel = "Treatment Oil & Serums";

      const ingredients = editIngredientsText
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      await updateDoc(doc(db, "products", editingProduct.id), {
        name: editName,
        category: editCategory,
        categoryLabel,
        price: parseFloat(editPrice),
        size: editSize,
        description: editDescription,
        ingredients: ingredients.length > 0 ? ingredients : ["Organic Botanicals"],
        image: finalImageUrl || "/spa_facial.png",
        isBestSeller: editIsBestSeller,
        isNew: editIsNew,
      });

      setFormSuccess(`Updated changes for ${editName}!`);
      setEditingProduct(null);
      setEditUploadProgress(-1);
      setTimeout(() => setFormSuccess(""), 4000);

    } catch (err: any) {
      console.error(err);
      setFormError(err.toString() || "Failed to update product details.");
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

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus
      });
      setFormSuccess(`Order status updated to "${newStatus}"`);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      setTimeout(() => setFormSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setFormError("Failed to update order status.");
    }
  };

  // Calculations for Stats (Overview Tab)
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalNaira || 0), 0);
  const pendingDeliveries = orders.filter((order) => order.status === "Pending Delivery").length;
  const processedOrders = orders.filter((order) => order.status === "Processed").length;
  const shippedOrders = orders.filter((order) => order.status === "Shipped").length;
  const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;

  const countSoaps = products.filter((p) => p.category === "soap").length;
  const countCreams = products.filter((p) => p.category === "cream").length;
  const countOils = products.filter((p) => p.category === "oil").length;

  // ── AI ASSISTANT HANDLERS ──
  // Auto-scroll to latest message
  useEffect(() => {
    ariaEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ariaMessages, ariaLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (ariaOpen) setTimeout(() => ariaInputRef.current?.focus(), 150);
  }, [ariaOpen]);

  const sendAriaMessage = async (messageText?: string) => {
    const text = (messageText ?? ariaInput).trim();
    if (!text || ariaLoading) return;

    const userMsg = { role: "user" as const, content: text, ts: Date.now() };
    setAriaMessages((prev) => [...prev, userMsg]);
    setAriaInput("");
    setAriaLoading(true);

    try {
      const history = ariaMessages.map(({ role, content }) => ({ role, content }));
      const context = {
        products: products.map((p) => ({ name: p.name, category: p.category, price: p.price })),
        orders: orders.map((o) => ({ status: o.status, totalNaira: o.totalNaira, createdAt: o.createdAt })),
      };

      const res = await fetch("/api/admin-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history, context }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAriaMessages((prev) => [
        ...prev,
        { role: "model", content: data.reply, ts: Date.now() },
      ]);
    } catch (err: any) {
      setAriaMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: `⚠️ ${err.message || "Something went wrong. Please try again."}`,
          ts: Date.now(),
        },
      ]);
    } finally {
      setAriaLoading(false);
    }
  };

  // Filters for lists
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(prodSearch.toLowerCase()) || 
                          prod.description.toLowerCase().includes(prodSearch.toLowerCase());
    const matchesCategory = prodCategoryFilter === "all" || prod.category === prodCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          order.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          order.paystackReference.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          order.city.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Loader state
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

  // AUTH LOGIN / REGISTER CANVAS
  if (!user) {
    return (
      <main className="admin-page min-h-screen bg-[#FAF7F2] dark:bg-[#11100F] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border/80 rounded-[2.5rem] shadow-xl p-8 sm:p-10 animate-fade-in relative overflow-hidden">
          {/* Logo brand highlight overlay */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
          
          <div className="text-center space-y-2 mb-8 mt-2">
            <div className="inline-flex p-3.5 rounded-2xl bg-primary/10 text-primary mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              {isRegistering ? "Register Admin Account" : "Aruk Admin Console"}
            </h2>
            <p className="text-xs text-muted font-light leading-relaxed">
              {isRegistering 
                ? "Configure your secure credential access keys." 
                : "Enter credentials to access catalog and order tracking."}
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
                  className="w-full bg-background border border-border/80 rounded-xl px-4 py-3.5 pl-10 text-sm focus:outline-none focus:border-primary text-foreground"
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
                  className="w-full bg-background border border-border/80 rounded-xl px-4 py-3.5 pl-10 text-sm focus:outline-none focus:border-primary text-foreground"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-full text-xs uppercase tracking-wider hover:bg-primary/95 transition-all shadow-lg shadow-primary/10 cursor-pointer mt-2"
            >
              {isRegistering ? "Create Admin Credentials" : "Sign In to Dashboard"}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setAuthError("");
              }}
              className="text-xs text-primary font-medium hover:underline transition-all cursor-pointer"
            >
              {isRegistering ? "Already have an account? Sign In" : "New Admin? Register Account"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ACTIVE ADMIN CONSOLE PANEL
  return (
    <main className="admin-page min-h-screen bg-[#FAF7F2] dark:bg-[#0D1108] text-foreground pb-16">
      
      {/* ── HEADER NAVIGATION BAR ── */}
      <header className="bg-card border-b border-border/60 shadow-sm sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border/80 dark:border-primary/30 shadow-sm flex-shrink-0">
              <Image src="/aruk_logo_4k.png" alt="Aruk Logo" fill style={{ objectFit: "cover" }} />
            </div>
            <span className="bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
              Admin Console
            </span>
          </div>

          {/* Tab Selection */}
          <nav className="flex items-center gap-1 bg-accent/40 dark:bg-accent/15 p-1 rounded-full border border-border/50 text-sm">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === "overview"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === "products"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Catalogue
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all uppercase tracking-wider relative cursor-pointer ${
                activeTab === "orders"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Orders
              {pendingDeliveries > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-xs w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse border border-card">
                  {pendingDeliveries}
                </span>
              )}
            </button>
          </nav>
          {/* Aria AI shortcut button in header */}
          <button
            onClick={() => setAriaOpen((o) => !o)}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              ariaOpen
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
            }`}
            style={{ minHeight: 36 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Aria AI
          </button>
          
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="hidden sm:inline">Signed in as: <strong className="font-semibold text-foreground">{user.email}</strong></span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 border border-border hover:border-red-400 bg-card hover:bg-red-500/5 text-foreground hover:text-red-500 px-4 py-2 rounded-full cursor-pointer transition-all text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Global Notifications */}
        {formSuccess && (
          <div className="mb-6 p-4 rounded-2xl border border-green-500/20 bg-green-500/5 text-green-600 text-sm font-semibold flex items-center gap-2.5 shadow-sm animate-fade-in">
            <Check className="w-4.5 h-4.5 flex-shrink-0" /> {formSuccess}
          </div>
        )}
        {formError && (
          <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 text-sm font-semibold flex items-center gap-2.5 shadow-sm animate-fade-in">
            <X className="w-4.5 h-4.5 flex-shrink-0" /> {formError}
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB 1: OVERVIEW & ANALYTICS
            ════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Intro banner */}
            <div className="bg-gradient-to-r from-[#141d0c] to-[#0a1005] border border-primary/20 rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-black/15">
              <div className="relative z-10 space-y-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold">Good Day, Administrator 🌿</h2>
                <p className="text-xs text-[#b4e878] font-light max-w-xl leading-relaxed">
                  Welcome to Aruk Beauty Line tracking control. Monitor your boutique cosmetic inventory sales, review real-time customer purchases, and update order fulfillment processes.
                </p>
              </div>
              {/* Abstract decorative leaf in background */}
              <Leaf className="absolute right-8 bottom-[-20px] w-48 h-48 text-[#7AC620]/5 pointer-events-none transform rotate-12" />
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-card border border-border/70 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm uppercase font-semibold tracking-wider text-foreground/70 block">Gross Revenue</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-foreground">₦{totalRevenue.toLocaleString()}</span>
                  <span className="text-xs text-[#7AC620] font-semibold flex items-center gap-0.5 mt-1">
                    <TrendingUp className="w-3 h-3" /> Live Transaction Volume
                  </span>
                </div>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-card border border-border/70 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm uppercase font-semibold tracking-wider text-foreground/70 block">Total Orders</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-foreground">{orders.length}</span>
                  <span className="text-xs text-muted block mt-1">
                    Processed: <strong className="font-semibold text-foreground">{deliveredOrders + shippedOrders}</strong> orders
                  </span>
                </div>
                <div className="w-12 h-12 bg-[#C5A880]/15 text-[#C5A880] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-card border border-border/70 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm uppercase font-semibold tracking-wider text-foreground/70 block">Pending Fulfilment</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-red-500">{pendingDeliveries}</span>
                  <span className="text-xs text-red-400 font-medium flex items-center gap-0.5 mt-1">
                    <Clock className="w-3 h-3 animate-pulse" /> Awaiting packaging
                  </span>
                </div>
                <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-card border border-border/70 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm uppercase font-semibold tracking-wider text-foreground/70 block">Active Catalogue</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-foreground">{products.length}</span>
                  <span className="text-xs text-muted block mt-1">
                    S: {countSoaps} | C: {countCreams} | O: {countOils}
                  </span>
                </div>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* Split layout (activity and feeds) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Order Status Breakdown */}
              <div className="lg:col-span-4 bg-card border border-border/70 rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-primary" /> Delivery Fulfillment
                </h3>
                
                <div className="space-y-4">
                  
                  {/* Progress bar: Pending */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Pending Delivery
                      </span>
                      <span>{pendingDeliveries} ({orders.length ? Math.round((pendingDeliveries / orders.length) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-accent/40 dark:bg-accent/10 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${orders.length ? (pendingDeliveries / orders.length) * 100 : 0}%` }} 
                      />
                    </div>
                  </div>

                  {/* Progress bar: Processed */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Processed
                      </span>
                      <span>{processedOrders} ({orders.length ? Math.round((processedOrders / orders.length) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-accent/40 dark:bg-accent/10 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${orders.length ? (processedOrders / orders.length) * 100 : 0}%` }} 
                      />
                    </div>
                  </div>

                  {/* Progress bar: Shipped */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Shipped
                      </span>
                      <span>{shippedOrders} ({orders.length ? Math.round((shippedOrders / orders.length) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-accent/40 dark:bg-accent/10 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${orders.length ? (shippedOrders / orders.length) * 100 : 0}%` }} 
                      />
                    </div>
                  </div>

                  {/* Progress bar: Delivered */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7AC620]" /> Delivered
                      </span>
                      <span>{deliveredOrders} ({orders.length ? Math.round((deliveredOrders / orders.length) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-accent/40 dark:bg-accent/10 rounded-full h-2">
                      <div 
                        className="bg-[#7AC620] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${orders.length ? (deliveredOrders / orders.length) * 100 : 0}%` }} 
                      />
                    </div>
                  </div>

                </div>
                
                <div className="pt-4 border-t border-border/50 text-xs text-muted font-light leading-relaxed">
                  * Live status percentage values represent portions of orders logged in Cloud Firestore. Update statuses inside the <strong>Orders Manager</strong> tab.
                </div>
              </div>

              {/* Recent Orders Feed */}
              <div className="lg:col-span-8 bg-card border border-border/70 rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex flex-col min-h-[350px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#C5A880]" /> Recent Activity Feed
                  </h3>
                  <button 
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                  >
                    View All Orders
                  </button>
                </div>

                {ordersLoading ? (
                  <div className="flex-grow flex flex-col items-center justify-center py-10 space-y-2">
                    <Loader2 className="w-7 h-7 text-primary animate-spin" />
                    <span className="text-xs text-muted font-light">Checking updates...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center py-10 text-center text-muted text-xs font-light">
                    No transactions recorded yet in the database.
                  </div>
                ) : (
                  <div className="divide-y divide-border/40 overflow-y-auto max-h-[300px]">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="py-4 flex justify-between items-center text-sm">
                        <div className="space-y-1">
                          <p className="font-bold text-foreground">{order.name}</p>
                          <p className="text-xs text-muted">
                            Ref: {order.paystackReference} · {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="font-bold text-foreground">₦{order.totalNaira.toLocaleString()}</p>
                            <p className="text-xs text-muted">{order.items.reduce((s, i) => s + i.quantity, 0)} Items</p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                            order.status === "Pending Delivery" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                            order.status === "Processed" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                            order.status === "Shipped" ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" :
                            "bg-green-500/10 text-green-500 border border-green-500/20"
                          }`}>
                            {order.status.replace(" Delivery", "")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB 2: CATALOGUE MANAGEMENT
            ════════════════════════════════════════════════ */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Product Uploader Form - Left */}
            <div className="lg:col-span-5 bg-card border border-border/80 rounded-[2.5rem] p-6 sm:p-8 shadow-sm h-fit space-y-6">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                <h3 className="font-serif text-lg font-bold text-foreground">Add New Product</h3>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-5 text-sm">
                <div className="space-y-1.5">
                  <label className="font-semibold text-sm text-foreground/70">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Honey Amber Glow Soap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-sm text-foreground/70">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                    >
                      <option value="soap">Soap Bar</option>
                      <option value="cream">Whipped Cream</option>
                      <option value="oil">Oil / Serum</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-sm text-foreground/70">Volume / Size *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 150g / 5.3 oz"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold uppercase tracking-wider text-muted flex items-center gap-1">
                      Price (NGN ₦) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        required
                        placeholder="21000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 pl-8 text-sm focus:outline-none focus:border-primary text-foreground"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted text-sm">₦</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-around gap-2 pt-6">
                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold uppercase tracking-wider text-muted text-xs">
                      <input
                        type="checkbox"
                        checked={isBestSeller}
                        onChange={(e) => setIsBestSeller(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                      Best Seller
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold uppercase tracking-wider text-muted text-xs">
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
                  <label className="font-semibold text-sm text-foreground/70">Ingredients (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Lavender Essential Oil, Colloidal Oats, Shea Butter"
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                    className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-sm text-foreground/70">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide description of product application, skin benefits, and curing details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground resize-none"
                  />
                </div>

                {/* Upload Image Section */}
                <div className="border border-dashed border-border/80 rounded-2xl p-4 bg-background/50 space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-primary" /> Image File (Firebase Storage)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-xs text-muted file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:uppercase file:bg-primary/10 file:text-primary file:hover:bg-primary/20 file:cursor-pointer cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center text-xs text-muted gap-2">
                    <div className="h-[1px] bg-border flex-grow" />
                    <span>OR PASTE URL LINK</span>
                    <div className="h-[1px] bg-border flex-grow" />
                  </div>

                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="e.g. /spa_facial.png"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImageFile(null); // clear file
                      }}
                      className="w-full bg-background border border-border/85 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>

                  {uploadProgress >= 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted font-bold">
                        <span>Uploading file...</span>
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
                      <Loader2 className="w-4 h-4 animate-spin" /> Seeding inventory...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Save Skincare Product
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Product Catalogue Inventory list - Right */}
            <div className="lg:col-span-7 bg-card border border-border/80 rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex flex-col min-h-[600px] space-y-6">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  <h3 className="font-serif text-lg font-bold text-foreground">Aruk Catalogue ({filteredProducts.length})</h3>
                </div>

                {/* Filter and Search controls */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      value={prodSearch}
                      onChange={(e) => setProdSearch(e.target.value)}
                      className="bg-background border border-border/80 px-3.5 py-1.5 pl-8 rounded-full focus:outline-none focus:border-primary text-foreground text-xs w-[140px] sm:w-[170px]"
                    />
                    <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <select
                    value={prodCategoryFilter}
                    onChange={(e) => setProdCategoryFilter(e.target.value as any)}
                    className="bg-background border border-border/80 px-3.5 py-1.5 rounded-full focus:outline-none focus:border-primary text-foreground text-xs cursor-pointer"
                  >
                    <option value="all">All categories</option>
                    <option value="soap">Soaps</option>
                    <option value="cream">Creams</option>
                    <option value="oil">Oils</option>
                  </select>
                </div>
              </div>

              {productsLoading ? (
                <div className="flex-grow flex flex-col items-center justify-center py-20 space-y-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="text-xs text-muted font-light">Loading database items...</span>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <ImageIcon className="w-12 h-12 text-muted/40" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">No Products Found</h4>
                    <p className="text-xs text-muted font-light mt-1 max-w-[250px] mx-auto">
                      Adjust your query filter or create a new skincare product to display.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1 scrollbar-thin">
                  {filteredProducts.map((prod) => (
                    <div 
                      key={prod.id} 
                      className="flex items-center justify-between p-4 bg-background border border-border/80 rounded-2xl hover:border-primary/40 hover:shadow-sm transition-all text-xs"
                    >
                      <div className="flex items-center gap-4">
                        {/* Thumbnail */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-accent/20 flex-shrink-0 border border-border/60">
                          {prod.image ? (
                            <Image src={prod.image} alt={prod.name} fill style={{ objectFit: "cover" }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/5">🌱</div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-foreground leading-tight line-clamp-1">{prod.name}</h4>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
                            <span className="bg-accent/60 dark:bg-accent/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{prod.category}</span>
                            <span>{prod.size}</span>
                            {prod.isBestSeller && (
                              <span className="text-xs font-bold text-primary tracking-widest uppercase">BestSeller</span>
                            )}
                            {prod.isNew && (
                              <span className="text-xs font-bold text-[#C5A880] tracking-widest uppercase">New</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-foreground text-sm">₦{prod.price.toLocaleString()}</span>
                        
                        <button
                          onClick={() => openEditModal(prod)}
                          className="text-muted hover:text-primary border border-border/80 hover:border-primary/20 bg-card p-2.5 rounded-full transition-all cursor-pointer"
                          aria-label={`Edit ${prod.name}`}
                          title="Edit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="text-muted hover:text-red-500 border border-border/80 hover:border-red-200 bg-card p-2.5 rounded-full transition-all cursor-pointer"
                          aria-label={`Delete ${prod.name}`}
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB 3: ORDERS FULFILMENT TRACKING
            ════════════════════════════════════════════════ */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Orders Feed - Left */}
            <div className="lg:col-span-7 bg-card border border-border/80 rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex flex-col min-h-[600px] space-y-6">
              
              {/* Header with search inputs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h3 className="font-serif text-lg font-bold text-foreground">Order Logs ({filteredOrders.length})</h3>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="bg-background border border-border/80 px-3.5 py-1.5 pl-8 rounded-full focus:outline-none focus:border-primary text-foreground text-xs w-[140px] sm:w-[170px]"
                    />
                    <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-background border border-border/80 px-3.5 py-1.5 rounded-full focus:outline-none focus:border-primary text-foreground text-xs cursor-pointer"
                  >
                    <option value="all">All statuses</option>
                    <option value="Pending Delivery">Pending</option>
                    <option value="Processed">Processed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {ordersLoading ? (
                <div className="flex-grow flex flex-col items-center justify-center py-20 space-y-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="text-xs text-muted font-light">Loading client orders...</span>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-muted/40" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">No Orders Logged</h4>
                    <p className="text-xs text-muted font-light mt-1 max-w-[250px] mx-auto">
                      No customer transactions match your current search/filter guidelines.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1 scrollbar-thin">
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <div 
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`p-4 bg-background border rounded-2xl hover:border-primary/45 transition-all text-xs cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isSelected ? "border-primary/75 ring-1 ring-primary/40" : "border-border/80"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-sm leading-tight">{order.name}</span>
                            <span className="text-xs text-muted">{order.city} 🇳🇬</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
                            <span className="font-mono bg-accent/40 px-2 py-0.5 rounded text-xs font-semibold">{order.paystackReference}</span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            <span>· {order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-center">
                          <div className="text-right">
                            <p className="font-bold text-foreground">₦{order.totalNaira.toLocaleString()}</p>
                            <p className="text-xs text-muted">${order.subtotalUsd.toFixed(2)} USD</p>
                          </div>
                          
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                            order.status === "Pending Delivery" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                            order.status === "Processed" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                            order.status === "Shipped" ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" :
                            "bg-green-500/10 text-green-500 border border-green-500/20"
                          }`}>
                            {order.status.replace(" Delivery", "")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Detail Panel - Right */}
            <div className="lg:col-span-5 bg-card border border-border/80 rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex flex-col min-h-[450px]">
              {selectedOrder ? (
                <div className="space-y-6 animate-fade-in text-xs">
                  
                  {/* Title and reference */}
                  <div className="border-b border-border/40 pb-4 flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-foreground">Order Details</h3>
                      <p className="font-mono text-xs text-muted mt-1 uppercase tracking-widest">REF: {selectedOrder.paystackReference}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="bg-accent/40 hover:bg-accent border border-border/80 p-1.5 rounded-full text-foreground/80 hover:text-foreground cursor-pointer transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Customer details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted">Customer Information</h4>
                    <div className="bg-background rounded-2xl p-4 border border-border/70 space-y-2.5">
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <Sliders className="w-3.5 h-3.5 text-primary" /> {selectedOrder.name}
                      </p>
                      <p className="text-muted flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-muted" /> {selectedOrder.email}
                      </p>
                      <p className="text-muted flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-muted" /> {selectedOrder.phone}
                      </p>
                      <p className="text-muted flex items-start gap-2 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-muted flex-shrink-0 mt-0.5" /> 
                        <span>
                          {selectedOrder.address},<br />
                          {selectedOrder.city}, Nigeria 🇳🇬
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Products bought details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted">Purchased Items</h4>
                    <div className="bg-background rounded-2xl border border-border/70 divide-y divide-border/40 overflow-hidden">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="p-3.5 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-semibold text-foreground">{item.name}</p>
                            <p className="text-xs text-muted">Qty: {item.quantity} · Price: ${item.price}</p>
                          </div>
                          <span className="font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing summaries */}
                  <div className="border-t border-b border-border/40 py-3.5 space-y-2 text-xs">
                    <div className="flex justify-between text-muted">
                      <span>USD Subtotal:</span>
                      <span>${selectedOrder.subtotalUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-foreground text-sm">
                      <span>Total Paid:</span>
                      <span className="text-primary">₦{selectedOrder.totalNaira.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Fulfillment Status Changer */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted">Update Status Control</h4>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                        className="bg-background border border-border/80 px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary text-foreground text-xs flex-grow cursor-pointer"
                      >
                        <option value="Pending Delivery">Pending Delivery</option>
                        <option value="Processed">Processed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>

                      <div className="flex gap-2">
                        {selectedOrder.status === "Pending Delivery" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Processed")}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:shadow-sm cursor-pointer transition-all flex-grow whitespace-nowrap"
                          >
                            Set Processed
                          </button>
                        )}
                        {selectedOrder.status === "Processed" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Shipped")}
                            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:shadow-sm cursor-pointer transition-all flex-grow whitespace-nowrap"
                          >
                            Mark Shipped
                          </button>
                        )}
                        {selectedOrder.status === "Shipped" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Delivered")}
                            className="bg-[#7AC620] hover:bg-[#5a9a18] text-white font-semibold px-4 py-2.5 rounded-xl hover:shadow-sm cursor-pointer transition-all flex-grow whitespace-nowrap"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-muted p-10 space-y-4">
                  <Eye className="w-12 h-12 text-muted/30" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">No Order Selected</h4>
                    <p className="text-xs text-muted font-light mt-1">
                      Click any customer order logged on the left to reveal customer parameters, invoice listings, and dispatch status tags.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* ════════════════════════════════════════════════
          EDIT PRODUCT MODAL / DRAWER
          ════════════════════════════════════════════════ */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-fade-in">
          <div className="bg-card border border-border/80 max-w-lg w-full rounded-[2.5rem] overflow-hidden shadow-2xl relative p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto scrollbar-thin">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-1.5">
                <Edit2 className="w-4 h-4 text-primary" /> Modify Product Details
              </h3>
              <button 
                onClick={() => setEditingProduct(null)}
                className="bg-accent/40 hover:bg-accent border border-border/80 p-1.5 rounded-full text-foreground/80 hover:text-foreground cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleEditProductSubmit} className="space-y-5 text-sm">
              <div className="space-y-1.5">
                <label className="font-semibold text-sm text-foreground/70">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-sm text-foreground/70">Category *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground cursor-pointer"
                  >
                    <option value="soap">Soap Bar</option>
                    <option value="cream">Whipped Cream</option>
                    <option value="oil">Oil / Serum</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-sm text-foreground/70">Size / Volume *</label>
                  <input
                    type="text"
                    required
                    value={editSize}
                    onChange={(e) => setEditSize(e.target.value)}
                    className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-sm text-foreground/70">Price (₦) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 pl-8 text-sm focus:outline-none focus:border-primary text-foreground"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted text-sm">₦</span>
                  </div>
                </div>

                <div className="flex items-center justify-around gap-2 pt-6">
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold uppercase tracking-wider text-muted text-xs">
                    <input
                      type="checkbox"
                      checked={editIsBestSeller}
                      onChange={(e) => setEditIsBestSeller(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    Best Seller
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold uppercase tracking-wider text-muted text-xs">
                    <input
                      type="checkbox"
                      checked={editIsNew}
                      onChange={(e) => setEditIsNew(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    New Tag
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-sm text-foreground/70">Ingredients (comma separated)</label>
                <input
                  type="text"
                  value={editIngredientsText}
                  onChange={(e) => setEditIngredientsText(e.target.value)}
                  className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-sm text-foreground/70">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-background border border-border/85 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground resize-none"
                />
              </div>

              {/* Upload Image Section */}
              <div className="border border-dashed border-border/80 rounded-2xl p-4 bg-background/50 space-y-4">
                <div className="space-y-1.5">
                  <label className="font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-primary" /> Modify File Image (Firebase Storage)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="w-full text-xs text-muted file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:uppercase file:bg-primary/10 file:text-primary file:hover:bg-primary/20 file:cursor-pointer cursor-pointer"
                  />
                </div>

                <div className="flex items-center text-xs text-muted gap-2">
                  <div className="h-[1px] bg-border flex-grow" />
                  <span>OR PASTE URL LINK</span>
                  <div className="h-[1px] bg-border flex-grow" />
                </div>

                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={editImageUrl}
                    onChange={(e) => {
                      setEditImageUrl(e.target.value);
                      setEditImageFile(null); // clear file
                    }}
                    className="w-full bg-background border border-border/85 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>

                {editUploadProgress >= 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted font-bold">
                      <span>Uploading Image...</span>
                      <span>{editUploadProgress}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-1">
                      <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${editUploadProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-full border border-border bg-card text-foreground font-semibold py-3.5 rounded-full tracking-wider uppercase hover:bg-accent/40 cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-full tracking-wider uppercase hover:bg-primary/95 transition-all shadow-md shadow-primary/5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4.5 h-4.5" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          ARIA — FLOATING AI ADMIN ASSISTANT
          ════════════════════════════════════════════════ */}
      {user && (
        <>
          {/* Floating trigger button */}
          <button
            onClick={() => setAriaOpen((o) => !o)}
            aria-label="Open Aria AI Assistant"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-primary/60 cursor-pointer animate-glow-pulse"
            style={{ minHeight: 56, minWidth: 56 }}
          >
            {ariaOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </button>

          {/* Chat Panel */}
          {ariaOpen && (
            <div
              className="fixed bottom-24 right-6 z-50 w-[370px] max-w-[calc(100vw-24px)] bg-card border border-border/80 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-fade-in-scale"
              style={{ height: 560, maxHeight: "calc(100vh - 120px)" }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-[#141d0c] to-[#0a1005] border-b border-border/40 flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white leading-none">Aria</p>
                  <p className="text-xs text-[#7AC620] mt-0.5 font-light">Aruk AI Admin Assistant</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
                {ariaMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Hi, I&apos;m Aria! ✨</p>
                      <p className="text-sm text-muted mt-1 leading-relaxed max-w-[240px]">
                        Your AI business assistant. I can help with inventory, marketing copy, product descriptions, and more.
                      </p>
                    </div>
                    {/* Quick prompts */}
                    <div className="w-full space-y-2">
                      {[
                        "📦 Show inventory summary",
                        "✍️ Write a product description",
                        "📱 Draft an Instagram caption",
                        "📊 Analyse my orders",
                      ].map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => sendAriaMessage(prompt)}
                          className="w-full text-left text-sm text-foreground border border-border/80 rounded-xl px-3 py-2.5 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer leading-snug"
                          style={{ minHeight: 'auto' }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {ariaMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    } chat-bubble`}
                  >
                    {msg.role === "model" && (
                      <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ minWidth: 28 }}>
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-primary text-white rounded-tr-sm"
                          : "bg-accent border border-border/60 text-foreground rounded-tl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {ariaLoading && (
                  <div className="flex gap-2.5 flex-row chat-bubble">
                    <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ minWidth: 28 }}>
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="bg-accent border border-border/60 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="w-1.5 h-1.5 rounded-full bg-primary/60"
                          style={{ animation: `loaderDotBounce 1s ${delay}ms ease-in-out infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div ref={ariaEndRef} />
              </div>

              {/* Input area */}
              <div className="flex-shrink-0 border-t border-border/50 px-4 py-3 bg-card">
                {ariaMessages.length > 0 && (
                  <button
                    onClick={() => setAriaMessages([])}
                    className="text-xs text-muted hover:text-foreground mb-2 transition-colors cursor-pointer"
                    style={{ minHeight: 'auto', minWidth: 'auto' }}
                  >
                    Clear conversation
                  </button>
                )}
                <div className="flex items-end gap-2">
                  <textarea
                    ref={ariaInputRef}
                    rows={1}
                    value={ariaInput}
                    onChange={(e) => {
                      setAriaInput(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendAriaMessage();
                      }
                    }}
                    placeholder="Ask Aria anything…"
                    className="flex-1 bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground resize-none overflow-hidden leading-relaxed placeholder:text-muted"
                    style={{ minHeight: 40, maxHeight: 100 }}
                    disabled={ariaLoading}
                  />
                  <button
                    onClick={() => sendAriaMessage()}
                    disabled={ariaLoading || !ariaInput.trim()}
                    className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-primary/90 transition-all cursor-pointer shadow-md shadow-primary/20"
                    style={{ minHeight: 36, minWidth: 36 }}
                    aria-label="Send message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-muted mt-2 text-center">Powered by Google Gemini · Press Enter to send</p>
              </div>
            </div>
          )}
        </>
      )}

    </main>
  );
}




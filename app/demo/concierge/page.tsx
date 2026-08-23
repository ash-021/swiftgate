"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  X,
  ChevronRight,
  Clock,
  Check,
  ShoppingBag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "IN-ROOM DINING" | "AMENITIES" | "REQUESTS";
type Category = "All" | "Mains" | "Snacks" | "Beverages";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  prepMins: number;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROOM = "402";

const MENU_ITEMS: MenuItem[] = [
  {
    id: "club-sandwich",
    name: "Smoked Chicken Club Sandwich",
    description: "Toasted multigrain, grilled chicken, aged cheddar, crisp greens.",
    price: 350,
    category: "Mains",
    prepMins: 15,
  },
  {
    id: "paneer-paratha",
    name: "Paneer Tikka and Paratha",
    description: "Charred cottage cheese in aromatic spices, whole wheat paratha.",
    price: 420,
    category: "Mains",
    prepMins: 20,
  },
  {
    id: "falafel-roll",
    name: "Crispy Falafel Roll",
    description: "Herb falafel, tahini, pickled vegetables in a toasted wrap.",
    price: 280,
    category: "Snacks",
    prepMins: 12,
  },
  {
    id: "cold-brew",
    name: "Artisanal Cold Brew",
    description: "Single-origin 16-hour slow steep, served over ice.",
    price: 180,
    category: "Beverages",
    prepMins: 5,
  },
  {
    id: "fresh-juice",
    name: "Seasonal Fresh Juice",
    description: "Cold-pressed blend of the day, no added sugar.",
    price: 140,
    category: "Beverages",
    prepMins: 5,
  },
  {
    id: "mezze-plate",
    name: "Mezze Sharing Plate",
    description: "Hummus, baba ganoush, olives, toasted pita, and accompaniments.",
    price: 380,
    category: "Snacks",
    prepMins: 10,
  },
];

const AMENITIES = [
  { label: "Swimming Pool", detail: "6:00 AM to 10:00 PM, Level B1" },
  { label: "Fitness Centre", detail: "Open 24 hours, Level 2" },
  { label: "Business Lounge", detail: "7:00 AM to 9:00 PM, Level 3" },
  { label: "Spa and Wellness", detail: "9:00 AM to 8:00 PM, Level B2" },
  { label: "Rooftop Bar", detail: "5:00 PM to 11:00 PM, Level 18" },
];

const REQUESTS = [
  { id: "towels", label: "Extra Towels", detail: "2 additional bath towels" },
  { id: "pillow", label: "Extra Pillows", detail: "Hypoallergenic memory foam" },
  { id: "iron", label: "Iron and Board", detail: "Delivered within 15 minutes" },
  { id: "turndown", label: "Turndown Service", detail: "Evening room preparation" },
  { id: "dnd", label: "Do Not Disturb", detail: "Block housekeeping for the day" },
];

const CATEGORIES: Category[] = ["All", "Mains", "Snacks", "Beverages"];
const TABS: Tab[] = ["IN-ROOM DINING", "AMENITIES", "REQUESTS"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest text-neutral-500">{children}</p>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ConciergePage() {
  const [activeTab, setActiveTab] = useState<Tab>("IN-ROOM DINING");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());

  // ─── Cart helpers ─────────────────────────────────────────────────────────

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const found = prev.find((ci) => ci.item.id === item.id);
      if (found) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => (ci.item.id === id ? { ...ci, quantity: ci.quantity + delta } : ci))
        .filter((ci) => ci.quantity > 0)
    );
  };

  const cartCount = cart.reduce((a, c) => a + c.quantity, 0);
  const cartTotal = cart.reduce((a, c) => a + c.item.price * c.quantity, 0);

  const qtyFor = (id: string) =>
    cart.find((ci) => ci.item.id === id)?.quantity ?? 0;

  const placeOrder = () => {
    setOrderPlaced(true);
    setCart([]);
    setCartOpen(false);
  };

  const toggleRequest = (id: string) => {
    setRequestedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredMenu =
    activeCategory === "All"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((i) => i.category === activeCategory);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-md min-h-screen flex flex-col border-x border-[0.5px] border-neutral-800 relative overflow-hidden">

        {/* Header */}
        <header className="px-6 py-5 border-b border-[0.5px] border-neutral-800 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <Eyebrow>SwiftGate Concierge</Eyebrow>
              <p className="text-xs font-semibold text-white mt-0.5 tracking-wide">
                ROOM {ROOM} &mdash; ACTIVE
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                Live
              </span>
            </div>
          </div>

          {/* Tab navigation */}
          <nav className="flex gap-5 mt-5">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setOrderPlaced(false);
                }}
                className={`text-[10px] uppercase tracking-widest pb-1.5 transition-colors ${
                  activeTab === tab
                    ? "text-white border-b border-white"
                    : "text-neutral-600 hover:text-neutral-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        {/* Body */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">

            {/* ── IN-ROOM DINING ───────────────────────────────────────── */}
            {activeTab === "IN-ROOM DINING" && (
              <motion.div
                key="dining"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Category filters */}
                <div className="px-6 py-4 flex gap-3 border-b border-[0.5px] border-neutral-800 shrink-0">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-[10px] uppercase tracking-widest transition-colors ${
                        activeCategory === cat
                          ? "text-white"
                          : "text-neutral-600 hover:text-neutral-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Order success banner */}
                <AnimatePresence>
                  {orderPlaced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden shrink-0"
                    >
                      <div className="mx-6 mt-4 border border-[0.5px] border-neutral-700 rounded-sm px-4 py-3 flex items-center gap-3">
                        <Check className="w-4 h-4 text-white shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-white">
                            Order transmitted to Kitchen Display System.
                          </p>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            Estimated delivery to Room {ROOM}: 18 minutes.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Menu rows */}
                <div className="flex-1 overflow-y-auto pb-24">
                  {filteredMenu.map((item, i) => {
                    const qty = qtyFor(item.id);
                    return (
                      <div key={item.id}>
                        <div className="px-6 py-4 flex items-start justify-between gap-4">
                          {/* Left: item info */}
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <p className="text-sm font-medium text-white">{item.name}</p>
                            <p className="text-[11px] text-neutral-500 leading-relaxed">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-3 pt-1">
                              <span className="text-xs font-semibold text-white font-mono">
                                Rs.{item.price}
                              </span>
                              <span className="text-[11px] text-neutral-700 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.prepMins}m
                              </span>
                            </div>
                          </div>

                          {/* Right: qty control */}
                          <div className="shrink-0 flex items-center">
                            {qty === 0 ? (
                              <button
                                onClick={() => addToCart(item)}
                                className="w-8 h-8 border border-[0.5px] border-neutral-700 hover:border-white flex items-center justify-center text-neutral-400 hover:text-white transition-colors rounded-none"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQty(item.id, -1)}
                                  className="w-7 h-7 border border-[0.5px] border-neutral-800 hover:border-neutral-600 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-semibold text-white w-4 text-center">
                                  {qty}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="w-7 h-7 border border-[0.5px] border-neutral-800 hover:border-neutral-600 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {i < filteredMenu.length - 1 && (
                          <div className="border-t border-[0.5px] border-neutral-900 mx-6" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Sticky cart bar */}
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 60, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 36 }}
                      className="absolute bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-4"
                    >
                      <button
                        onClick={() => setCartOpen(true)}
                        className="w-full bg-white hover:bg-neutral-200 text-black font-semibold text-sm py-3.5 flex items-center justify-between px-5 transition-colors rounded-none"
                      >
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          <span>View Order</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">Rs.{cartTotal}</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── AMENITIES ────────────────────────────────────────────── */}
            {activeTab === "AMENITIES" && (
              <motion.div
                key="amenities"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex-1 overflow-y-auto"
              >
                {AMENITIES.map((a, i) => (
                  <div key={a.label}>
                    <div className="px-6 py-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-white">{a.label}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{a.detail}</p>
                      </div>
                    </div>
                    {i < AMENITIES.length - 1 && (
                      <div className="border-t border-[0.5px] border-neutral-900 mx-6" />
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* ── REQUESTS ─────────────────────────────────────────────── */}
            {activeTab === "REQUESTS" && (
              <motion.div
                key="requests"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex-1 overflow-y-auto"
              >
                <div className="px-6 pt-5 pb-2">
                  <Eyebrow>Housekeeping &amp; In-Room Requests</Eyebrow>
                </div>
                {REQUESTS.map((req, i) => {
                  const isOn = requestedIds.has(req.id);
                  return (
                    <div key={req.id}>
                      <button
                        onClick={() => toggleRequest(req.id)}
                        className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-neutral-950 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{req.label}</p>
                          <p className="text-[11px] text-neutral-500 mt-0.5">{req.detail}</p>
                        </div>
                        <div
                          className={`w-8 h-4 rounded-full shrink-0 flex items-center transition-colors px-0.5 ${
                            isOn ? "bg-white" : "bg-neutral-800"
                          }`}
                        >
                          <motion.div
                            animate={{ x: isOn ? 16 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={`w-3 h-3 rounded-full ${
                              isOn ? "bg-black" : "bg-neutral-600"
                            }`}
                          />
                        </div>
                      </button>
                      {i < REQUESTS.length - 1 && (
                        <div className="border-t border-[0.5px] border-neutral-900 mx-6" />
                      )}
                    </div>
                  );
                })}

                {requestedIds.size > 0 && (
                  <div className="px-6 pt-4 pb-8">
                    <button
                      onClick={() => {
                        setRequestedIds(new Set());
                      }}
                      className="w-full bg-white hover:bg-neutral-200 text-black font-semibold text-sm py-3.5 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Submit {requestedIds.size} Request
                      {requestedIds.size > 1 ? "s" : ""}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Cart Drawer ───────────────────────────────────────────────────── */}
        <AnimatePresence>
          {cartOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 z-50 flex flex-col justify-end"
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 38 }}
                className="bg-neutral-950 border-t border-[0.5px] border-neutral-800 max-h-[80vh] overflow-y-auto"
              >
                {/* Drawer handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-8 h-0.5 bg-neutral-700" />
                </div>

                <div className="px-6 pb-7 space-y-5">
                  {/* Drawer header */}
                  <div className="flex items-center justify-between border-b border-[0.5px] border-neutral-800 pb-4">
                    <div>
                      <Eyebrow>Order Summary</Eyebrow>
                      <p className="text-sm font-semibold text-white mt-0.5">
                        Room {ROOM}
                      </p>
                    </div>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="text-neutral-600 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Line items */}
                  <div className="space-y-4">
                    {cart.map((ci) => (
                      <div
                        key={ci.item.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            {ci.item.name}
                          </p>
                          <p className="text-[11px] text-neutral-600 font-mono mt-0.5">
                            Rs.{ci.item.price} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => updateQty(ci.item.id, -1)}
                            className="w-6 h-6 border border-[0.5px] border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-semibold text-white w-4 text-center">
                            {ci.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(ci.item)}
                            className="w-6 h-6 border border-[0.5px] border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-mono text-white ml-2 w-12 text-right">
                            Rs.{ci.item.price * ci.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total row */}
                  <div className="border-t border-[0.5px] border-neutral-800 pt-4 flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                      Total
                    </span>
                    <span className="text-sm font-semibold font-mono text-white">
                      Rs.{cartTotal}
                    </span>
                  </div>

                  {/* Billing note */}
                  <div className="border border-[0.5px] border-neutral-800 rounded-none px-4 py-3">
                    <p className="text-[11px] text-neutral-500">
                      Billed to{" "}
                      <span className="text-white font-medium">Room {ROOM}</span> folio
                      upon delivery. No pre-payment required.
                    </p>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={placeOrder}
                    className="w-full bg-white hover:bg-neutral-200 text-black font-semibold text-sm py-3.5 flex items-center justify-center gap-2 transition-colors"
                  >
                    Charge to Room {ROOM}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  Heart,
  Grid3X3,
  List,
  Sparkles,
  RotateCcw,
  Stethoscope,
  HeartPulse,
  Brain,
  Activity,
  ScanFace,
  Baby,
  Eye,
  ShieldCheck,
  Zap,
  Calendar,
  Clock,
  Video,
  ChevronDown
} from "lucide-react";
import { doctors as defaultDoctors, Doctor, categories, money } from "@/lib/doctors";
import { getExtraDoctors, getFavorites } from "@/lib/storage";
import { DoctorCard } from "@/components/doctor-card";
import { Button } from "@/components/ui/button";

const specialtyIcons: Record<string, React.ElementType> = {
  All: Stethoscope,
  Cardiology: HeartPulse,
  Neurology: Brain,
  Orthopedic: Activity,
  Dermatology: ScanFace,
  Pediatrics: Baby,
  "General Medicine": ShieldCheck,
  Ophthalmology: Eye,
  Gynecology: Sparkles,
};

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DoctorsPage() {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>(defaultDoctors);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedShift, setSelectedShift] = useState("All");
  const [selectedDay, setSelectedDay] = useState("All");
  const [feeRange, setFeeRange] = useState<"All" | "under-2000" | "2000-2500" | "above-2500">("All");
  const [selectedGender, setSelectedGender] = useState<"All" | "Male" | "Female">("All");
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [onlyVideoConsult, setOnlyVideoConsult] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "experience" | "fee-asc" | "fee-desc">("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    // Load extra doctors added by admin and favorites
    setAllDoctors([...defaultDoctors, ...getExtraDoctors()]);
    setFavorites(getFavorites());

    const handleFav = () => setFavorites(getFavorites());
    window.addEventListener("mehr-favorites-change", handleFav);
    return () => window.removeEventListener("mehr-favorites-change", handleFav);
  }, []);

  // Filter logic
  const filteredDoctors = useMemo(() => {
    return allDoctors
      .filter((doc) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = doc.name.toLowerCase().includes(q);
          const matchSpec = doc.specialty.toLowerCase().includes(q);
          const matchCat = doc.category.toLowerCase().includes(q);
          const matchQual = doc.qualification?.toLowerCase().includes(q) || false;
          const matchServices = doc.services?.some((s) => s.toLowerCase().includes(q)) || false;
          if (!matchName && !matchSpec && !matchCat && !matchQual && !matchServices) {
            return false;
          }
        }

        // Category
        if (selectedCategory !== "All" && doc.category !== selectedCategory) {
          return false;
        }

        // Shift
        if (selectedShift !== "All" && doc.shift !== selectedShift) {
          return false;
        }

        // Day of week
        if (selectedDay !== "All" && !doc.days.includes(selectedDay)) {
          return false;
        }

        // Fee range
        if (feeRange === "under-2000" && doc.fee >= 2000) return false;
        if (feeRange === "2000-2500" && (doc.fee < 2000 || doc.fee > 2500)) return false;
        if (feeRange === "above-2500" && doc.fee <= 2500) return false;

        // Gender
        if (selectedGender !== "All" && doc.gender !== selectedGender) {
          return false;
        }

        // Available today
        if (onlyAvailableToday && !doc.isAvailableToday) {
          return false;
        }

        // Video consult
        if (onlyVideoConsult && !doc.consultationType?.includes("Video Consultation")) {
          return false;
        }

        // Favorites
        if (onlyFavorites && !favorites.includes(doc.id)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "experience") return (b.experienceYears || 0) - (a.experienceYears || 0);
        if (sortBy === "fee-asc") return a.fee - b.fee;
        if (sortBy === "fee-desc") return b.fee - a.fee;
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [
    allDoctors,
    searchQuery,
    selectedCategory,
    selectedShift,
    selectedDay,
    feeRange,
    selectedGender,
    onlyAvailableToday,
    onlyVideoConsult,
    onlyFavorites,
    favorites,
    sortBy,
  ]);

  // Count active filters
  const activeFiltersCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedShift !== "All" ? 1 : 0) +
    (selectedDay !== "All" ? 1 : 0) +
    (feeRange !== "All" ? 1 : 0) +
    (selectedGender !== "All" ? 1 : 0) +
    (onlyAvailableToday ? 1 : 0) +
    (onlyVideoConsult ? 1 : 0) +
    (onlyFavorites ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedShift("All");
    setSelectedDay("All");
    setFeeRange("All");
    setSelectedGender("All");
    setOnlyAvailableToday(false);
    setOnlyVideoConsult(false);
    setOnlyFavorites(false);
    setSortBy("recommended");
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-white">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0B1528] to-[#070D18] py-16">
        <div className="pointer-events-none absolute -top-40 right-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-lime-500/10 blur-3xl" />

        <div className="container-page relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-bold text-cyan-300 backdrop-blur-md">
              <Sparkles size={14} className="text-lime-400" />
              Verified Specialists & OPD Directory
            </span>

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">Trusted Doctor</span>
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-300">
              Filter by medical specialty, consultation fees, available shifts, and instant appointment timings. Book verified specialists with zero booking fees.
            </p>

            {/* Quick stats strip */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <strong>{allDoctors.filter((d) => d.isAvailableToday).length} Available Today</strong>
              </span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span><strong>8+ Specialties</strong> Covered</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Starting from <strong>PKR 1,400</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container-page py-10">
        {/* Search & Top Action Bar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-3.5 text-cyan-400" size={19} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, specialty, condition, or procedure..."
              className="w-full rounded-2xl border border-white/15 bg-white/[0.05] pl-11 pr-10 py-3 text-sm text-white placeholder-slate-400 backdrop-blur-md transition focus:border-cyan-400 focus:bg-white/[0.08] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3.5 top-3.5 rounded-full p-1 text-slate-400 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Quick Action Toggles & Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Available Today Pill */}
            <button
              onClick={() => setOnlyAvailableToday(!onlyAvailableToday)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition ${
                onlyAvailableToday
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/20"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${onlyAvailableToday ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
              Available Today
            </button>

            {/* Video Call Pill */}
            <button
              onClick={() => setOnlyVideoConsult(!onlyVideoConsult)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition ${
                onlyVideoConsult
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              <Video size={14} />
              Video Consult
            </button>

            {/* Favorites Pill */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition ${
                onlyFavorites
                  ? "border-rose-400 bg-rose-500/20 text-rose-300 shadow-lg shadow-rose-500/20"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              <Heart size={14} fill={onlyFavorites ? "currentColor" : "none"} />
              Saved ({favorites.length})
            </button>

            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2.5 text-xs font-bold text-white lg:hidden"
            >
              <SlidersHorizontal size={14} />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center rounded-xl border border-white/10 bg-white/[0.04] p-1">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "grid" ? "bg-cyan-400 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "list" ? "bg-cyan-400 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Specialty Category Pills (Horizontal Scrollable) */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = specialtyIcons[cat] || Stethoscope;
            const count = cat === "All" ? allDoctors.length : allDoctors.filter((d) => d.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-400/15 text-cyan-300 shadow-md shadow-cyan-400/20"
                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                <Icon size={15} className={isSelected ? "text-cyan-400" : "text-slate-400"} />
                <span>{cat}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    isSelected ? "bg-cyan-400 text-slate-950 font-black" : "bg-white/10 text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Layout: Sidebar Filter & Doctors Results */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Desktop Filter Sidebar & Mobile Drawer */}
          <aside
            className={`${
              mobileFilterOpen
                ? "fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto bg-[#0A1222] p-6 shadow-2xl"
                : "hidden lg:block"
            } space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={17} className="text-cyan-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">Filter Doctors</h3>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300"
                >
                  <RotateCcw size={12} />
                  Reset ({activeFiltersCount})
                </button>
              )}
              {mobileFilterOpen && (
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:text-white lg:hidden"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Shift Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Doctor Shift
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {["All", "Morning", "Evening"].map((shift) => (
                  <button
                    key={shift}
                    onClick={() => setSelectedShift(shift)}
                    className={`rounded-xl border py-2 text-xs font-bold transition ${
                      selectedShift === shift
                        ? "border-cyan-400 bg-cyan-400 text-slate-950"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
                    }`}
                  >
                    {shift}
                  </button>
                ))}
              </div>
            </div>

            {/* Working Day Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Working Day
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => setSelectedDay("All")}
                  className={`col-span-4 rounded-xl border py-1.5 text-xs font-bold transition ${
                    selectedDay === "All"
                      ? "border-cyan-400 bg-cyan-400 text-slate-950"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
                  }`}
                >
                  Any Day
                </button>
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`rounded-xl border py-2 text-xs font-bold transition ${
                      selectedDay === day
                        ? "border-lime-400 bg-lime-400 text-slate-950"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Fee / Budget Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Consultation Fee
              </label>
              <div className="space-y-1.5">
                {[
                  { id: "All", label: "All Fee Ranges" },
                  { id: "under-2000", label: "Under PKR 2,000" },
                  { id: "2000-2500", label: "PKR 2,000 – PKR 2,500" },
                  { id: "above-2500", label: "PKR 2,500 & Above" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setFeeRange(id as any)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs font-bold transition ${
                      feeRange === id
                        ? "border-cyan-400 bg-cyan-950/50 text-cyan-300"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
                    }`}
                  >
                    <span>{label}</span>
                    {feeRange === id && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Doctor Gender
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {["All", "Male", "Female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g as any)}
                    className={`rounded-xl border py-2 text-xs font-bold transition ${
                      selectedGender === g
                        ? "border-cyan-400 bg-cyan-400 text-slate-950"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Info Callout */}
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4 text-xs">
              <strong className="block text-cyan-300 mb-1">Need Urgent Care?</strong>
              <p className="text-slate-400 leading-relaxed">
                Emergency OPD is open 24/7 without prior appointment. Call our emergency response desk.
              </p>
              <a
                href="tel:+923001234567"
                className="mt-3 inline-flex items-center gap-1.5 font-bold text-lime-400 hover:underline"
              >
                +92 300 1234567 →
              </a>
            </div>
          </aside>

          {/* Results Area */}
          <main>
            {/* Header: Results Count + Sort + Active Tags */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-bold text-white">
                  Showing <strong className="text-cyan-400">{filteredDoctors.length}</strong> of {allDoctors.length} Specialists
                </p>
                {searchQuery && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Search results for &ldquo;{searchQuery}&rdquo;
                  </p>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none rounded-xl border border-white/15 bg-white/[0.06] pl-3 pr-8 py-2 text-xs font-bold text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                  >
                    <option value="recommended" className="bg-slate-900">Recommended</option>
                    <option value="rating" className="bg-slate-900">Highest Rated (★)</option>
                    <option value="experience" className="bg-slate-900">Most Experienced</option>
                    <option value="fee-asc" className="bg-slate-900">Fee: Low to High</option>
                    <option value="fee-desc" className="bg-slate-900">Fee: High to Low</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 text-slate-400" size={14} />
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">Active filters:</span>
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300">
                    Dept: {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")}><X size={12} /></button>
                  </span>
                )}
                {selectedShift !== "All" && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    Shift: {selectedShift}
                    <button onClick={() => setSelectedShift("All")}><X size={12} /></button>
                  </span>
                )}
                {selectedDay !== "All" && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-lime-400/40 bg-lime-950/40 px-3 py-1 text-xs font-semibold text-lime-300">
                    Day: {selectedDay}
                    <button onClick={() => setSelectedDay("All")}><X size={12} /></button>
                  </span>
                )}
                {feeRange !== "All" && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300">
                    Fee: {feeRange}
                    <button onClick={() => setFeeRange("All")}><X size={12} /></button>
                  </span>
                )}
                {onlyAvailableToday && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Available Today
                    <button onClick={() => setOnlyAvailableToday(false)}><X size={12} /></button>
                  </span>
                )}
                {onlyVideoConsult && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300">
                    Video Consultation
                    <button onClick={() => setOnlyVideoConsult(false)}><X size={12} /></button>
                  </span>
                )}
                {onlyFavorites && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/40 bg-rose-950/40 px-3 py-1 text-xs font-semibold text-rose-300">
                    Favorites
                    <button onClick={() => setOnlyFavorites(false)}><X size={12} /></button>
                  </span>
                )}
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-rose-400 hover:underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Doctor Cards Container */}
            <div className="mt-6">
              {filteredDoctors.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                      : "space-y-4"
                  }
                >
                  <AnimatePresence>
                    {filteredDoctors.map((doc) => (
                      <DoctorCard key={doc.id} doctor={doc} layout={viewMode} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                /* Empty State */
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center"
                >
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                    <Search size={32} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">No Specialists Found</h3>
                  <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
                    We could not find any doctors matching your specific filter criteria. Try adjusting the search term or resetting the filters.
                  </p>
                  <Button variant="lime" className="mt-6" onClick={resetAllFilters}>
                    <RotateCcw size={15} />
                    Reset All Filters
                  </Button>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

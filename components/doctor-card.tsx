"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  CalendarDays,
  ArrowRight,
  Star,
  Heart,
  Video,
  MapPin,
  Sparkles,
  Zap,
  CheckCircle2
} from "lucide-react";
import { Doctor, money } from "@/lib/doctors";
import { Button } from "@/components/ui/button";
import { QuickBookModal } from "@/components/quick-book-modal";
import { isFavorite, toggleFavorite } from "@/lib/storage";

type DoctorCardProps = {
  doctor: Doctor;
  layout?: "grid" | "list";
};

export function DoctorCard({ doctor, layout = "grid" }: DoctorCardProps) {
  const [favorite, setFavorite] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(doctor.id));
    const handleFavChange = () => setFavorite(isFavorite(doctor.id));
    window.addEventListener("mehr-favorites-change", handleFavChange);
    return () => window.removeEventListener("mehr-favorites-change", handleFavChange);
  }, [doctor.id]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = toggleFavorite(doctor.id);
    setFavorite(nextState);
  };

  const isList = layout === "list";

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0C1527] text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/10 ${
          isList ? "grid gap-6 md:grid-cols-[260px_1fr] items-center p-5" : "flex flex-col"
        }`}
      >
        {/* Glow ambient accent behind card on hover */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl transition-opacity group-hover:opacity-100" />

        {/* Doctor Image Container */}
        <div
          className={`relative overflow-hidden bg-slate-900 ${
            isList ? "h-56 md:h-full w-full rounded-2xl" : "h-64 w-full"
          }`}
        >
          <img
            src={doctor.image}
            alt={`${doctor.name} - ${doctor.specialty}`}
            className="h-full w-full object-cover object-top transition duration-700 ease-out group-hover:scale-108"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C1527] via-transparent to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            {doctor.badge ? (
              <span className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-cyan-300/40 bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-cyan-300 backdrop-blur-md shadow">
                <Sparkles size={11} className="text-cyan-300" />
                {doctor.badge}
              </span>
            ) : (
              <span className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-slate-200 backdrop-blur-md">
                {doctor.experience} exp
              </span>
            )}

            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              aria-label={favorite ? "Remove from saved" : "Save doctor"}
              className={`pointer-events-auto grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition active:scale-90 ${
                favorite
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40"
                  : "bg-slate-950/70 text-slate-300 hover:bg-slate-950 hover:text-rose-400"
              }`}
            >
              <Heart size={15} fill={favorite ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Bottom Overlay Info on Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/85 px-3 py-1 font-bold text-emerald-400 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              {doctor.isAvailableToday ? "Available Today" : "Next Slot Tomorrow"}
            </span>

            <div className="inline-flex items-center gap-1 rounded-full bg-slate-950/85 px-2.5 py-1 font-black text-amber-300 backdrop-blur-md">
              <Star size={12} fill="#FCD34D" className="text-amber-400" />
              <span>{doctor.rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400 font-normal">({doctor.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Doctor Content */}
        <div className={`flex flex-1 flex-col ${isList ? "p-2" : "p-5"}`}>
          {/* Category & Shift */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
              {doctor.category}
            </span>
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-300">
              {doctor.shift}
            </span>
          </div>

          {/* Name & Specialty */}
          <Link href={`/doctors/${doctor.id}`} className="mt-2 block group-hover:text-cyan-300 transition-colors">
            <h3 className="text-lg font-black tracking-tight">{doctor.name}</h3>
          </Link>
          <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{doctor.specialty}</p>

          <p className="mt-2 text-[11px] text-slate-400 line-clamp-1">
            {doctor.qualification}
          </p>

          {/* Timings & Days */}
          <div className="mt-3.5 space-y-1.5 border-t border-white/5 pt-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock size={13} className="text-cyan-400 shrink-0" />
              <span className="truncate">{doctor.timing}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <CalendarDays size={13} className="text-lime-400 shrink-0" />
              <span className="truncate">{doctor.days.join(", ")}</span>
            </div>
          </div>

          {/* Quick Slots Pill Preview */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {doctor.slots.slice(0, 3).map((slot) => (
              <span
                key={slot}
                className="rounded-lg border border-cyan-500/20 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-semibold text-cyan-300"
              >
                {slot}
              </span>
            ))}
            {doctor.slots.length > 3 && (
              <span className="rounded-lg border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400">
                +{doctor.slots.length - 3}
              </span>
            )}
          </div>

          {/* Footer Card: Price & Interactive Buttons */}
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Consultation</span>
              <b className="text-base font-black text-lime-400">{money(doctor.fee)}</b>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="lime"
                size="sm"
                onClick={() => setModalOpen(true)}
                title="Instant appointment booking"
              >
                <Zap size={13} />
                Quick Book
              </Button>

              <Link href={`/doctors/${doctor.id}`}>
                <Button variant="outline" size="sm" title="View complete doctor profile">
                  Profile
                  <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Quick Book Modal */}
      <QuickBookModal
        doctor={doctor}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

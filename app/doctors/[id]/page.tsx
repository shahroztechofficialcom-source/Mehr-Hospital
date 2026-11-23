"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Heart,
  Share2,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Sparkles,
  PhoneCall,
  Video,
  Award,
  Stethoscope,
  Send,
  Zap
} from "lucide-react";
import { doctors as defaultDoctors, money, Doctor } from "@/lib/doctors";
import { getExtraDoctors, getAppointments, saveAppointments, Appointment, getSession, isFavorite, toggleFavorite } from "@/lib/storage";
import { Button } from "@/components/ui/button";

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [allDoctors, setAllDoctors] = useState<Doctor[]>(defaultDoctors);
  const [favorite, setFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "services" | "schedule" | "reviews">("about");

  // Booking widget states
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [consultType, setConsultType] = useState<"In-Person" | "Video Consultation">("In-Person");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [tokenNumber, setTokenNumber] = useState("");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const combined = [...defaultDoctors, ...getExtraDoctors()];
    setAllDoctors(combined);
    if (id) {
      setFavorite(isFavorite(id));
      const todayStr = new Date().toISOString().slice(0, 10);
      setDate(todayStr);

      const user = getSession();
      if (user) {
        setPatientName(user.name);
        setPatientEmail(user.email);
        if (user.phone) setPatientPhone(user.phone);
      }
    }
  }, [id]);

  const doctor = allDoctors.find((x) => x.id === id);

  useEffect(() => {
    if (id && date) {
      const appts = getAppointments();
      const booked = appts
        .filter((a) => a.doctorId === id && a.date === date && !["Cancelled", "Rejected"].includes(a.status))
        .map((a) => a.slot);
      setBookedSlots(booked);
    }
  }, [id, date]);

  if (!doctor) {
    return (
      <div className="container-page py-24 text-center text-white">
        <h2 className="text-2xl font-black">Specialist Doctor Not Found</h2>
        <p className="mt-3 text-slate-400">The requested doctor profile does not exist or has been removed.</p>
        <Link href="/doctors" className="mt-6 inline-block">
          <Button variant="lime">← Return to Doctor Directory</Button>
        </Link>
      </div>
    );
  }

  const dayOfWeek = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" })
    : "";
  const isAvailableDay = doctor.days.includes(dayOfWeek);

  const handleToggleFavorite = () => {
    const next = toggleFavorite(doctor.id);
    setFavorite(next);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");

    if (!isAvailableDay) {
      setBookingError(`${doctor.name} is not available on ${dayOfWeek}s. Working days: ${doctor.days.join(", ")}.`);
      return;
    }
    if (!selectedSlot) {
      setBookingError("Please select an available time slot.");
      return;
    }

    const apptNum = `MHR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      appointmentNumber: apptNum,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      patientName,
      patientEmail,
      patientPhone,
      consultationType: consultType,
      date,
      slot: selectedSlot,
      fee: doctor.fee,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    saveAppointments([...getAppointments(), newAppointment]);
    setTokenNumber(apptNum);
    setBookingSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-white py-10">
      <div className="container-page">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <ArrowLeft size={16} /> Back to All Specialists
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
            >
              <Share2 size={13} />
              {copied ? "Link Copied!" : "Share Profile"}
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                favorite
                  ? "border-rose-400 bg-rose-500/20 text-rose-300"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Heart size={13} fill={favorite ? "currentColor" : "none"} />
              {favorite ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Main Grid: Doctor Profile & Booking Widget */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Doctor Profile & Tabs */}
          <div className="space-y-6">
            {/* Doctor Bio Card */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0C1527] shadow-xl">
              <div className="grid sm:grid-cols-[240px_1fr]">
                {/* Photo */}
                <div className="relative h-64 sm:h-full bg-slate-900">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1527] via-transparent to-transparent sm:hidden" />
                </div>

                {/* Details */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-bold text-cyan-300">
                      {doctor.category}
                    </span>
                    {doctor.badge && (
                      <span className="rounded-full bg-lime-400/15 px-3 py-1 text-xs font-bold text-lime-300">
                        {doctor.badge}
                      </span>
                    )}
                  </div>

                  <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">{doctor.name}</h1>
                  <p className="text-sm font-semibold text-cyan-300 mt-1">{doctor.specialty}</p>

                  <p className="mt-3 text-xs leading-relaxed text-slate-300 font-medium">
                    {doctor.qualification}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <Star size={14} fill="#FCD34D" /> {doctor.rating.toFixed(1)} ({doctor.reviewsCount} reviews)
                    </span>
                    <span>•</span>
                    <span className="text-slate-300 font-bold">{doctor.experience} experience</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 size={13} /> PMDC Verified
                    </span>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4 text-xs text-slate-300 space-y-1.5">
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-lime-400 shrink-0" />
                      <span>{doctor.opdRoom}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={14} className="text-cyan-400 shrink-0" />
                      <span>{doctor.shift} Shift ({doctor.timing}) • {doctor.days.join(", ")}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="rounded-3xl border border-white/10 bg-[#0C1527] p-6 shadow-xl">
              {/* Tab Navigation */}
              <div className="flex border-b border-white/10 pb-3 gap-2 overflow-x-auto scrollbar-none">
                {[
                  { id: "about", label: "About Doctor" },
                  { id: "services", label: "Procedures & Care" },
                  { id: "schedule", label: "OPD Schedule" },
                  { id: "reviews", label: "Patient Reviews" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeTab === t.id
                        ? "bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-400/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="mt-6 text-sm">
                {activeTab === "about" && (
                  <div className="space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed">
                    <h3 className="text-base font-bold text-white">Clinical Background</h3>
                    <p>{doctor.about}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 rounded-2xl bg-white/[0.03] p-4 border border-white/5">
                      <div>
                        <strong className="block text-white text-xs">Consultation Languages:</strong>
                        <span className="text-slate-400 text-xs">{doctor.languages.join(", ")}</span>
                      </div>
                      <div>
                        <strong className="block text-white text-xs">Available Modes:</strong>
                        <span className="text-slate-400 text-xs">In-Hospital OPD & Video Call</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "services" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-white">Procedures & Specializations</h3>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {doctor.services.map((service) => (
                        <div
                          key={service}
                          className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs font-semibold text-slate-200"
                        >
                          <CheckCircle2 size={15} className="text-cyan-400 shrink-0" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "schedule" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-white">Working Days & Shift Timings</h3>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs space-y-3">
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-slate-400">Regular Shift:</span>
                        <strong className="text-cyan-300">{doctor.shift} ({doctor.timing})</strong>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-slate-400">Working Days:</span>
                        <strong className="text-white">{doctor.days.join(", ")}</strong>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-400">OPD Location:</span>
                        <strong className="text-lime-400">{doctor.opdRoom}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">Patient Ratings</h3>
                      <div className="flex items-center gap-1 text-amber-300 font-bold">
                        <Star size={16} fill="currentColor" /> {doctor.rating} / 5.0
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          user: "Sohail Farooq",
                          date: "2 days ago",
                          rating: 5,
                          text: "Exceptional clinical experience. Dr. listened attentively and prescribed the most accurate treatment.",
                        },
                        {
                          user: "Noreen Akhtar",
                          date: "1 week ago",
                          rating: 5,
                          text: "Very polite, highly knowledgeable, and the staff at Mehr Hospital managed our token smoothly.",
                        },
                      ].map((rev, i) => (
                        <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <strong className="text-white">{rev.user}</strong>
                            <span className="text-slate-500">{rev.date}</span>
                          </div>
                          <div className="flex text-amber-400 gap-0.5">
                            {Array.from({ length: rev.rating }).map((_, r) => (
                              <Star key={r} size={12} fill="currentColor" />
                            ))}
                          </div>
                          <p className="text-slate-300 pt-1">{rev.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Widget */}
          <div className="h-fit rounded-3xl border border-cyan-400/30 bg-[#0C1527] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Direct OPD Scheduling
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">Book Consultation</h2>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Fee</span>
                <b className="text-xl font-black text-lime-400">{money(doctor.fee)}</b>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-black text-white">Booking Confirmed!</h3>
                <p className="text-xs text-slate-300">
                  Appointment Token: <strong className="text-cyan-300">{tokenNumber}</strong>
                </p>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left text-xs space-y-2">
                  <p><span className="text-slate-400">Doctor:</span> {doctor.name}</p>
                  <p><span className="text-slate-400">Date & Slot:</span> {date} at {selectedSlot}</p>
                  <p><span className="text-slate-400">Consultation:</span> {consultType}</p>
                  <p><span className="text-slate-400">Patient:</span> {patientName}</p>
                  <p><span className="text-slate-400">Room:</span> {doctor.opdRoom}</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <Button variant="lime" size="sm" onClick={() => setBookingSuccess(false)}>
                    Book Another Slot
                  </Button>
                  <Link href="/patient">
                    <Button variant="outline" size="sm">
                      View in Patient Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="mt-5 space-y-4">
                {/* Consultation Mode */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Consultation Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultType("In-Person")}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                        consultType === "In-Person"
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                          : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <MapPin size={14} /> Hospital OPD
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultType("Video Consultation")}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                        consultType === "Video Consultation"
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                          : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <Video size={14} /> Video Call
                    </button>
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().slice(0, 10)}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setSelectedSlot("");
                    }}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                  {date && (
                    <p className={`mt-1 text-[11px] ${isAvailableDay ? "text-emerald-400" : "text-rose-400"}`}>
                      {isAvailableDay
                        ? `✓ Available on ${dayOfWeek} (${doctor.timing})`
                        : `✗ Not available on ${dayOfWeek}. Working days: ${doctor.days.join(", ")}`}
                    </p>
                  )}
                </div>

                {/* Slot Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Select Time Slot</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {doctor.slots.map((s) => {
                      const isBooked = bookedSlots.includes(s);
                      const isSelected = selectedSlot === s;
                      return (
                        <button
                          type="button"
                          key={s}
                          disabled={!isAvailableDay || isBooked}
                          onClick={() => setSelectedSlot(s)}
                          className={`rounded-xl border p-2 text-xs font-bold transition ${
                            isSelected
                              ? "border-cyan-400 bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-400/30"
                              : isBooked
                              ? "border-white/5 bg-white/5 text-slate-500 line-through opacity-50 cursor-not-allowed"
                              : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/50 hover:bg-white/10"
                          }`}
                        >
                          {s}
                          {isBooked ? " (Booked)" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Patient Info */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Patient Full Name</label>
                    <input
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Ali Ahmed"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Phone</label>
                      <input
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {bookingError && (
                  <p className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                    {bookingError}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="lime"
                  className="w-full py-3 mt-2"
                  disabled={!isAvailableDay || !selectedSlot}
                >
                  <Zap size={16} /> Confirm Appointment Now
                </Button>

                <p className="text-[11px] text-center text-slate-400 pt-1">
                  Pay consultation fee of <strong>{money(doctor.fee)}</strong> at the hospital reception.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

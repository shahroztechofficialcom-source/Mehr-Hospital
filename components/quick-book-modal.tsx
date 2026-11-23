"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, CheckCircle2, User, Mail, Phone, Sparkles, MapPin, Video, Stethoscope } from "lucide-react";
import { Doctor, money } from "@/lib/doctors";
import { getAppointments, saveAppointments, Appointment, getSession } from "@/lib/storage";
import { Button } from "./ui/button";

type QuickBookModalProps = {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
};

export function QuickBookModal({ doctor, isOpen, onClose }: QuickBookModalProps) {
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [consultType, setConsultType] = useState<"In-Person" | "Video Consultation">("In-Person");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedApptId, setBookedApptId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      const user = getSession();
      if (user) {
        setPatientName(user.name);
        setPatientEmail(user.email);
        if (user.phone) setPatientPhone(user.phone);
      }
      // Set default date to today or tomorrow
      const todayStr = new Date().toISOString().slice(0, 10);
      setDate(todayStr);
      setSlot("");
      setIsSuccess(false);
      setErrorMsg("");
    }
  }, [isOpen, doctor]);

  useEffect(() => {
    if (doctor && date) {
      const appts = getAppointments();
      const booked = appts
        .filter(
          (a) =>
            a.doctorId === doctor.id &&
            a.date === date &&
            !["Cancelled", "Rejected"].includes(a.status)
        )
        .map((a) => a.slot);
      setBookedSlots(booked);
    }
  }, [doctor, date]);

  if (!isOpen || !doctor) return null;

  const dayOfWeek = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" })
    : "";
  const isWorkingDay = doctor.days.includes(dayOfWeek);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isWorkingDay) {
      setErrorMsg(`${doctor.name} is not available on ${dayOfWeek}s. Working days: ${doctor.days.join(", ")}.`);
      return;
    }
    if (!slot) {
      setErrorMsg("Please select an available appointment time slot.");
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
      symptoms,
      date,
      slot,
      fee: doctor.fee,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const existing = getAppointments();
    saveAppointments([...existing, newAppointment]);
    setBookedApptId(apptNum);
    setIsSuccess(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.45 }}
          className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-[#0B1426] text-white shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0B1426]/95 px-6 py-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 text-slate-950">
                <Stethoscope size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">Quick Appointment Booking</h3>
                <p className="text-xs text-cyan-300">Fast-track consultation confirmation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-full border border-white/10 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
                  <CheckCircle2 size={44} />
                </div>
                <span className="mt-4 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  Confirmed Demo Booking
                </span>
                <h4 className="mt-3 text-2xl font-black">Appointment Booked Successfully!</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Reference Token: <strong className="text-cyan-300">{bookedApptId}</strong>
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left text-sm space-y-2">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Doctor:</span>
                    <strong className="text-white">{doctor.name} ({doctor.specialty})</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Date & Slot:</span>
                    <strong className="text-white">{date} at {slot}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Type:</span>
                    <strong className="text-cyan-300">{consultType}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Patient:</span>
                    <strong className="text-white">{patientName} ({patientEmail})</strong>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">Fee:</span>
                    <strong className="text-lime-400">{money(doctor.fee)}</strong>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Button variant="lime" onClick={onClose}>
                    Done
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onClose();
                      window.location.href = "/patient";
                    }}
                  >
                    View in Patient Portal
                  </Button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Doctor Brief Banner */}
                <div className="flex items-center gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-16 w-16 rounded-2xl object-cover border border-cyan-400/40"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base truncate">{doctor.name}</h4>
                      {doctor.badge && (
                        <span className="hidden sm:inline-block rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                          {doctor.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-cyan-300 truncate">{doctor.specialty}</p>
                    <p className="mt-1 text-xs text-slate-400 flex items-center gap-2">
                      <MapPin size={12} className="text-lime-400" /> {doctor.opdRoom} • <strong>{money(doctor.fee)}</strong>
                    </p>
                  </div>
                </div>

                {/* Consultation Type Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Consultation Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setConsultType("In-Person")}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                        consultType === "In-Person"
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                          : "border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]"
                      }`}
                    >
                      <MapPin size={15} /> In-Hospital Visit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultType("Video Consultation")}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                        consultType === "Video Consultation"
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                          : "border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]"
                      }`}
                    >
                      <Video size={15} /> Video Call
                    </button>
                  </div>
                </div>

                {/* Date & Slot selection */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">Select Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().slice(0, 10)}
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          setSlot("");
                        }}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    {date && (
                      <p className={`mt-1.5 text-xs ${isWorkingDay ? "text-emerald-400" : "text-rose-400"}`}>
                        {isWorkingDay
                          ? `✓ Available on ${dayOfWeek} (${doctor.timing})`
                          : `✗ Not available on ${dayOfWeek}. Working: ${doctor.days.join(", ")}`}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">Available Time Slot</label>
                    <div className="grid grid-cols-2 gap-2">
                      {doctor.slots.map((s) => {
                        const isBooked = bookedSlots.includes(s);
                        const isSelected = slot === s;
                        return (
                          <button
                            type="button"
                            key={s}
                            disabled={!isWorkingDay || isBooked}
                            onClick={() => setSlot(s)}
                            className={`rounded-xl border p-2 text-xs font-bold transition ${
                              isSelected
                                ? "border-cyan-400 bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30"
                                : isBooked
                                ? "border-white/5 bg-white/5 text-slate-500 line-through opacity-50 cursor-not-allowed"
                                : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-cyan-400/50 hover:bg-white/10"
                            }`}
                          >
                            <Clock size={12} className="inline mr-1" />
                            {s}
                            {isBooked ? " (Booked)" : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Patient Information Form */}
                <div className="space-y-3 pt-2">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Patient Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 text-slate-400" size={15} />
                        <input
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="e.g. Ali Ahmed"
                          className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 text-slate-400" size={15} />
                        <input
                          type="email"
                          required
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          placeholder="patient@example.com"
                          className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Phone / WhatsApp</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 text-slate-400" size={15} />
                        <input
                          required
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          placeholder="+92 300 1234567"
                          className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Reason / Symptoms (Optional)</label>
                      <input
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="e.g. Chest pain, Routine Checkup"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <p className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                    {errorMsg}
                  </p>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="text-xs text-slate-400">
                    Pay at Hospital Desk • <strong>{money(doctor.fee)}</strong>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="lime" size="sm" disabled={!isWorkingDay || !slot}>
                      Confirm Appointment
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

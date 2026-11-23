"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Video,
  ArrowRight,
  ArrowLeft,
  Search,
  Sparkles,
  Printer,
  Copy,
  Check,
  Stethoscope,
  ShieldCheck,
  FileText
} from "lucide-react";
import { doctors as defaultDoctors, money, Doctor } from "@/lib/doctors";
import {
  getAppointments,
  saveAppointments,
  Appointment,
  getSession,
  getExtraDoctors
} from "@/lib/storage";
import { Button } from "@/components/ui/button";

const steps = [
  { id: 1, label: "Specialist", desc: "Choose doctor" },
  { id: 2, label: "Schedule", desc: "Date & slot" },
  { id: 3, label: "Patient Info", desc: "Contact details" },
  { id: 4, label: "Confirmation", desc: "Pass & Token" },
];

export function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allDoctors, setAllDoctors] = useState<Doctor[]>(defaultDoctors);
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState(searchParams.get("doctor") || "");
  const [selectedDate, setSelectedDate] = useState(searchParams.get("date") || "");
  const [selectedSlot, setSelectedSlot] = useState(searchParams.get("slot") || "");
  const [consultType, setConsultType] = useState<"In-Person" | "Video Consultation">("In-Person");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientGender, setPatientGender] = useState<"Male" | "Female" | "Other">("Male");
  const [symptoms, setSymptoms] = useState("");

  // Doctor Filter in Step 1
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorCategory, setDoctorCategory] = useState("All");

  // Operational State
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null);
  const [errorNotice, setErrorNotice] = useState("");
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    setAllDoctors([...defaultDoctors, ...getExtraDoctors()]);
    const user = getSession();
    if (user) {
      setPatientName(user.name);
      setPatientEmail(user.email);
      if (user.phone) setPatientPhone(user.phone);
    }

    if (searchParams.get("doctor")) {
      setSelectedDoctorId(searchParams.get("doctor")!);
      if (searchParams.get("date") && searchParams.get("slot")) {
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
    }
  }, [searchParams]);

  const selectedDoctor = allDoctors.find((d) => d.id === selectedDoctorId);

  // Sync Booked Slots for Selected Doctor and Date
  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      const appts = getAppointments();
      const booked = appts
        .filter(
          (a) =>
            a.doctorId === selectedDoctorId &&
            a.date === selectedDate &&
            !["Cancelled", "Rejected"].includes(a.status)
        )
        .map((a) => a.slot);
      setBookedSlots(booked);
    }
  }, [selectedDoctorId, selectedDate]);

  const dayOfWeek = selectedDate
    ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" })
    : "";
  const isAvailableDay = selectedDoctor?.days.includes(dayOfWeek);

  // Doctors list for Step 1
  const filteredDoctors = allDoctors.filter((d) => {
    if (doctorCategory !== "All" && d.category !== doctorCategory) return false;
    if (doctorSearch.trim()) {
      const q = doctorSearch.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleNextToStep2 = (docId: string) => {
    setSelectedDoctorId(docId);
    setSelectedSlot("");
    if (!selectedDate) {
      setSelectedDate(new Date().toISOString().slice(0, 10));
    }
    setCurrentStep(2);
  };

  const handleNextToStep3 = () => {
    setErrorNotice("");
    if (!selectedDoctor) {
      setErrorNotice("Please select a doctor first.");
      return;
    }
    if (!isAvailableDay) {
      setErrorNotice(
        `${selectedDoctor.name} is not available on ${dayOfWeek}. Working days: ${selectedDoctor.days.join(
          ", "
        )}`
      );
      return;
    }
    if (!selectedSlot) {
      setErrorNotice("Please pick an available time slot.");
      return;
    }
    setCurrentStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice("");

    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      setErrorNotice("Please complete all steps before confirming.");
      return;
    }

    const apptNum = `MHR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      appointmentNumber: apptNum,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim().toLowerCase(),
      patientPhone: patientPhone.trim(),
      consultationType: consultType,
      symptoms: symptoms.trim(),
      date: selectedDate,
      slot: selectedSlot,
      fee: selectedDoctor.fee,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    saveAppointments([...getAppointments(), newAppointment]);
    setConfirmedAppt(newAppointment);
    setCurrentStep(4);
  };

  const copyAppointmentRef = () => {
    if (confirmedAppt?.appointmentNumber && navigator.clipboard) {
      navigator.clipboard.writeText(confirmedAppt.appointmentNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Wizard Step Progress Tracker */}
      <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {steps.map((st) => {
          const isDone = currentStep > st.id || currentStep === 4;
          const isCurrent = currentStep === st.id;

          return (
            <div
              key={st.id}
              className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
                isCurrent
                  ? "border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-lg shadow-cyan-500/10"
                  : isDone
                  ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                  : "border-white/10 bg-white/[0.03] text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-xs font-black ${
                    isCurrent
                      ? "bg-cyan-400 text-slate-950"
                      : isDone
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  {isDone ? "✓" : st.id}
                </span>
                <b className="text-xs font-bold text-white uppercase tracking-wider">{st.label}</b>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 hidden sm:block">{st.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Wizard Content Panels */}
      <div className="rounded-3xl border border-white/10 bg-[#0C1527] p-6 sm:p-9 shadow-2xl backdrop-blur-xl">
        {/* STEP 1: SELECT SPECIALIST DOCTOR */}
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <h2 className="text-xl font-black text-white">Step 1: Choose Your Doctor</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Browse by specialty department or search by doctor name.
                </p>
              </div>

              {/* Department Filter */}
              <div className="flex gap-2">
                <select
                  value={doctorCategory}
                  onChange={(e) => setDoctorCategory(e.target.value)}
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="All" className="bg-slate-900">All Departments</option>
                  {["Cardiology", "Neurology", "Orthopedic", "Dermatology", "Pediatrics", "General Medicine", "Ophthalmology", "Gynecology"].map((c) => (
                    <option key={c} value={c} className="bg-slate-900">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Doctor Search */}
            <div className="relative mt-4">
              <Search className="absolute left-3.5 top-3 text-cyan-400" size={17} />
              <input
                type="text"
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                placeholder="Search specialist name or condition..."
                className="w-full rounded-2xl border border-white/15 bg-white/5 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Doctors Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {filteredDoctors.map((doc) => {
                const isSelected = selectedDoctorId === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleNextToStep2(doc.id)}
                    className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-1 ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20"
                        : "border-white/10 bg-white/[0.03] hover:border-cyan-400/50 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="h-16 w-16 rounded-2xl object-cover border border-white/15"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                            {doc.category}
                          </span>
                          <span className="text-xs font-black text-lime-400">{money(doc.fee)}</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-white group-hover:text-cyan-300 transition truncate mt-0.5">
                          {doc.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">{doc.specialty}</p>
                        <p className="mt-1 text-[10px] text-slate-300">
                          {doc.shift} • {doc.days.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 2: SELECT DATE & TIME SLOT */}
        {currentStep === 2 && selectedDoctor && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="border-b border-white/10 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Step 2: Choose Date & Timing</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Consulting with <strong>{selectedDoctor.name}</strong> ({selectedDoctor.specialty})
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-cyan-400 hover:underline"
                >
                  Change Doctor
                </button>
              </div>

              {/* Doctor Brief Tag */}
              <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-3.5 text-xs text-slate-300">
                <span>Fee: <strong className="text-lime-400">{money(selectedDoctor.fee)}</strong></span>
                <span>•</span>
                <span>Shift: <strong className="text-white">{selectedDoctor.shift} ({selectedDoctor.timing})</strong></span>
                <span>•</span>
                <span>Working: <strong className="text-cyan-300">{selectedDoctor.days.join(", ")}</strong></span>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {/* Consultation Type */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-2">Consultation Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultType("In-Person")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                      consultType === "In-Person"
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <MapPin size={15} /> Hospital OPD (Physical Visit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultType("Video Consultation")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                      consultType === "Video Consultation"
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <Video size={15} /> Online Video Call
                  </button>
                </div>
              </div>

              {/* Date Input */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Select Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().slice(0, 10)}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot("");
                  }}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
                {selectedDate && (
                  <p className={`mt-2 text-xs font-semibold ${isAvailableDay ? "text-emerald-400" : "text-rose-400"}`}>
                    {isAvailableDay
                      ? `✓ Doctor is available on ${dayOfWeek} (${selectedDoctor.timing})`
                      : `✗ Doctor is NOT available on ${dayOfWeek}. Available: ${selectedDoctor.days.join(", ")}`}
                  </p>
                )}
              </div>

              {/* Slots Grid */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Select Available Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedDoctor.slots.map((s) => {
                    const isBooked = bookedSlots.includes(s);
                    const isSelected = selectedSlot === s;
                    return (
                      <button
                        type="button"
                        key={s}
                        disabled={!isAvailableDay || isBooked}
                        onClick={() => setSelectedSlot(s)}
                        className={`rounded-xl border p-2.5 text-xs font-bold transition ${
                          isSelected
                            ? "border-cyan-400 bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30"
                            : isBooked
                            ? "border-white/5 bg-white/5 text-slate-500 line-through opacity-50 cursor-not-allowed"
                            : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400 hover:bg-white/10"
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

            {errorNotice && (
              <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                {errorNotice}
              </p>
            )}

            <div className="mt-8 flex justify-between border-t border-white/10 pt-5">
              <Button variant="outline" size="md" onClick={() => setCurrentStep(1)}>
                <ArrowLeft size={15} /> Back
              </Button>
              <Button
                variant="lime"
                size="md"
                disabled={!isAvailableDay || !selectedSlot}
                onClick={handleNextToStep3}
              >
                Continue to Patient Info <ArrowRight size={15} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: PATIENT INFORMATION */}
        {currentStep === 3 && selectedDoctor && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="border-b border-white/10 pb-5">
              <h2 className="text-xl font-black text-white">Step 3: Patient Information</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Appointment with <strong>{selectedDoctor.name}</strong> on <strong>{selectedDate} ({selectedSlot})</strong>
              </p>
            </div>

            <form onSubmit={handleFinalSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 text-slate-400" size={16} />
                    <input
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Patient Full Name"
                      className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-3 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                    <input
                      type="email"
                      required
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-3 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Phone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 text-slate-400" size={16} />
                    <input
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-3 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Gender</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as any)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Male" className="bg-slate-900">Male</option>
                    <option value="Female" className="bg-slate-900">Female</option>
                    <option value="Other" className="bg-slate-900">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Reason for Visit / Symptoms (Optional)
                </label>
                <textarea
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your health symptoms, medical concern or relevant previous reports..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Consultation Summary Strip */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Consultation Fee:</span>
                  <strong className="text-white">{money(selectedDoctor.fee)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hospital Service Charges:</span>
                  <strong className="text-emerald-400">FREE (0 PKR)</strong>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 font-black text-sm">
                  <span className="text-white">Payable at Hospital Counter:</span>
                  <span className="text-lime-400">{money(selectedDoctor.fee)}</span>
                </div>
              </div>

              {errorNotice && (
                <p className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                  {errorNotice}
                </p>
              )}

              <div className="mt-8 flex justify-between border-t border-white/10 pt-5">
                <Button type="button" variant="outline" size="md" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft size={15} /> Back
                </Button>
                <Button type="submit" variant="lime" size="md">
                  <CheckCircle2 size={16} /> Confirm & Generate Token
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 4: INSTANT APPOINTMENT PASS / CONFIRMATION */}
        {currentStep === 4 && confirmedAppt && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
            <div className="text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
                <CheckCircle2 size={46} />
              </div>

              <span className="mt-4 inline-block rounded-full bg-emerald-400/20 px-3.5 py-1 text-xs font-bold text-emerald-300">
                Appointment Token Confirmed
              </span>

              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white">
                Booking Request Successfully Registered!
              </h2>

              <p className="mt-2 text-xs text-slate-300">
                Present this reference token at the Mehr Hospital reception on your appointment day.
              </p>
            </div>

            {/* Hospital Digital Pass Card */}
            <div className="mt-8 overflow-hidden rounded-3xl border-2 border-cyan-400/50 bg-[#080E1C] p-6 sm:p-8 shadow-2xl relative">
              <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

              {/* Pass Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-cyan-300 uppercase">
                    MEHR HOSPITAL • OPD PASS
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <b className="text-2xl font-black text-white">
                      Token: {confirmedAppt.appointmentNumber}
                    </b>
                    <button
                      onClick={copyAppointmentRef}
                      className="rounded-lg border border-white/10 bg-white/5 p-1 text-slate-300 hover:text-white"
                      title="Copy Token"
                    >
                      {copiedRef ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-400/30 bg-emerald-950/40 px-3 py-1.5 text-xs font-bold text-emerald-300">
                  Status: {confirmedAppt.status}
                </div>
              </div>

              {/* Pass Details Grid */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400">Doctor / Consultant:</span>
                  <p className="font-extrabold text-white text-sm">{confirmedAppt.doctorName}</p>
                  <p className="text-cyan-300">{confirmedAppt.doctorSpecialty}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400">Patient Name:</span>
                  <p className="font-extrabold text-white text-sm">{confirmedAppt.patientName}</p>
                  <p className="text-slate-300">{confirmedAppt.patientEmail} • {confirmedAppt.patientPhone}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400">Date & Slot:</span>
                  <p className="font-extrabold text-white text-sm">{confirmedAppt.date} at {confirmedAppt.slot}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400">Consultation Mode & Fee:</span>
                  <p className="font-extrabold text-lime-400 text-sm">
                    {confirmedAppt.consultationType} • {money(confirmedAppt.fee)}
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[11px] text-slate-400 space-y-1">
                <p>• Please arrive 15 minutes prior to your time slot for vital sign check.</p>
                <p>• Bring previous test reports, prescription history, and a valid ID.</p>
                <p>• You can manage or cancel this booking anytime from the Patient Portal.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="lime" onClick={handlePrint}>
                <Printer size={15} /> Print / Save Pass
              </Button>
              <Link href="/patient">
                <Button variant="outline">
                  <FileText size={15} /> Go to Patient Portal
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => {
                  setConfirmedAppt(null);
                  setCurrentStep(1);
                  setSelectedDoctorId("");
                  setSelectedSlot("");
                }}
              >
                Book Another Appointment
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Stethoscope,
  PhoneCall,
  CalendarCheck,
  Sparkles,
  Bot,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { doctors, money } from "@/lib/doctors";

type Message = {
  id: string;
  from: "bot" | "user";
  text: string;
  action?: { label: string; href: string };
};

export function MediBot() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [msgs, setMsgs] = useState<Message[]>([
    {
      id: "1",
      from: "bot",
      text: "👋 Assalam-o-Alaikum! I'm MediBot, your 24/7 AI health assistant at MEHR HOSPITAL.\n\nHow can I assist you today? You can ask about our specialist doctors, OPD timings, consultation fees, or book an appointment right now!",
    },
  ]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs, open]);

  function reply(raw: string) {
    const q = raw.toLowerCase().trim();
    const userMsg: Message = { id: crypto.randomUUID(), from: "user", text: raw };
    setMsgs((m) => [...m, userMsg]);
    setValue("");
    setIsTyping(true);

    setTimeout(() => {
      let botText = "I can guide you regarding our doctors, fees, OPD timings, or help you book an appointment. Pick a quick option below or type your question.";
      let action: { label: string; href: string } | undefined = undefined;

      if (q.includes("cardio") || q.includes("heart") || q.includes("dil")) {
        const doc = doctors.find((d) => d.category === "Cardiology") || doctors[0];
        botText = `❤️ Cardiology Specialist: ${doc.name} (${doc.qualification})\n• Fee: ${money(doc.fee)}\n• Shift: ${doc.shift} (${doc.timing})\n• Working Days: ${doc.days.join(", ")}`;
        action = { label: `Book with ${doc.name.split(" ")[1]}`, href: `/appointments?doctor=${doc.id}` };
      } else if (q.includes("neuro") || q.includes("brain") || q.includes("dimagh")) {
        const doc = doctors.find((d) => d.category === "Neurology");
        if (doc) {
          botText = `🧠 Neurology Specialist: ${doc.name} (${doc.qualification})\n• Fee: ${money(doc.fee)}\n• Shift: ${doc.shift} (${doc.timing})\n• Days: ${doc.days.join(", ")}`;
          action = { label: `Book Consultation`, href: `/appointments?doctor=${doc.id}` };
        }
      } else if (q.includes("ortho") || q.includes("bone") || q.includes("haddi") || q.includes("joint")) {
        const doc = doctors.find((d) => d.category === "Orthopedic");
        if (doc) {
          botText = `🦴 Orthopedic Specialist: ${doc.name}\n• Fee: ${money(doc.fee)}\n• Shift: ${doc.shift} (${doc.timing})\n• Days: ${doc.days.join(", ")}`;
          action = { label: `Book with Dr. Shahroz`, href: `/appointments?doctor=${doc.id}` };
        }
      } else if (q.includes("skin") || q.includes("derma") || q.includes("jild")) {
        const doc = doctors.find((d) => d.category === "Dermatology");
        if (doc) {
          botText = `✨ Dermatology Specialist: ${doc.name} (${doc.qualification})\n• Fee: ${money(doc.fee)}\n• Shift: ${doc.shift} (${doc.timing})\n• Days: ${doc.days.join(", ")}`;
          action = { label: `Book Skin Consult`, href: `/appointments?doctor=${doc.id}` };
        }
      } else if (q.includes("child") || q.includes("pedi") || q.includes("bacha") || q.includes("baby")) {
        const doc = doctors.find((d) => d.category === "Pediatrics");
        if (doc) {
          botText = `👶 Pediatrics Specialist: ${doc.name} (${doc.qualification})\n• Fee: ${money(doc.fee)}\n• Shift: ${doc.shift} (${doc.timing})\n• Days: ${doc.days.join(", ")}`;
          action = { label: `Book Pediatrician`, href: `/appointments?doctor=${doc.id}` };
        }
      } else if (q.includes("fee") || q.includes("fees") || q.includes("cost") || q.includes("price") || q.includes("charges")) {
        botText = `💰 Transparent Consultation Fees at MEHR HOSPITAL:\n\n` +
          doctors.map((d) => `• ${d.name} (${d.specialty}): ${money(d.fee)}`).join("\n");
        action = { label: "View Doctor Directory", href: "/doctors" };
      } else if (q.includes("time") || q.includes("timing") || q.includes("schedule") || q.includes("shift") || q.includes("waqt")) {
        botText = `⏰ Doctor OPD Shifts & Timings:\n\n` +
          doctors.map((d) => `• ${d.name}: ${d.timing} (${d.shift}) [${d.days.join(", ")}]`).join("\n");
        action = { label: "Filter by Shift & Timings", href: "/doctors" };
      } else if (q.includes("emergency") || q.includes("ambulance") || q.includes("urgent")) {
        botText = `🚨 24/7 Emergency & Trauma Response:\nOur emergency department and ICU are active 24 hours a day, 7 days a week. You do NOT need prior appointment for emergencies.\n\nHelpline: +92 300 1234567`;
        action = { label: "Call Emergency Dispatch", href: "tel:+923001234567" };
      } else if (q.includes("book") || q.includes("appointment") || q.includes("visit")) {
        botText = `📅 Booking an appointment takes under 60 seconds:\n1. Choose Doctor & Medical Specialty\n2. Select Date & Slot\n3. Provide Patient Information\n4. Confirm Instant Booking!`;
        action = { label: "Open Appointment Booking", href: "/appointments" };
      } else if (q.includes("doctor") || q.includes("specialist") || q.includes("team")) {
        botText = `👨‍⚕️ We have top specialists across Cardiology, Neurology, Orthopedics, Dermatology, Pediatrics, General Medicine, Ophthalmology, and Gynecology.\nAll doctors are PMDC certified with 8-15+ years of clinical experience.`;
        action = { label: "Explore All Doctors", href: "/doctors" };
      }

      setMsgs((m) => [...m, { id: crypto.randomUUID(), from: "bot", text: botText, action }]);
      setIsTyping(false);
    }, 450);
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 px-5 py-3.5 font-black text-slate-950 shadow-2xl shadow-cyan-400/40 cursor-pointer"
        aria-label="Open MediBot AI Assistant"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-950" />
        </span>
        <Bot size={20} />
        <span className="hidden sm:inline font-extrabold text-xs uppercase tracking-wider">
          MediBot AI • Online
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed bottom-24 right-4 z-50 flex h-[min(620px,78vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-cyan-400/30 bg-[#0A1224] text-white shadow-2xl backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#0E1A34] to-[#0A1224] p-4">
              <div className="flex items-center gap-3">
                <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-teal-300 text-slate-950 font-black shadow">
                  <Stethoscope size={20} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0E1A34] bg-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <b className="text-sm font-black text-white">MediBot</b>
                    <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                      AI Health Assistant
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Ready to assist
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full border border-white/10 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 space-y-3.5 overflow-y-auto p-4 scrollbar-thin">
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.from === "bot" ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                      m.from === "bot"
                        ? "border border-white/10 bg-white/[0.06] text-slate-100"
                        : "bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-semibold"
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.action && (
                    <Link
                      href={m.action.href}
                      onClick={() => setOpen(false)}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-950/40 px-3 py-1.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-900/60"
                    >
                      <CalendarCheck size={13} className="text-lime-400" />
                      {m.action.label}
                      <ChevronRight size={13} />
                    </Link>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-slate-400 w-fit">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] ml-1">MediBot is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips */}
            <div className="border-t border-white/10 bg-white/[0.02] p-2.5">
              <div className="flex flex-wrap gap-1.5">
                {[
                  "📅 Book Appointment",
                  "❤️ Heart Specialist",
                  "🧠 Neurologist",
                  "✨ Skin Specialist",
                  "💰 Check Doctor Fees",
                  "⏰ OPD Timings",
                  "🚨 Emergency 24/7",
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => reply(chip)}
                    className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-200 transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (value.trim()) reply(value.trim());
              }}
              className="flex items-center gap-2 border-t border-white/10 bg-[#080E1C] p-3"
            >
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask doctor fee, timings, appointment..."
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold hover:scale-105 active:scale-95 transition"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

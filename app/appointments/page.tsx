import { Suspense } from "react";
import { PageHeading } from "@/components/page-heading";
import { BookingForm } from "@/components/booking-form";
import { ShieldCheck, Clock, CalendarCheck, PhoneCall, Sparkles } from "lucide-react";

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-[#070D18] text-white py-12">
      <div className="container-page">
        {/* Header Banner */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-bold text-cyan-300">
            <Sparkles size={14} className="text-lime-400" />
            Fast-Track Hospital OPD Scheduling
          </span>
          <h1 className="mt-4 text-3xl font-black sm:text-5xl">
            Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">Doctor Consultation</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Select an experienced specialist, choose a convenient date and time, and receive your digital OPD token immediately. Pay standard fee at the hospital desk.
          </p>

          {/* Trust Guarantees */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck size={14} /> Zero Advance Payment
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
              <Clock size={14} /> Instant Token Generated
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-lime-400 font-semibold">
              <CalendarCheck size={14} /> Free Rescheduling
            </span>
          </div>
        </div>

        {/* Wizard Form Component */}
        <div className="mt-10">
          <Suspense
            fallback={
              <div className="rounded-3xl border border-white/10 bg-[#0C1527] p-12 text-center text-slate-400">
                Loading Appointment Booking System…
              </div>
            }
          >
            <BookingForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

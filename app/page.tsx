"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  HeartPulse,
  Building2,
  Ambulance,
  ShieldCheck,
  Clock3,
  CalendarCheck,
  Stethoscope,
  Sparkles,
  Search,
  PhoneCall,
  CheckCircle2,
  Brain,
  Activity,
  ScanFace,
  Baby,
  Eye,
  ChevronDown,
  Star,
  Users,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoctorSlider } from "@/components/doctor-slider";
import { doctors } from "@/lib/doctors";

const stats = [
  { icon: Building2, n: "500+", t: "Hospital Beds", d: "Modern inpatient & ICU capacity" },
  { icon: Stethoscope, n: "50+", t: "Specialists", d: "Covering 18+ medical disciplines" },
  { icon: Ambulance, n: "24/7", t: "Emergency Care", d: "Rapid ambulance response" },
  { icon: Users, n: "120k+", t: "Treated Patients", d: "Trusted across the region" },
];

const departments = [
  {
    name: "Cardiology",
    title: "Heart & Vascular Care",
    desc: "Preventive cardiac screening, ECG, Echocardiography, and advanced coronary care.",
    icon: HeartPulse,
    color: "from-rose-500/20 to-red-500/10",
    border: "border-rose-500/20",
    accent: "text-rose-400",
    link: "/doctors?category=Cardiology",
  },
  {
    name: "Neurology",
    title: "Brain & Spine Clinic",
    desc: "Stroke rehabilitation, migraine management, epilepsy care, and neurological diagnostics.",
    icon: Brain,
    color: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/20",
    accent: "text-cyan-400",
    link: "/doctors?category=Neurology",
  },
  {
    name: "Orthopedic",
    title: "Bones & Joint Surgery",
    desc: "Joint replacements, sports trauma recovery, knee arthroscopy, and fracture therapy.",
    icon: Activity,
    color: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-500/20",
    accent: "text-amber-400",
    link: "/doctors?category=Orthopedic",
  },
  {
    name: "Dermatology",
    title: "Skin & Laser Center",
    desc: "Aesthetic skincare, laser therapies, chronic acne solutions, and PRP treatments.",
    icon: ScanFace,
    color: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/20",
    accent: "text-purple-400",
    link: "/doctors?category=Dermatology",
  },
  {
    name: "Pediatrics",
    title: "Child & Newborn Health",
    desc: "Compassionate pediatric care, infant immunization, growth monitoring, and nutrition.",
    icon: Baby,
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20",
    accent: "text-emerald-400",
    link: "/doctors?category=Pediatrics",
  },
  {
    name: "General Medicine",
    title: "Internal Medicine & Diabetes",
    desc: "Full body health checks, diabetes profiling, infectious diseases, and hypertension.",
    icon: ShieldCheck,
    color: "from-teal-500/20 to-cyan-500/10",
    border: "border-teal-500/20",
    accent: "text-teal-400",
    link: "/doctors?category=General Medicine",
  },
];

const faqs = [
  {
    q: "How can I book an appointment with a specialist?",
    a: "You can book directly through our online portal in 3 easy steps: select your specialist doctor, pick a working date & time slot, and confirm. You will receive an instant appointment pass with reference ID.",
  },
  {
    q: "Is prior booking required for Emergency services?",
    a: "No prior appointment is needed for Emergency. Our Trauma and Resuscitation Center is open 24 hours a day, 7 days a week with on-duty emergency physicians and surgeons.",
  },
  {
    q: "Are video consultations available for out-of-city patients?",
    a: "Yes! Many of our specialists offer high-definition video consultations. You can select 'Video Consultation' when scheduling your appointment.",
  },
  {
    q: "Can I cancel or reschedule my appointment?",
    a: "Yes. Simply log in to the Patient Portal using your email to view, cancel, or reschedule any upcoming appointment with one click.",
  },
];

export default function Home() {
  const router = useRouter();
  const [heroSearch, setHeroSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/doctors?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      router.push("/doctors");
    }
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#091326] via-[#081020] to-[#070D18] py-16 md:py-24">
        {/* Ambient Gradient Glows */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-lime-500/10 blur-[130px]" />

        <div className="container-page relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              {/* Emergency Banner Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-4 py-2 text-xs font-bold text-cyan-200 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>24/7 Emergency & ICU • Serving The Community</span>
              </div>

              {/* Main Heading */}
              <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl md:text-6xl lg:text-7xl">
                Your Health Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-teal-300 to-cyan-400">Mehr</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Compassionate healthcare from leading specialist doctors. Experience state-of-the-art diagnostic facilities, verified clinicians, and transparent patient care.
              </p>

              {/* Quick Search Bar right in Hero */}
              <form onSubmit={handleSearchSubmit} className="mt-8 max-w-lg">
                <div className="flex items-center rounded-2xl border border-white/15 bg-white/5 p-1.5 backdrop-blur-xl shadow-2xl transition focus-within:border-cyan-400 focus-within:bg-white/10">
                  <Search className="ml-3 text-cyan-400 shrink-0" size={18} />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search doctor, cardiology, skin, child..."
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                  <Button type="submit" size="sm" variant="primary">
                    Find Doctor
                  </Button>
                </div>
              </form>

              {/* CTA Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/appointments">
                  <Button size="lg" variant="lime">
                    <CalendarCheck size={18} />
                    Book Consultation
                    <ArrowRight size={17} />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline">
                    Explore Departments
                  </Button>
                </Link>
                <a href="tel:+923001234567" className="inline-block">
                  <Button size="lg" variant="ghost" className="text-lime-400 hover:text-lime-300">
                    <PhoneCall size={17} />
                    Emergency Helpline
                  </Button>
                </a>
              </div>

              {/* Animated ECG Heartbeat Line */}
              <div className="mt-10 max-w-lg overflow-hidden py-2 opacity-80">
                <svg viewBox="0 0 500 50" className="w-full h-8 text-cyan-400 stroke-current fill-none stroke-[2]">
                  <path
                    d="M0,25 L120,25 L135,10 L145,40 L155,5 L165,45 L175,25 L320,25 L335,10 L345,40 L355,5 L365,45 L375,25 L500,25"
                    className="ecg-line"
                  />
                </svg>
              </div>

              {/* Stats Highlights */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map(({ icon: Icon, n, t, d }) => (
                  <motion.div
                    key={t}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md transition"
                  >
                    <Icon className="mb-2 text-cyan-400" size={20} />
                    <b className="block text-xl font-black text-white sm:text-2xl">{n}</b>
                    <span className="text-xs font-bold text-lime-400">{t}</span>
                    <p className="mt-1 hidden text-[11px] leading-4 text-slate-400 sm:block">{d}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Graphic Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              {/* Outer Decorative Rings */}
              <div className="absolute -inset-4 rounded-[2.5rem] border border-cyan-400/20 pointer-events-none" />
              <div className="absolute -inset-8 rounded-[3rem] border border-lime-400/10 pointer-events-none" />

              {/* Hospital Hero Image */}
              <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/40 bg-slate-900 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1400&q=90"
                  alt="Modern Mehr Hospital building and entrance"
                  className="h-[420px] w-full object-cover md:h-[530px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070D18] via-transparent to-transparent opacity-80" />
              </div>

              {/* Floating Badge 1: Trust badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-5 left-5 flex items-center gap-3.5 rounded-2xl border border-white/20 bg-[#0B1528]/90 p-4 text-white shadow-2xl backdrop-blur-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-lime-400 text-slate-950 font-black">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <b className="block text-sm font-extrabold">Care You Can Trust</b>
                  <p className="text-xs text-slate-400">100% PMDC Certified Doctors</p>
                </div>
              </motion.div>

              {/* Floating Badge 2: Live Doctor count */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute -top-4 right-5 hidden sm:flex items-center gap-2 rounded-2xl border border-white/20 bg-[#0B1528]/90 px-4 py-2.5 text-white shadow-xl backdrop-blur-xl"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold">
                  <strong className="text-cyan-400">8 Specialists</strong> on Duty Today
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Medical Departments Grid */}
      <section className="section-pad border-t border-white/10 bg-[#060B14]">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-kicker justify-center">Specialized Clinical Units</p>
            <h2 className="section-title">Comprehensive Medical Care</h2>
            <p className="mt-3 text-sm text-slate-400">
              Each clinical department is equipped with modern diagnostic systems and senior consultants.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <motion.div
                  key={dept.name}
                  whileHover={{ y: -6 }}
                  className={`group relative overflow-hidden rounded-3xl border ${dept.border} bg-gradient-to-b ${dept.color} p-7 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-white/10 ${dept.accent}`}>
                      <Icon size={26} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition">
                      {dept.name}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-black text-white">{dept.title}</h3>
                  <p className="mt-2.5 text-xs leading-6 text-slate-300">{dept.desc}</p>

                  <Link
                    href={dept.link}
                    className={`mt-6 inline-flex items-center gap-2 text-xs font-bold ${dept.accent} hover:underline`}
                  >
                    View Department Doctors <ArrowRight size={14} />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link href="/services">
              <Button variant="outline" size="md">
                Explore All Hospital Services & Laboratories →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Doctors Slider Section */}
      <section className="section-pad border-t border-white/10 bg-[#070D18]">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Experienced Care Team</p>
              <h2 className="section-title">Meet Our Distinguished Doctors</h2>
              <p className="mt-2 text-sm text-slate-400">
                Book direct consultations with senior consultants, compare fee structures, and check working timings.
              </p>
            </div>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-950/40 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 transition"
            >
              View All Doctors & Filter <ArrowRight size={15} />
            </Link>
          </div>

          <DoctorSlider doctors={doctors} />
        </div>
      </section>

      {/* 3-Step Hassle Free Booking Flow */}
      <section className="section-pad border-t border-white/10 bg-[#050A14]">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="rounded-full bg-cyan-400/15 px-4 py-1 text-xs font-bold text-cyan-300">
              Simple & Transparent
            </span>
            <h2 className="section-title mt-4">Instant Appointment in 3 Steps</h2>
            <p className="mt-3 text-sm text-slate-400">
              Zero registration friction. Choose your doctor, pick your preferred timing, and receive your digital slip immediately.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Find Your Doctor",
                desc: "Filter specialists by medical department, consulting fees, experience, or morning and evening shifts.",
                icon: Stethoscope,
              },
              {
                step: "02",
                title: "Select Date & Time Slot",
                desc: "Choose an available working date and open time slot that fits your personal schedule comfortably.",
                icon: Clock3,
              },
              {
                step: "03",
                title: "Instant Confirmation",
                desc: "Get your digital appointment token immediately. Pay standard fee directly at the hospital reception.",
                icon: CalendarCheck,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div
                key={step}
                className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md"
              >
                <span className="text-4xl font-black text-white/10">{step}</span>
                <div className="mt-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-teal-300 text-slate-950 font-black">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-400">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/appointments">
              <Button variant="lime" size="lg">
                Start Booking Now <ArrowRight size={17} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Patient Testimonials & Trust */}
      <section className="section-pad border-t border-white/10 bg-[#070D18]">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-kicker justify-center">Verified Patient Feedback</p>
            <h2 className="section-title">What Our Patients Say</h2>
            <p className="mt-2 text-sm text-slate-400">
              Trusted by over 120,000 patients and families for compassionate and timely healthcare.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Kamran Akram",
                doctor: "Dr. Afzal Bashir (Cardiology)",
                rating: 5,
                comment: "The cardiology department handled my father's assessment with utmost care. The doctor explained every detail of the ECG and gave clear guidance.",
              },
              {
                name: "Zainab Fatima",
                doctor: "Dr. Ayesha Khan (Dermatology)",
                rating: 5,
                comment: "Very professional skin consultation. Online appointment booking was seamless and there was almost zero waiting time at the clinic.",
              },
              {
                name: "Hamza Malik",
                doctor: "Dr. Bilal Raza (Pediatrics)",
                rating: 5,
                comment: "Dr. Bilal is wonderful with children. He diagnosed our baby's seasonal chest infection accurately and guided us through recovery calmly.",
              },
            ].map(({ name, doctor, rating, comment }) => (
              <div
                key={name}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-300 italic">
                  &ldquo;{comment}&rdquo;
                </p>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <b className="block text-sm text-white font-extrabold">{name}</b>
                  <span className="text-xs text-cyan-300">{doctor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section-pad border-t border-white/10 bg-[#050A14]">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-kicker justify-center">Common Questions</p>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="mt-2 text-sm text-slate-400">
              Quick answers about doctor timings, visits, and hospital procedures.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-cyan-300 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/5 px-5 pb-5 pt-2 text-xs leading-6 text-slate-300"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment & Final Banner */}
      <section className="border-t border-white/10 bg-gradient-to-r from-cyan-950/70 via-[#0B1528] to-lime-950/50 px-5 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="rounded-full bg-cyan-400/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-cyan-300">
            Committed to Excellence
          </span>
          <h2 className="mt-5 text-3xl font-black text-white sm:text-4xl md:text-5xl">
            Providing Safe, Compassionate & Dependable Healthcare
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Same-day appointments available • Insurance accepted • Experienced clinicians ready to assist your recovery.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/appointments">
              <Button variant="lime" size="lg">
                <CalendarCheck size={18} /> Schedule Your Visit Now
              </Button>
            </Link>
            <Link href="/doctors">
              <Button variant="outline" size="lg">
                View All Doctors
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

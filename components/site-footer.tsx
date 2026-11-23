"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Clock,
  ShieldCheck,
  Award,
  Send,
  HeartPulse,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="border-t border-white/10 bg-[#050A14] text-slate-300">
      {/* Emergency Dispatch Strip */}
      <div className="border-b border-white/10 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-lime-950/40 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400 text-slate-950 font-black">
              <HeartPulse size={24} />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-base">In Need of Emergency Medical Care?</h4>
              <p className="text-xs text-slate-400">
                Trauma center, 24/7 ambulance dispatch, and rapid ICU resuscitation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a href="tel:+923001234567">
              <Button variant="danger" size="md">
                <Phone size={15} /> Call 24/7 Helpline: +92 300 1234567
              </Button>
            </a>
            <Link href="/appointments">
              <Button variant="outline" size="md">
                Schedule Online
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand & About */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 text-slate-950 font-black">
                <Plus size={22} strokeWidth={3} />
              </span>
              <div>
                <b className="text-lg font-black text-white">MEHR <span className="text-lime-400">HOSPITAL</span></b>
                <span className="block text-[10px] tracking-widest text-cyan-300 font-bold">CARE • TRUST • HEALING</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-400">
              MEHR HOSPITAL is a premier multispecialty healthcare institution dedicated to delivering world-class clinical care, patient comfort, and trusted treatment through leading doctors and cutting-edge medical technology.
            </p>

            <div className="mt-5 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                <ShieldCheck size={15} /> ISO 9001 Certified
              </span>
              <span className="flex items-center gap-1 text-lime-400 font-semibold">
                <Award size={15} /> PMDC Approved
              </span>
            </div>

            {/* Social Icons */}
            <div className="mt-6 flex gap-2.5">
              {[
                { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400 hover:bg-cyan-400 hover:text-slate-950 transition"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              {[
                ["Home Page", "/"],
                ["Find Doctors & OPD", "/doctors"],
                ["Book Online Appointment", "/appointments"],
                ["Specialty Services", "/services"],
                ["Patient Guidelines", "/patients"],
                ["About Mehr Hospital", "/about"],
                ["Contact & Locations", "/contact"],
              ].map(([title, link]) => (
                <li key={link}>
                  <Link href={link} className="hover:text-cyan-300 hover:underline transition">
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hospital Clinical Units */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Departments</h3>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              {[
                ["Cardiology & Heart Care", "/doctors?category=Cardiology"],
                ["Neurology & Stroke Clinic", "/doctors?category=Neurology"],
                ["Orthopedics & Joint Care", "/doctors?category=Orthopedic"],
                ["Dermatology & Cosmetology", "/doctors?category=Dermatology"],
                ["Pediatrics & Neonatal Care", "/doctors?category=Pediatrics"],
                ["General Medicine & Diabetes", "/doctors?category=General Medicine"],
                ["Ophthalmology & Eye Surgery", "/doctors?category=Ophthalmology"],
                ["Gynecology & Obstetrics", "/doctors?category=Gynecology"],
              ].map(([name, href]) => (
                <li key={name}>
                  <Link href={href} className="hover:text-lime-300 transition">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Health Newsletter */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Hospital Contacts</h3>
            <div className="mt-4 space-y-3 text-xs text-slate-400">
              <p className="flex items-start gap-2.5">
                <MapPin size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>123 Health Avenue, Medical City, Main Boulevard</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={15} className="text-lime-400 shrink-0" />
                <span>+92 300 1234567 / +92 42 35789000</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={15} className="text-cyan-400 shrink-0" />
                <span>care@mehrhospital.pk</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock size={15} className="text-lime-400 shrink-0" />
                <span>OPD: 9:00 AM – 9:00 PM (Emergency 24/7)</span>
              </p>
            </div>

            {/* Newsletter */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-bold text-white">Subscribe to Health Updates</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Stay updated with free health tips & schedules.</p>
              <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
                <Button type="submit" size="sm" variant="primary">
                  <Send size={12} />
                </Button>
              </form>
              {subscribed && (
                <p className="mt-2 text-xs text-emerald-400 font-semibold">
                  ✓ Thank you! You are subscribed to updates.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5">
          <p>© {new Date().getFullYear()} MEHR HOSPITAL. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-slate-400">Privacy Policy</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-slate-400">Terms of Care</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-slate-400">Patient Rights</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

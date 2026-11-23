"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserRound, LockKeyhole, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUsers, saveUsers, setSession, User } from "@/lib/storage";

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}
const destination = (role: User["role"]) => role === "Admin" ? "/admin" : role === "Doctor" ? "/doctor" : "/patient";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isSignup = mode === "signup";
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const mail = email.trim().toLowerCase();
      const users = getUsers();
      if (isSignup) {
        if (name.trim().length < 2) { setError("Please enter your full name."); return; }
        if (password.length < 8) { setError("Use a password with at least 8 characters."); return; }
        if (users.some(u => u.email === mail) || ["patient@mehr.com", "doctor@mehr.com", "admin@mehr.com"].includes(mail)) { setError("An account with this email already exists. Please sign in."); return; }
        const user: User = { name: name.trim(), email: mail, role: "Patient", passwordHash: await hashPassword(password) };
        saveUsers([...users, user]); setSession({ name: user.name, email: user.email, role: user.role }); router.replace("/patient");
      } else {
        const demo: Record<string, User> = {
          "patient@mehr.com": { name: "Mehr Patient", email: mail, role: "Patient" },
          "doctor@mehr.com": { name: "Dr. Afzal Bashir", email: mail, role: "Doctor" },
          "admin@mehr.com": { name: "Hospital Admin", email: mail, role: "Admin" },
        };
        const user = users.find(u => u.email === mail);
        if (demo[mail] && password === "123456") { setSession(demo[mail]); router.replace(destination(demo[mail].role)); }
        else if (user?.passwordHash && user.passwordHash === await hashPassword(password)) { setSession({ name: user.name, email: user.email, role: user.role }); router.replace(destination(user.role)); }
        else { setError("Email or password is incorrect. New accounts need the password used at sign-up."); }
      }
    } catch { setError("Something went wrong. Please try again."); }
    finally { setBusy(false); }
  }
  return <motion.form onSubmit={submit} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, ease: "easeOut" }} className="auth-card relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-7 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:p-9">
    <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-100/70 blur-3xl" />
    <div className="relative">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300 shadow-lg shadow-cyan-900/15"><Sparkles size={25}/></div>
      <p className="text-xs font-black uppercase tracking-[.22em] text-cyan-700">{isSignup ? "Start your care journey" : "Your health, one step ahead"}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{isSignup ? "Create your account" : "Welcome back"}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{isSignup ? "Create a patient account to manage your appointments." : "Sign in to access your secure demo dashboard."}</p>
      {isSignup && <div className="mt-6"><label className="form-label">Full name</label><div className="relative"><UserRound className="pointer-events-none absolute left-4 top-3.5 text-slate-400" size={17}/><Input required minLength={2} autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="pl-11"/></div></div>}
      <div className="mt-5"><label className="form-label">Email address</label><div className="relative"><Mail className="pointer-events-none absolute left-4 top-3.5 text-slate-400" size={17}/><Input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="pl-11"/></div></div>
      <div className="mt-5"><div className="mb-2 flex items-center justify-between"><label className="form-label mb-0">Password</label>{!isSignup && <span className="text-[11px] font-semibold text-slate-400">Demo: 123456</span>}</div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-3.5 text-slate-400" size={17}/><Input required minLength={isSignup ? 8 : 1} type="password" autoComplete={isSignup ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} placeholder={isSignup ? "At least 8 characters" : "Enter your password"} className="pl-11"/></div></div>
      {isSignup && <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600"/> New registrations are patient accounts. Staff roles are provisioned separately.</p>}
      {error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} role="alert" className="mt-4 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">{error}</motion.p>}
      <Button type="submit" disabled={busy} className="mt-7 w-full justify-center gap-2 py-3">{busy ? "Please wait…" : isSignup ? "Create patient account" : "Sign in securely"}<ArrowRight size={17}/></Button>
      <p className="mt-6 text-center text-sm text-slate-500">{isSignup ? "Already have an account?" : "New to Mehr Hospital?"} <Link className="font-bold text-cyan-700 hover:text-cyan-900" href={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create account"}</Link></p>
    </div>
  </motion.form>;
}

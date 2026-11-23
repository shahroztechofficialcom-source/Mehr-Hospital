"use client";
import type { UserRole, ConsultationType } from "./types";
import type { Doctor } from "./doctors";

export type User = {
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  passwordHash?: string;
};

export type Appointment = {
  id: string;
  appointmentNumber?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty?: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  consultationType?: ConsultationType;
  symptoms?: string;
  date: string;
  slot: string;
  fee: number;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled" | "Completed";
  createdAt?: string;
};

const keys = {
  session: "mehr_session_v1",
  appointments: "mehr_appointments_v1",
  users: "mehr_users_v1",
  extra: "mehr_extra_doctors_v1",
  favorites: "mehr_favorite_doctors_v1",
};

export function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function write(k: string, value: unknown) {
  if (typeof window !== "undefined") {
    localStorage.setItem(k, JSON.stringify(value));
  }
}

export const getSession = () => read<User | null>(keys.session, null);

export const setSession = (user: User | null) => {
  if (typeof window !== "undefined") {
    if (user) {
      write(keys.session, user);
    } else {
      localStorage.removeItem(keys.session);
    }
    window.dispatchEvent(new Event("mehr-auth-change"));
  }
};

export const getAppointments = () => read<Appointment[]>(keys.appointments, []);

export const saveAppointments = (items: Appointment[]) => {
  write(keys.appointments, items);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("mehr-appointments-change"));
  }
};

export const getUsers = () => read<User[]>(keys.users, []);
export const saveUsers = (users: User[]) => write(keys.users, users);

export const getExtraDoctors = () => read<Doctor[]>(keys.extra, []);
export const saveExtraDoctors = (doctors: Doctor[]) => write(keys.extra, doctors);

export const getFavorites = () => read<string[]>(keys.favorites, []);
export const toggleFavorite = (doctorId: string): boolean => {
  if (typeof window === "undefined") return false;
  const current = getFavorites();
  const exists = current.includes(doctorId);
  const next = exists ? current.filter((id) => id !== doctorId) : [...current, doctorId];
  write(keys.favorites, next);
  window.dispatchEvent(new Event("mehr-favorites-change"));
  return !exists;
};
export const isFavorite = (doctorId: string): boolean => {
  return getFavorites().includes(doctorId);
};

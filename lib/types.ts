export type UserRole = "Patient" | "Doctor" | "Admin";

export type ConsultationType = "In-Person" | "Video Consultation";

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  category: string;
  fee: number;
  shift: "Morning" | "Evening" | "All-Day";
  days: string[];
  timing: string;
  slots: string[];
  image: string;
  qualification: string;
  experience: string;
  experienceYears: number;
  about: string;
  rating: number;
  reviewsCount: number;
  gender: "Male" | "Female";
  languages: string[];
  consultationType: ConsultationType[];
  nextAvailable: string;
  opdRoom: string;
  services: string[];
  badge?: string;
  isPopular?: boolean;
  isAvailableToday?: boolean;
};

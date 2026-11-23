"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Doctor } from "@/lib/doctors";
import { DoctorCard } from "@/components/doctor-card";

export function DoctorSlider({ doctors }: { doctors: Doctor[] }) {
  return (
    <div className="relative">
      {/* Slider Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
          <Sparkles size={14} className="text-lime-400" />
          <span>Swipe or click arrows to explore specialists</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous doctors"
            className="doctor-prev grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-cyan-400 hover:bg-cyan-400 hover:text-slate-950 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Next doctors"
            className="doctor-next grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-cyan-400 hover:bg-cyan-400 hover:text-slate-950 disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{ prevEl: ".doctor-prev", nextEl: ".doctor-next" }}
        pagination={{ clickable: true, el: ".doctor-pagination" }}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="!pb-12"
      >
        {doctors.map((d) => (
          <SwiperSlide key={d.id} className="h-auto">
            <DoctorCard doctor={d} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="doctor-pagination mt-2 flex justify-center gap-2" />
    </div>
  );
}

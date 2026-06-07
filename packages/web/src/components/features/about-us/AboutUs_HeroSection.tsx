"use client";
import AboutUs_3DRaining from "@/components/features/about-us/AboutUs_3DRaining";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useBackgroundAudio } from "@/hooks/useBackgroundAudio";

const HeroSection = () => {
  const { isPlaying, togglePlay } = useBackgroundAudio("/sounds/rain.mp3");

  return (
  <section className="relative h-screen w-full bg-[#4083C4]">
    <div className="absolute inset-0">
      <AboutUs_3DRaining />
    </div>

    <button
      onClick={togglePlay}
      className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-md transition-all hover:bg-white/20 z-10"
    >
      <span className="text-sm font-medium">
        {isPlaying ? "توقف صدای باران" : "شنیدن صدای باران"}
      </span>
      {isPlaying ? <Pause className="h-5 w-5" aria-hidden="true" /> : <Play className="h-5 w-5" aria-hidden="true" />}
    </button>

    <div className="relative z-10 h-full flex items-center md:items-center justify-center pt-10 md:pt-0 pb-32 md:pb-0">
      <div className="text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl"
        >
          کانون مهرباران
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-2xl text-blue-100 drop-shadow-lg"
        >
          سازمان دانشجویان جهاد دانشگاهی خراسان رضوی
        </motion.p>
      </div>
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.2 }}
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce"
      aria-hidden="true"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </motion.div>
  </section>
  );
};

export default HeroSection;

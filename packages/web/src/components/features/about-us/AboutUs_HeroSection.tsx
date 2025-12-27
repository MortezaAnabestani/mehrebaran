import AboutUs_3DRaining from "@/components/features/about-us/AboutUs_3DRaining";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";

const HeroSection = ({ isPlaying, onToggleAudio }: { isPlaying: boolean; onToggleAudio: () => void }) => (
  <section className="relative h-screen w-full bg-[#4083C4]">
    <div className="absolute inset-0">
      <AboutUs_3DRaining />
    </div>

    <button
      onClick={onToggleAudio}
      className="absolute top-6 left-6 z-50 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-all text-white"
      aria-label={isPlaying ? "Mute Background Sound" : "Play Background Sound"}
    >
      {isPlaying ? <Pause /> : <Play />}
    </button>

    <div className="relative z-10 h-full flex items-center justify-center">
      <div className="text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl"
        >
          کانون مهرباران
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-blue-100 drop-shadow-lg"
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
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </motion.div>
  </section>
);

export default HeroSection;

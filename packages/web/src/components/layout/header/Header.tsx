"use client";
import React, { useEffect, useState } from "react";
import Search from "./Search";
import Navbar from "./Navbar";
import OptimizedImage from "@/components/ui/OptimizedImage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const pathname = usePathname();
  const isNetworkPage = pathname?.startsWith("/network");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic colors based on page type
  const headerBg = isNetworkPage
    ? scrolled
      ? "bg-morange/100 text-white"
      : "bg-morange/50 hover:bg-morange/100 transition duration-200"
    : scrolled
    ? "bg-mblue/100 text-white"
    : "bg-mblue/50 hover:bg-mblue/100 transition duration-200";

  const mobileBg = isNetworkPage ? "bg-morange" : "bg-mblue";

  // Don't render header on network pages (TopNav is used instead)
  if (isNetworkPage) {
    return null;
  }

  return (
    <header className="h-13.5 md:h-26">
      <div
        className={`w-full fixed ${headerBg} ${
          isNetworkPage ? "py-1" : "py-2"
        } z-20 duration-300 transition-all`}
      >
        <div
          className={`flex items-center justify-between w-8/10 mx-auto relative ${
            //این قسمت پس از تصمیم تیم سازمان اصلاح خواهد شد
            !scrolled && "border-b-2 border-none"
          }`}
        >
          <div className="hidden md:block">
            <Search />
            <Navbar deviceSize="desktop" />
          </div>
          <div className="block md:hidden duration-200 transition-all flex items-center justify-center">
            <button
              onClick={() => setOpen(!open)}
              className="p-1 focus:outline-none flex items-center justify-center cursor-pointer text-white"
              aria-label={open ? "بستن منو" : "باز کردن منو"}
            >
              {open ? (
                <X className="w-7 h-7 transition-all duration-200" />
              ) : (
                <OptimizedImage src="/icons/menuDots.svg" alt="menu icon" width={25} height={25} />
              )}
            </button>
          </div>
          <Link href={"/"}>
            <OptimizedImage
              src={"/icons/logo.svg"}
              alt="لوگوی مهر باران"
              width={isNetworkPage ? 100 : 150}
              height={isNetworkPage ? 40 : 60}
              placeholder="blur"
              blurDataURL="/icons/blur-logo.svg"
              priority="down"
            />
          </Link>
        </div>

        {/* Mobile Accordion Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute top-full left-0 w-full ${mobileBg} border-t border-white/10 shadow-2xl overflow-hidden z-30`}
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                <Search className="w-full min-w-full mx-auto" />
                <Navbar deviceSize="mobile" setOpen={setOpen} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

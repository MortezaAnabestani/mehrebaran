"use client";
import React, { FocusEvent, MouseEventHandler, useEffect, useState } from "react";
import Search from "./Search";
import Navbar from "./Navbar";
import OptimizedImage from "@/components/ui/OptimizedImage";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  // define your props here
}

const Header: React.FC<Props> = ({}) => {
  const pathname = usePathname();
  const isNetworkPage = pathname?.startsWith("/network");
  const [scrolled, setScrolled] = useState<Boolean>(false);
  const [open, setOpen] = useState<Boolean>(false);

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

  return (
    <header className={isNetworkPage ? "h-12 md:h-16" : "h-13.5 md:h-26"}>
      <div className={`w-full fixed ${headerBg} ${isNetworkPage ? "py-1" : "py-2"} z-20 duration-300 transition-all`}>
        <div
          className={`flex items-center justify-between w-8/10 mx-auto relative ${
            //این قسمت پس از تصمیم تیم سازمان اصلاح خواهد شد
            !scrolled && "border-b-2 border-none"
          }  `}
        >
          <div className="hidden md:block">
            <Search onSearch={(term) => console.log("جستجو شد:", term)} />
            <Navbar deviceSize="desktop" />
          </div>
          <div className="block md:hidden duration-200 transition-all">
            <div onClick={() => setOpen(!open)}>
              <OptimizedImage src="/icons/menuDots.svg" alt="menu icon" width={25} height={25} />
            </div>
            {open && (
              <div className={`absolute top-16.5 w-full ${mobileBg} pt-2`}>
                <Search
                  onSearch={(term) => console.log("جستجو شد:", term)}
                  className="w-9/10 min-w-9/10 mx-auto"
                />
                <Navbar deviceSize="mobile" />
              </div>
            )}
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
      </div>
    </header>
  );
};

export default Header;

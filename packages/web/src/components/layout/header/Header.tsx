"use client";
import React, { FocusEvent, MouseEventHandler, useEffect, useState } from "react";
import Search from "./Search";
import Navbar from "./Navbar";
import OptimizedImage from "@/components/ui/OptimizedImage";
import Link from "next/link";

interface Props {
  // define your props here
}

const Header: React.FC<Props> = ({}) => {
  const [scrolled, setScrolled] = useState<Boolean>(false);
  const [open, setOpen] = useState<Boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="h-13.5 md:h-26">
      <div
        className={`w-full fixed ${
          scrolled ? "bg-mblue/100" : "bg-mblue/50"
        } py-2 z-20 duration-300 transition-all`}
      >
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
              <div className="absolute top-16.5 w-full bg-mblue pt-2">
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
              width={150}
              height={60}
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

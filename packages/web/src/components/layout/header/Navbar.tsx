"use client";

import { MenuItem } from "@/types/types";
import Link from "next/link";
import React from "react";

interface props {
  deviceSize: "mobile" | "desktop";
}

const menuItems: MenuItem[] = [
  { label: "شبکه نیازسنجی", href: "/network" },
  { label: "دربارۀ ما", href: "/about-us" },
  { label: "طرح‌های جاری", href: "/projects/active" },
  { label: "اخبار", href: "/news" },
  { label: "مجلۀ مهر باران", href: "/blog" },
  { label: "ثبت‌نام", href: "/signup" },
];

const Navbar: React.FC<props> = ({ deviceSize }) => {
  return (
    <nav
      className={`flex justify-between w-full gap-4 duration-300 transition-all text-white ${
        deviceSize === "desktop" ? "items-center" : "flex-col absolute right-0 bg-mblue px-5 z-50 pb-4"
      } pt-4 pb-2`}
    >
      {menuItems.map((item: MenuItem, index) => (
        <div
          key={item.href}
          className={`flex group ${deviceSize === "desktop" ? "items-center gap-4" : "gap-4 flex-col"}`}
        >
          <Link
            href={item.href}
            className={`text-sm md:text-base group-hover:font-bold group-hover:translate-y-0.5 duration-200 transition-all`}
          >
            {item.label}
          </Link>
          {index < menuItems.length - 1 && (
            <span
              className={`block ${
                deviceSize === "desktop"
                  ? "w-[2.5px] h-5 bg-white group-hover:bg-amber-300 group-hover:-translate-y-0.5"
                  : " h-[2.5px] w-9/10 bg-white"
              } duration-200`}
            />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Navbar;

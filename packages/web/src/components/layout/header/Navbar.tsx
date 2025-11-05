"use client";

import { MenuItem } from "@/types/types";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

interface props {
  deviceSize: "mobile" | "desktop";
}

// Menu items for main site
const mainMenuItems: MenuItem[] = [
  { label: "شبکه نیازسنجی", href: "/network" },
  { label: "دربارۀ ما", href: "/about-us" },
  { label: "طرح‌های جاری", href: "/projects/active" },
  { label: "اخبار", href: "/news" },
  { label: "مجلۀ مهر باران", href: "/blog" },
  { label: "ثبت‌نام", href: "/signup" },
];

// Menu items for network pages
const networkMenuItems: MenuItem[] = [
  { label: "صفحه اصلی", href: "/" },
  { label: "خانه", href: "/network" },
  { label: "کاوش", href: "/network/explore" },
  { label: "پرطرفدارها", href: "/network/trending" },
  { label: "تیم‌ها", href: "/network/teams" },
  { label: "داستان‌ها", href: "/network/stories" },
  { label: "رتبه‌بندی", href: "/network/leaderboard" },
  { label: "پروفایل", href: "/network/profile" },
];

const Navbar: React.FC<props> = ({ deviceSize }) => {
  const pathname = usePathname();
  const isNetworkPage = pathname?.startsWith("/network");
  const menuItems = isNetworkPage ? networkMenuItems : mainMenuItems;

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
            className={`text-sm md:text-base group-hover:font-bold group-hover:translate-y-0.5 duration-200 transition-all ${
              pathname === item.href ? "font-bold" : ""
            }`}
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

"use client";

import { MenuItem } from "@/types/types";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

interface NavbarProps {
  deviceSize: "mobile" | "desktop";
  setOpen?: (open: boolean) => void;
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

const Navbar: React.FC<NavbarProps> = ({ deviceSize, setOpen }) => {
  const pathname = usePathname();
  const isNetworkPage = pathname?.startsWith("/network");
  const menuItems = isNetworkPage ? networkMenuItems : mainMenuItems;

  return (
    <nav
      className={`flex justify-between w-full duration-300 transition-all text-white ${
        deviceSize === "desktop"
          ? "items-center gap-4 pt-4 pb-2"
          : "flex-col gap-3 pt-2 pb-2"
      }`}
    >
      {menuItems.map((item: MenuItem, index) => (
        <div
          key={item.href}
          className={`flex group ${deviceSize === "desktop" ? "items-center gap-4" : "flex-col gap-2"}`}
        >
          <Link
            href={item.href}
            onClick={() => {
              if (setOpen) setOpen(false);
            }}
            className={`text-sm md:text-base group-hover:font-semibold duration-200 transition-all ${
              pathname === item.href ? "font-bold underline decoration-amber-300 underline-offset-4" : ""
            } ${deviceSize === "mobile" ? "py-1.5 px-3 hover:bg-white/10 rounded-md transition-colors" : ""}`}
          >
            {item.label}
          </Link>
          {index < menuItems.length - 1 && (
            <span
              className={`block ${
                deviceSize === "desktop"
                  ? "w-[2.5px] h-5 bg-white group-hover:bg-amber-300 group-hover:-translate-y-0.5"
                  : "h-[1px] w-full bg-white/10"
              } duration-200`}
            />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Navbar;

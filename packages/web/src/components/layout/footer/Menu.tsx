import { MenuItem } from "@/types/types";
import Link from "next/link";
import React from "react";

const menuItems: MenuItem[] = [
  { label: "پرسش‌های متداول", href: "/faqs" },
  { label: "در کنار هم چه کردیم", href: "/projects/completed" },
  { label: "طرح‌های در حال اجرا", href: "/projects/active" },
  { label: "اخبار", href: "/news" },
  { label: "مجلۀ مهر باران", href: "/blog" },
  { label: "حوزه‌های فعالیت", href: "/focus" },
  { label: "دربارۀ ما", href: "/about-us" },
  { label: "تماس با ما", href: "/contact-us" },
];

const Menu: React.FC = () => {
  return (
    <nav className="border-y-2 py-8 px-8 md:px-0 border-white w-full grid grid-cols-2 gap-4 md:flex justify-between items-center text-gray-150">
      {menuItems.map((item: MenuItem) => (
        <div key={item.href} className={`flex items-center gap-1.5 group relative`}>
          <span
            className={
              "block w-3.5 h-3.5 rounded-sm md:w-4.5 md:h-4.5 md:rounded-md bg-white group-hover:w-0.5 group-hover:mr-4 group-hover:h-3.5 group-hover:animate-ping duration-200 transition-all group-hover:bg-amber-200"
            }
          />
          <Link
            href={item.href}
            className={`text-xs md:text-sm transition-all duration-200 group-hover:-translate-x-2 group-hover:font-bold group-hover:text-amber-200`}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default Menu;

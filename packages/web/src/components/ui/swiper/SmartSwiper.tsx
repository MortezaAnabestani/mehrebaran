"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef, useState } from "react";
import SwiperButton from "./SwiperButton";

interface SmartSwiperProps {
  items: React.ReactNode[];
  slidesPerView?: number;
  spaceBetween?: number;
  loop?: boolean;
  autoplay?: boolean | { delay: number; disableOnInteraction?: boolean };
  showNavigation?: boolean;
  showPagination?: boolean;
  centeredSlides?: boolean;
  grabCursor?: boolean;
  breakpoints?: {
    [width: number]: {
      slidesPerView: number;
      spaceBetween?: number;
    };
  };
  onSlideChange?: (swiper: any) => void;
  onSwiper?: (swiper: any) => void;
  outsideBtn?: boolean;
}

const SmartSwiper: React.FC<SmartSwiperProps> = ({
  items,
  slidesPerView,
  spaceBetween = 16,
  loop = false,
  autoplay = false,
  showNavigation = false,
  showPagination = false,
  centeredSlides = false,
  grabCursor = false,
  breakpoints,
  onSlideChange,
  onSwiper,
  outsideBtn = true,
}) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handleSwiper = (swiper: SwiperType) => {
    setSwiperInstance(swiper);
    if (onSwiper) {
      onSwiper(swiper);
    }
  };

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        slidesPerView={breakpoints ? undefined : slidesPerView ?? 1}
        spaceBetween={spaceBetween}
        loop={loop}
        autoplay={autoplay}
        navigation={
          showNavigation
            ? {
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }
            : false
        }
        pagination={showPagination ? { clickable: true } : false}
        centeredSlides={centeredSlides}
        grabCursor={grabCursor}
        breakpoints={breakpoints}
        onSlideChange={onSlideChange}
        onSwiper={handleSwiper}
        onInit={(swiper) => {
          if (showNavigation && swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>{item}</SwiperSlide>
        ))}
      </Swiper>
      {showNavigation && (
        <div className="hidden md:block">
          <SwiperButton prevRef={prevRef} nextRef={nextRef} outsideBtn={outsideBtn} />
        </div>
      )}
    </div>
  );
};

export default SmartSwiper;

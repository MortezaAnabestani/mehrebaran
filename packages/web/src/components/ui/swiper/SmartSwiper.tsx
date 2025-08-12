"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef } from "react";
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
  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        slidesPerView={breakpoints ? undefined : slidesPerView ?? 1}
        spaceBetween={spaceBetween}
        loop={loop}
        autoplay={autoplay}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={showPagination ? { clickable: true } : false}
        centeredSlides={centeredSlides}
        grabCursor={grabCursor}
        breakpoints={breakpoints}
        onSlideChange={onSlideChange}
        onSwiper={onSwiper}
        onBeforeInit={(swiper) => {
          const navigation = swiper.params.navigation;
          if (navigation && typeof navigation !== "boolean") {
            navigation.prevEl = prevRef.current;
            navigation.nextEl = nextRef.current;
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

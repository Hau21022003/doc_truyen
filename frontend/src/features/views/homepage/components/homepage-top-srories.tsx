"use client";

import { HomepageStory } from "@/features/data/story/story.types";
import { useIsMobile } from "@/hooks";
import { cn } from "@/lib/utils";
import { imageUtils } from "@/shared/utils/image.utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface HomepageTopStoriesProps {
  topStories: HomepageStory[];
  // title?: string;
}

// Số phần tử hiển thị trên mỗi view theo breakpoint
const ITEMS_PER_VIEW = {
  mobile: 1,
  desktop: 3,
};

export function HomepageTopStories({
  topStories,
  // title = "Top Truyện",
}: HomepageTopStoriesProps) {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  const startXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // const { data: topStoriesData } = useHotStoriesQuery();
  // const topStories = topStoriesData?.payload.data || [];

  const visibleCount = isMobile
    ? ITEMS_PER_VIEW.mobile
    : ITEMS_PER_VIEW.desktop;
  const maxIndex = Math.max(0, topStories.length - visibleCount);

  // Navigation functions
  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [maxIndex]);

  // Touch handlers cho mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;

    const currentX = e.touches[0].clientX;
    const diff = startXRef.current - currentX;

    // Visual feedback khi swipe (optional)
    containerRef.current.style.transform = `translateX(calc(-${currentIndex * (100 / visibleCount)}% - ${diff}px))`;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startXRef.current - e.changedTouches[0].clientX;
    const swipeThreshold = 50; // Pixels để kích hoạt swipe

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        next(); // Swipe left -> next
      } else {
        prev(); // Swipe right -> prev
      }
    }

    // Reset transform
    if (containerRef.current) {
      containerRef.current.style.transition = "transform 500ms ease-in-out";
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transform = "";
        }
      }, 10);
    }
  };

  // Reset index khi đổi giữa mobile và desktop
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile]);

  // Tính toán số lượng dots
  const dotCount = Math.max(0, topStories.length - visibleCount + 1);

  return (
    <section className="w-full py-10">
      <div className="container mx-auto">
        <h2 className="text-xl font-bold mb-6">{t("homepage.topStories")}</h2>

        {/* Slider Container */}
        <div
          className="relative overflow-hidden mb-6"
          data-testid="top-stories-slider"
        >
          {/* Stories Track */}
          <div
            ref={containerRef}
            className="flex -mx-2 transition-transform duration-500 ease-in-out"
            style={{
              transform: isMobile
                ? `translateX(-${currentIndex * 100}%)`
                : `translateX(-${currentIndex * (100 / 3)}%)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {topStories.map((story, idx) => (
              <div key={story.id} className="shrink-0 w-full md:w-1/3 px-2">
                <div className="relative aspect-[3/4] overflow-hidden group">
                  {/* Story Cover Image */}
                  <Link href={`/story/${story.slug}`}>
                    <img
                      src={
                        story.coverImage
                          ? imageUtils.optimizeCloudinary(story.coverImage)
                          : "/placeholder-image.jpg"
                      }
                      alt={`CoverImage_${story.id}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading={idx < visibleCount ? "eager" : "lazy"}
                    />
                  </Link>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Story Title - Absolute positioned */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Link href={`/story/${story.slug}`}>
                      <h3 className="text-white font-semibold text-lg line-clamp-2 hover:text-primary-orange transition-colors">
                        {story.title}
                      </h3>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        {dotCount > 1 && (
          <div className="flex justify-center items-center gap-2">
            {Array.from({ length: dotCount }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-orange",
                  idx === currentIndex
                    ? "bg-primary-orange w-6 scale-110"
                    : "bg-gray-300 hover:bg-gray-400",
                )}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === currentIndex ? "true" : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

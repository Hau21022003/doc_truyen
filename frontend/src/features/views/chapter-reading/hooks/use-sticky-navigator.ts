import { useEffect, useRef, useState } from "react";

interface UseStickyNavigatorParams {
  /** Threshold scroll position để bắt đầu hiện sticky nav (pixels) */
  threshold?: number;
  /** Selector của element đánh dấu hết chapter content */
  contentEndSelector?: string;
}

export function useStickyNavigator({
  threshold = 200,
  contentEndSelector = "[data-chapter-content-end]", // Default selector
}: UseStickyNavigatorParams = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // ✅ Check đến cuối của chapter content (không phải cả document)
      const contentEndElement = document.querySelector(contentEndSelector);
      const contentEndPosition =
        contentEndElement?.getBoundingClientRect().top ||
        document.documentElement.scrollHeight;
      const scrollPastContent =
        currentScrollY + windowHeight >= contentEndPosition - 50;

      setIsAtBottom(scrollPastContent);

      // Nếu đã scroll qua hết chapter content → ẩn sticky nav
      if (scrollPastContent) {
        setIsVisible(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Chỉ hiện khi scroll UP và đã qua threshold
      const isScrollingUp = currentScrollY < lastScrollY.current;
      const isPastThreshold = currentScrollY > threshold;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsVisible(isPastThreshold && isScrollingUp);
      }, 100);

      lastScrollY.current = currentScrollY;
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [threshold, contentEndSelector]);

  return {
    isVisible: isVisible && !isAtBottom,
    isAtBottom,
  };
}

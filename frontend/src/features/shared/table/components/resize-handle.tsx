import React, { useEffect, useRef, useState } from "react";

interface ResizeHandleProps extends React.HTMLProps<HTMLDivElement> {
  onResize?: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

export function ResizeHandle({
  className = "",
  onResize,
  minWidth = 50,
  maxWidth = Infinity,
  ...props
}: ResizeHandleProps) {
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX.current;
      const newWidth = startWidth.current + diff;

      const finalWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      onResize?.(finalWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth, onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    startX.current = e.clientX;

    const parent = e.currentTarget.closest("[data-resizable]");
    if (parent) {
      startWidth.current = parent.getBoundingClientRect().width;
    }
  };

  return (
    <div
      className={`absolute top-0 right-0 bottom-0 flex items-center justify-center z-10 ${className}`}
    >
      <div
        className="group h-[60%] w-3 flex items-center justify-center cursor-col-resize"
        onMouseDown={handleMouseDown}
        {...props}
      >
        <div
          className={`
          h-full w-[2px] rounded-sm bg-primary/25
          group-hover:bg-primary/40 group-active:bg-primary/50
          ${isResizing ? "bg-primary/40" : ""}
        `}
        />
      </div>
    </div>
  );
}

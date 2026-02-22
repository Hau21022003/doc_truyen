import { cn } from "@/lib/utils";
import { IconProps, iconVariants } from "./icon-variants";

export function IconPrevious({
  className,
  size,
  color,
  variant,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={cn(iconVariants({ size, color, variant }), className)}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        d="m15 6l-6 6l6 6"
      />
    </svg>
  );
}

export default IconPrevious;

import { cn } from "@/lib/utils";
import { IconProps, iconVariants } from "./icon-variants";

export function IconCalendarOutline({
  className,
  size,
  color,
  variant,
  ...props
}: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={cn(iconVariants({ size, color, variant }), className)}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <rect width="20" height="18" x="2" y="4" rx="4" />
        <path d="M8 2v4m8-4v4M2 10h20" />
      </g>
    </svg>
  );
}

export default IconCalendarOutline;

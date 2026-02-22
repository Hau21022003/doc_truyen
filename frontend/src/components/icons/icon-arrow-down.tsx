import { cn } from "@/lib/utils";
import { IconProps, iconVariants } from "./icon-variants";

export function IconArrowDown({
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
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m7 10l5 5m0 0l5-5"
      />
    </svg>
  );
}

export default IconArrowDown;

import { cn } from "@/lib/utils";
import { IconProps, iconVariants } from "./icon-variants";

export function IconHamburger({
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
      <title>hamburger</title>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 17h14M5 12h14M5 7h14"
      />
    </svg>
  );
}

export default IconHamburger;

import { cn } from "@/lib/utils";
import { IconProps, iconVariants } from "./icon-variants";

export function IconArrowLeft({
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
        strokeWidth="1.5"
        d="M20 12H4m0 0l6-6m-6 6l6 6"
      />
    </svg>
  );
}

export default IconArrowLeft;

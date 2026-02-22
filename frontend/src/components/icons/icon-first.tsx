import { cn } from "@/lib/utils";
import { IconProps, iconVariants } from "./icon-variants";

export function IconFirst({
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
        fill="currentColor"
        d="m11.6 7l-1.1-1L5 12l5.5 6l1.1-1L7 12zm6 0l-1.1-1l-5.5 6l5.5 6l1.1-1l-4.6-5z"
      />
    </svg>
  );
}

export default IconFirst;

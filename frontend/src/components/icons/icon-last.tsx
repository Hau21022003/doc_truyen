import { cn } from "@/lib/utils";
import { IconProps, iconVariants } from "./icon-variants";

export function IconLast({
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
        d="M6.6 6L5.4 7l4.5 5l-4.5 5l1.1 1l5.5-6zm6 0l-1.1 1l4.5 5l-4.5 5l1.1 1l5.5-6z"
      />
    </svg>
  );
}

export default IconLast;

import { cn } from "@/lib/utils";
import { IconProps, iconVariants } from "./icon-variants";

export function IconCircleXFill({
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
        fillRule="evenodd"
        d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1m3.707 8.707a1 1 0 0 0-1.414-1.414L12 10.586L9.707 8.293a1 1 0 1 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default IconCircleXFill;

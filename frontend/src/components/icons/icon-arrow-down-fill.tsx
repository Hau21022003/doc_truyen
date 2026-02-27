import { cn } from "@/lib/utils";
import { IconProps, iconVariants } from "./icon-variants";

export function IconArrowDownFill({
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
        d="M7 9a1 1 0 0 0-.707 1.707l5 5a1 1 0 0 0 1.414 0l5-5A1 1 0 0 0 17 9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default IconArrowDownFill;

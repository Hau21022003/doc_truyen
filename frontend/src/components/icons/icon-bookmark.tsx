import { cn } from "@/lib/utils";
import { IconProps, iconVariants } from "./icon-variants";

export function IconBookmark({
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
      <title>bookmark</title>
      <path
        fill="currentColor"
        d="M5 21V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v16l-7-3z"
      />
    </svg>
  );
}

export default IconBookmark;

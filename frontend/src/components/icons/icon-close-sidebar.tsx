import { cn } from "@/lib/utils";
import { IconProps, iconVariants } from "./icon-variants";

export function IconCloseSidebar({
  className,
  size,
  color,
  variant,
  title,
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
      <title>{title ?? "close-sidebar-alt-solid"}</title>
      <g fill="currentColor">
        <path d="M13 21h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-6z" />
        <path
          fillRule="evenodd"
          d="M11 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6zm-2.293 7.707a1 1 0 0 0-1.414-1.414l-2 2a1 1 0 0 0 0 1.414l2 2a1 1 0 0 0 1.414-1.414L7.414 12z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default IconCloseSidebar;

import { cn } from "@/lib/utils";
import { IconProps, iconVariants } from "./icon-variants";

export function IconLayoutDashboard({
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
        d="M9 3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2zm10-4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zm0-8a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      />
    </svg>
  );
}

export default IconLayoutDashboard;

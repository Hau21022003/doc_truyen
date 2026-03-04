import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Checkbox } from "./ui/checkbox";

const customCheckboxVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "h-4 w-4 [&_svg:not([class*='size-'])]:size-3",
      default: "h-5 w-5 [&_svg:not([class*='size-'])]:size-4",
      lg: "h-6 w-6 [&_svg:not([class*='size-'])]:size-5",
    },
    color: {
      default: "",
      orange:
        "border-gray-300 data-[state=checked]:bg-primary-orange dark:data-[state=checked]:bg-primary-orange data-[state=checked]:border-primary-orange data-[state=checked]:text-white",
      purple:
        "border-gray-300 data-[state=checked]:bg-primary-purple dark:data-[state=checked]:bg-primary-purple data-[state=checked]:border-primary-purple data-[state=checked]:text-white",
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
  },
});

type CustomCheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof customCheckboxVariants> & {
    checked?: boolean;
    className?: string;
    onCheckedChange?: (checked: boolean) => void;
  };

export default function CustomCheckbox({
  checked,
  onCheckedChange,
  color,
  size,
  className,
  ...props
}: CustomCheckboxProps) {
  return (
    <Checkbox
      {...props}
      checked={checked}
      className={cn(customCheckboxVariants({ size, color }), className)}
      onCheckedChange={onCheckedChange}
    />
  );
}

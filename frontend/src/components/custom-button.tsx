import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Button } from "./ui/button";

const customButtonVariants = cva("cursor-pointer", {
  variants: {
    color: {
      default: "",
      orange:
        "bg-primary-orange text-primary-orange-foreground hover:bg-primary-orange dark:hover:bg-primary-orange hover:text-primary-orange-foreground dark:hover:text-primary-orange-foreground",
      purple:
        "bg-primary-purple text-primary-purple-foreground hover:bg-primary-purple dark:hover:bg-primary-purple hover:text-primary-purple-foreground dark:hover:text-primary-purple-foreground",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

type CustomButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof customButtonVariants> & {
    asChild?: boolean;
  } & {
    size?:
      | "default"
      | "xs"
      | "sm"
      | "lg"
      | "icon"
      | "icon-xs"
      | "icon-sm"
      | "icon-lg";
  };

export default function CustomButton({
  className,
  size = "default",
  asChild = false,
  children,
  color,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      {...props}
      className={cn(customButtonVariants({ color, className }))}
      // className="cursor-pointer bg-primary-orange text-primary-orange-foreground hover:bg-primary-orange dark:hover:bg-primary-orange hover:text-primary-orange-foreground dark:hover:text-primary-orange-foreground"
      variant={"ghost"}
      size={size}
      asChild={asChild}
    >
      {children}
    </Button>
  );
}

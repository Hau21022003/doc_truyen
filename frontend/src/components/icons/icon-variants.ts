// src/components/icons/icon-variants.ts
import { cva, type VariantProps } from "class-variance-authority";

export const iconVariants = cva(
  "inline-flex items-center justify-center transition-all",
  {
    variants: {
      size: {
        xs: "h-4 w-4",
        sm: "h-5 w-5",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-10 w-10",
        "2xl": "h-12 w-12",
        "3xl": "h-16 w-16",
      },
      color: {
        default: "text-primary",
        muted: "text-muted-foreground",
        accent: "text-accent-foreground",
        destructive: "text-destructive",
        success: "text-green-600",
        warning: "text-yellow-600",
        info: "text-blue-600",
        "btn-primary": "text-[var(--btn-primary)]",
        custom: "",
      },
      variant: {
        default: "",
        outlined: "border-2 border-current rounded-md p-1",
        filled: "bg-current text-background rounded-md p-1",
        shadow: "drop-shadow-md",
        glow: "drop-shadow-lg filter",
      },
    },
    defaultVariants: {
      size: "default",
      color: "default",
      variant: "default",
    },
  },
);

export type IconVariantsProps = VariantProps<typeof iconVariants>;

// Generic type cho tất cả icon components
export type IconProps = Omit<React.SVGProps<SVGSVGElement>, "size"> &
  IconVariantsProps & {
    asChild?: boolean;
    title?: string;
  };

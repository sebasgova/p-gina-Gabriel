import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonStyles = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-black hover:bg-accent-soft",
        secondary:
          "border border-line-strong bg-white/[0.03] text-paper hover:border-accent/50 hover:bg-white/[0.06]",
        ghost: "text-paper hover:text-accent",
      },
      size: {
        default: "h-13 px-7 py-3.5",
        sm: "h-10 px-5 text-xs",
        lg: "h-15 px-9 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

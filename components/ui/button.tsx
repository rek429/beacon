import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-white text-slate-500 border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100",
        primary:
          "bg-[#6B6FD4] text-white border-[#5558C8] border-b-4 active:border-b-0 hover:bg-[#6B6FD4]/90",
        primaryOutline:
          "bg-white text-[#6B6FD4] border-2 border-[#6B6FD4] hover:bg-[#6B6FD4]/5",
        secondary:
          "bg-green-500 text-white border-green-600 border-b-4 active:border-b-0 hover:bg-green-500/90",
        secondaryOutline:
          "bg-white text-green-500 border-2 border-green-500 hover:bg-green-100/10",
        danger:
          "bg-rose-500 text-white border-rose-600 border-b-4 active:border-b-0 hover:bg-rose-500/90",
        dangerOutline:
          "bg-white text-rose-500 border-2 border-rose-500 hover:bg-rose-100/10",
        super:
          "bg-indigo-500 text-white border-indigo-600 border-b-4 active:border-b-0 hover:bg-indigo-500/90",
        superOutline:
          "bg-white text-indigo-500 border-2 border-indigo-500 hover:bg-indigo-100/10",
        ghost:
          "bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100",
        sidebar:
          "bg-transparent text-[#8B8FA8] border-2 border-transparent hover:bg-white/5 hover:text-white justify-start",
        sidebarOutline:
          "bg-[#6B6FD4]/15 text-white border-[#6B6FD4]/40 border-2 hover:bg-[#6B6FD4]/20 justify-start",
        locked:
          "bg-neutral-200 text-neutral-400 border-neutral-300 border-b-4 active:border-b-0 cursor-default",
        outline:
          "bg-white text-[#6B6FD4] border-2 border-[#6B6FD4] hover:bg-[#6B6FD4]/5",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
        rounded: "rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

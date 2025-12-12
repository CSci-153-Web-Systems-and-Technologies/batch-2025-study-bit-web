import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                    {
                        "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 focus-visible:ring-cyan-500 shadow-lg shadow-cyan-500/25":
                            variant === "primary",
                        "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 focus-visible:ring-white":
                            variant === "secondary",
                        "text-neutral-300 hover:text-white hover:bg-white/10 focus-visible:ring-white":
                            variant === "ghost",
                    },
                    {
                        "text-sm px-4 py-2": size === "sm",
                        "text-base px-6 py-3": size === "md",
                        "text-lg px-8 py-4": size === "lg",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };

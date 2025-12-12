import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg" | "xl";
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, size = "lg", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "mx-auto w-full px-4 sm:px-6 lg:px-8",
                    {
                        "max-w-3xl": size === "sm",
                        "max-w-5xl": size === "md",
                        "max-w-6xl": size === "lg",
                        "max-w-7xl": size === "xl",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Container.displayName = "Container";

export { Container };

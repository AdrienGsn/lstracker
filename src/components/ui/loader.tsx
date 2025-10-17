"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const loaderVariants = cva("animate-spin", {
    variants: {
        size: {
            default: "size-8",
            sm: "size-5",
            xs: "size-3",
            icon: "size-10",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

interface LoaderProps
    extends React.HTMLAttributes<SVGSVGElement>,
        VariantProps<typeof loaderVariants> {}

export const Loader = ({ className, size }: LoaderProps) => {
    return <Loader2 className={cn(loaderVariants({ size, className }))} />;
};

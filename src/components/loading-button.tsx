"use client";

import { motion } from "framer-motion";
import { CircleCheck } from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

export const LoadingButton = ({
	loading,
	children,
	variant,
	className,
	...props
}: ButtonProps & { loading?: boolean; success?: string }) => {
	return (
		<Button
			variant={variant}
			className={cn("relative", className)}
			disabled={props.disabled || loading}
			{...props}
		>
			<motion.span
				className="flex items-center gap-2"
				animate={{ opacity: loading ? 0 : 1, y: loading ? -10 : 0 }}
			>
				{children}
			</motion.span>
			<motion.span
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: loading ? 1 : 0, y: loading ? 0 : 10 }}
				exit={{ opacity: 0, y: 10 }}
				className="absolute"
			>
				<Loader size="sm" />
			</motion.span>
			{props.success && !loading && (
				<motion.span
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 10 }}
					className="absolute flex items-center gap-1"
				>
					<CircleCheck className="text-green-500" />
					{props.success}
				</motion.span>
			)}
		</Button>
	);
};

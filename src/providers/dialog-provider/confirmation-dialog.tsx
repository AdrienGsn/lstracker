"use client";

import { ReactElement, ReactNode } from "react";

import { LoadingButton } from "@/components/loading-button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type ConfirmationDialogProps = {
	title?: string;
	description?: string | ReactNode;
	action?:
		| {
				label: string;
				onClick: () => void | Promise<void>;
				variant?:
					| "default"
					| "destructive"
					| "outline"
					| "secondary"
					| "ghost"
					| "link";
		  }
		| ReactElement;
	cancel?: { label?: string; onClick?: () => void | Promise<void> };
	loading?: boolean;
	children?: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
	return (
		<AlertDialog
			open={props.open ?? true}
			onOpenChange={props.onOpenChange}
		>
			<AlertDialogContent>
				{props.children ? (
					props.children
				) : (
					<>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{props.title ?? ""}
							</AlertDialogTitle>
							{typeof props.description === "string" ? (
								<AlertDialogDescription>
									{props.description}
								</AlertDialogDescription>
							) : (
								props.description
							)}
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel
								disabled={props.loading}
								onClick={props.cancel?.onClick}
							>
								{props.cancel?.label ?? "Cancel"}
							</AlertDialogCancel>
							{props.action && "label" in props.action ? (
								<AlertDialogAction
									disabled={props.loading}
									onClick={props.action.onClick}
									variant={props.action.variant}
									asChild
								>
									<LoadingButton loading={props.loading}>
										{props.action.label}
									</LoadingButton>
								</AlertDialogAction>
							) : (
								props.action
							)}
						</AlertDialogFooter>
					</>
				)}
			</AlertDialogContent>
		</AlertDialog>
	);
};

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { FieldValues } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";

import { LoadingButton } from "@/components/loading-button";
import { Form, type FormProps } from "@/components/ui/form";

import { CtrlOrMeta, Kbd, KbdGroup } from "@/components/ui/kbd";
import { Typography } from "@/components/ui/typography";
import { useWarnIfUnsavedChanges } from "@/hooks/use-warn-if-unsaved-changes";
import { cn } from "@/lib/utils";

export const FormUnsavedBar = <T extends FieldValues>(props: FormProps<T>) => {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const submit = () => buttonRef.current?.click();

	const isDirty = props.form.formState.isDirty;

	useHotkeys(
		"meta+s",
		(event) => {
			event.preventDefault();

			submit();
		},
		{ enabled: isDirty }
	);

	useWarnIfUnsavedChanges(
		isDirty,
		"Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter ?"
	);

	return (
		<>
			<Form {...props.form}>
				<form
					onSubmit={props.form.handleSubmit(props.onSubmit)}
					className={cn(props.className)}
				>
					{props.children}
					<button type="submit" className="hidden" ref={buttonRef} />
				</form>
			</Form>
			{isMounted &&
				createPortal(
					<div className="pointer-events-none absolute inset-x-0 bottom-4 flex w-full items-center justify-center">
						<AnimatePresence>
							{isDirty ? (
								<motion.div
									key="save-bar"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{
										opacity: [1, 1, 0],
										y: [0, -10, 20],
										transition: { duration: 0.5 },
									}}
									className="pointer-events-auto flex items-center gap-4 rounded-md border bg-card p-1 lg:p-2"
								>
									<Typography variant="small">
										Des modifications ont été effectuées.
										Enregistrez maintenant !
									</Typography>
									<LoadingButton
										size="sm"
										loading={
											props.disabled ??
											props.form.formState.isSubmitting
										}
										variant="success"
										onClick={() => {
											submit();
										}}
									>
										Sauvegarder{" "}
										<KbdGroup>
											<Kbd>
												<CtrlOrMeta />
											</Kbd>
											<Kbd>S</Kbd>
										</KbdGroup>
									</LoadingButton>
								</motion.div>
							) : null}
						</AnimatePresence>
					</div>,
					document.body
				)}
		</>
	);
};

"use client";

import { toast } from "sonner";
import { create } from "zustand";

import { logger } from "@/lib/logger";

import {
	ConfirmationDialog,
	ConfirmationDialogProps,
} from "./confirmation-dialog";

export type DialogType = ConfirmationDialogProps & {
	id: string;
	open: boolean;
};

type DialogStore = {
	dialogs: DialogType[];
	addDialog: (dialog: ConfirmationDialogProps) => string;
	removeDialog: (dialogId: string) => void;
	closeDialogGracefully: (dialogId: string) => void;
};

const useDialogStore = create<DialogStore>((set, get) => ({
	dialogs: [],
	addDialog: (dialog) => {
		const id = Math.random().toString(36).slice(2, 9);
		const { removeDialog, closeDialogGracefully } = get();

		const newDialog: DialogType = {
			...dialog,
			cancel: {
				label: dialog.cancel?.label ?? "Cancel",
				onClick: () => {
					if (
						dialog.cancel &&
						"onClick" in dialog.cancel &&
						dialog.cancel.onClick
					) {
						const ret = dialog.cancel.onClick();

						if (ret instanceof Promise) {
							ret.then(() => closeDialogGracefully(id)).catch(
								(err) =>
									toast.error("Some error occured", {
										description: err?.message,
									})
							);

							return;
						}
					}

					closeDialogGracefully(id);
				},
			},
			action:
				dialog.action && "onClick" in dialog.action
					? {
							label: dialog.action.label ?? "",
							variant: dialog.action.variant ?? "default",
							onClick: () => {
								if (
									dialog.action &&
									"onClick" in dialog.action === false
								) {
									logger.error("Invalid dialog action");

									closeDialogGracefully(id);

									return;
								}

								const onClickReturn = dialog.action?.onClick();

								if (onClickReturn instanceof Promise) {
									set((state) => {
										const d = state.dialogs.find(
											(d) => d.id === id
										);

										if (d) d.loading = true;

										return { dialogs: [...state.dialogs] };
									});

									onClickReturn
										.then(() => {
											closeDialogGracefully(id);
										})
										.catch((error) => {
											toast.error("Some error occured", {
												description: error?.message,
											});

											set((state) => {
												const d = state.dialogs.find(
													(d) => d.id === id
												);

												if (d) d.loading = false;

												return {
													dialogs: [...state.dialogs],
												};
											});
										});
								} else {
									closeDialogGracefully(id);
								}
							},
					  }
					: dialog.action,
			loading: false,
			id,
			open: true,
		};

		set((state) => ({ dialogs: [...state.dialogs, newDialog] }));

		return id;
	},
	removeDialog: (dialogId) =>
		set((state) => ({
			dialogs: state.dialogs.filter((dialog) => dialog.id !== dialogId),
		})),
	closeDialogGracefully: (dialogId: string) => {
		set((state) => ({
			dialogs: state.dialogs.map((d) =>
				d.id === dialogId ? { ...d, open: false } : d
			),
		}));

		setTimeout(() => {
			try {
				document.body.style.overflow = "";
				document.body.style.pointerEvents = "auto";
				document.documentElement.removeAttribute("inert");
				document.body.removeAttribute("aria-hidden");

				document
					.querySelectorAll("[data-remove-scroll-bar]")
					.forEach((el) => el.remove());
				document
					.querySelectorAll("[data-focus-lock-disabled]")
					.forEach((el) => el.remove());
				document
					.querySelectorAll("[data-radix-portal]")
					.forEach((el) => el.remove());
			} catch (e) {
				console.warn("Dialog cleanup failed", e);
			}

			get().removeDialog(dialogId);
		}, 300);
	},
}));

export const DialogProvider = () => {
	const dialogs = useDialogStore((state) => state.dialogs);

	const dialog = dialogs[0] as DialogType | undefined;

	if (dialog) {
		return (
			<ConfirmationDialog
				{...dialog}
				onOpenChange={(open: boolean) => {
					if (!open) {
						useDialogStore
							.getState()
							.closeDialogGracefully(dialog.id);
					} else {
						useDialogStore.setState((state) => ({
							dialogs: state.dialogs.map((d) =>
								d.id === dialog.id ? { ...d, open } : d
							),
						}));
					}
				}}
			/>
		);
	}

	return null;
};

export const dialog = {
	add: (dialog: ConfirmationDialogProps) =>
		useDialogStore.getState().addDialog(dialog),
	remove: (dialogId: string) =>
		useDialogStore.getState().removeDialog(dialogId),
};

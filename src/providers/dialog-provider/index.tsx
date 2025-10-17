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
};

type DialogStore = {
	dialogs: DialogType[];
	addDialog: (dialog: ConfirmationDialogProps) => string;
	removeDialog: (dialogId: string) => void;
};

const useDialogStore = create<DialogStore>((set, get) => ({
	dialogs: [],
	addDialog: (dialog) => {
		const id = Math.random().toString(36).slice(2, 9);
		const { removeDialog } = get();

		const newDialog: DialogType = {
			...dialog,
			cancel: {
				label: dialog.cancel?.label ?? "Cancel",
				onClick: () => {
					if (dialog.cancel && "onClick" in dialog.cancel) {
						dialog.cancel.onClick?.();

						return;
					}

					removeDialog(id);
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

									removeDialog(id);

									return;
								}

								const onClickReturn = dialog.action?.onClick();

								if (onClickReturn instanceof Promise) {
									set((state) => {
										const dialog = state.dialogs.find(
											(dialog) => dialog.id === id
										);

										if (dialog) {
											dialog.loading = true;
										}

										return { dialogs: [...state.dialogs] };
									});

									onClickReturn
										.then(() => {
											removeDialog(id);
										})
										.catch((error) => {
											toast.error("Some error occured", {
												description: error.message,
											});
										});
								} else {
									removeDialog(id);
								}
							},
					  }
					: dialog.action,
			loading: false,
			id,
		};

		set((state) => ({ dialogs: [...state.dialogs, newDialog] }));

		return id;
	},
	removeDialog: (dialogId) =>
		set((state) => ({
			dialogs: state.dialogs.filter((dialog) => dialog.id !== dialogId),
		})),
}));

export const DialogProvider = () => {
	const dialogs = useDialogStore((state) => state.dialogs);

	const dialog = dialogs[0] as DialogType | undefined;

	if (dialog) {
		return <ConfirmationDialog {...dialog} />;
	}

	return null;
};

export const dialog = {
	add: (dialog: ConfirmationDialogProps) =>
		useDialogStore.getState().addDialog(dialog),
	remove: (dialogId: string) =>
		useDialogStore.getState().removeDialog(dialogId),
};

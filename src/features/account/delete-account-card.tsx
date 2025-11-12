"use client";

import { deleteAccountAction } from "@/actions/account/delete";
import { LoadingButton } from "@/components/loading-button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { dialog } from "@/providers/dialog-provider";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const DeleteAccountCard = () => {
	const router = useRouter();

	const { executeAsync, isPending } = useAction(deleteAccountAction, {
		onSuccess: () => {
			router.replace("/");

			toast.success("Votre compte a été supprimé avec succès.");
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Supprimez votre compte</CardTitle>
				<CardDescription>wddwdwd</CardDescription>
			</CardHeader>
			<CardFooter className="justify-end">
				<LoadingButton
					variant="destructive"
					loading={isPending}
					onClick={() => {
						dialog.add({
							title: "Êtes-vous sûr de vouloir supprimer votre compte ?",
							description:
								"Cette action est irréversible. Toutes vos données seront définitivement supprimées.",
							action: {
								label: "Supprimer",
								variant: "destructive",
								onClick: async () => {
									await executeAsync();
								},
							},
						});
					}}
				>
					Supprimer
				</LoadingButton>
			</CardFooter>
		</Card>
	);
};

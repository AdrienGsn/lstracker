"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteOrganizationAction } from "@/actions/organization/delete";
import { LoadingButton } from "@/components/loading-button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { dialog } from "@/providers/dialog-provider";

export const DeleteOrgCard = () => {
	const router = useRouter();

	const { executeAsync, isPending } = useAction(deleteOrganizationAction, {
		onSuccess: ({ data }) => {
			router.refresh();

			toast.success(
				`L’organisation "${data?.name}" a bien été supprimée !`
			);
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Supprimer l’organisation</CardTitle>
				<CardDescription>
					Cette action est{" "}
					<span className="font-semibold">définitive</span> et
					supprimera toutes les données liées à cette organisation.
					Veuillez confirmer votre décision.
				</CardDescription>
			</CardHeader>
			<CardFooter className="justify-end">
				<LoadingButton
					variant="destructive"
					loading={isPending}
					onClick={() => {
						dialog.add({
							title: "Confirmer la suppression",
							description:
								"Êtes-vous sûr de vouloir supprimer cette organisation ? Cette action est irréversible et toutes les données associées seront définitivement supprimées.",
							action: {
								label: "Oui, supprimer",
								variant: "destructive",
								onClick: async () => {
									await executeAsync();
								},
							},
							loading: isPending,
						});
					}}
				>
					Supprimer l’organisation
				</LoadingButton>
			</CardFooter>
		</Card>
	);
};

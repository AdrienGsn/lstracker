"use client";

import { Marker } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Check, Copy, Pencil, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import "leaflet/dist/leaflet.css";

import { deleteMarkerAction } from "@/actions/marker/delete";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { dialog } from "@/providers/dialog-provider";
import { UpdateMarkerForm } from "./update-marker-form";

export type MarkerPopupProps = {
	marker: Marker;
};

export const MarkerPopup = ({ marker }: MarkerPopupProps) => {
	const { data: canEditMarker } = useQuery({
		queryKey: ["marker-edit-permission"],
		queryFn: async () => {
			const { data } = await authClient.organization.hasPermission({
				permission: { marker: ["update"] },
			});

			return Boolean(data?.success);
		},
		staleTime: 5 * 60 * 1000,
	});

	const { data: canDeleteMarker } = useQuery({
		queryKey: ["marker-delete-permission"],
		queryFn: async () => {
			const { data } = await authClient.organization.hasPermission({
				permission: { marker: ["delete"] },
			});

			return Boolean(data?.success);
		},
		staleTime: 5 * 60 * 1000,
	});

	const { executeAsync: deleteMarker, isPending: deleteMarkerPending } =
		useAction(deleteMarkerAction, {
			onSuccess: () => {
				toast.success("Le marqueur a bien été supprimé !");

				if (typeof window !== "undefined") {
					window.location.reload();
				}
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		});

	const [copied, setCopied] = useState(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(`${marker.lat}, ${marker.lng}`).then(
			() => {
				toast.success("Coordonnées copiées dans le presse-papier !");
			},
			() => {
				toast.error("Erreur lors de la copie des coordonnées.");
			}
		);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{marker.label || "Marqueur"}</CardTitle>
				<CardDescription>
					{marker.lat.toFixed(2)}, {marker.lng.toFixed(2)}
				</CardDescription>
			</CardHeader>
			<CardFooter className="gap-2 justify-end">
				<Button
					size="icon"
					onClick={() => {
						copyToClipboard();
						setCopied(true);
						setTimeout(() => setCopied(false), 700);
					}}
					className={cn(copied && "animate-bounce")}
					aria-label="Copier les coordonnées"
				>
					{copied ? <Check /> : <Copy />}
				</Button>
				{canEditMarker ? (
					<LoadingButton
						variant="secondary"
						size="icon"
						onClick={() => {
							dialog.add({
								children: <UpdateMarkerForm marker={marker} />,
							});
						}}
					>
						<Pencil />
					</LoadingButton>
				) : null}
				{canDeleteMarker ? (
					<LoadingButton
						variant="destructive"
						size="icon"
						loading={deleteMarkerPending}
						onClick={() => {
							dialog.add({
								title: "Êtes-vous sûr de vouloir supprimer ce marqueur ?",
								description:
									"Cette action est irréversible. Le marqueur sera définitivement supprimé.",
								action: {
									label: "Supprimer",
									variant: "destructive",
									onClick: async () => {
										await deleteMarker({
											markerId: marker.id,
										});
									},
								},
							});
						}}
					>
						<Trash />
					</LoadingButton>
				) : null}
			</CardFooter>
		</Card>
	);
};

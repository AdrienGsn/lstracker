"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import "leaflet/dist/leaflet.css";

import { updateMarkerAction } from "@/actions/marker/update";
import {
	UpdateMarkerSchema,
	UpdateMarkerSchemaType,
} from "@/actions/marker/update/schema";
import { LoadingButton } from "@/components/loading-button";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BlipSelector } from "../blip-selector";
import { MarkerPopupProps } from "./marker-popup";

export const UpdateMarkerForm = ({ marker }: MarkerPopupProps) => {
	const form = useZodForm({
		schema: UpdateMarkerSchema,
		defaultValues: {
			markerId: marker.id,
			label: marker.label ?? "",
			icon: marker.icon ?? "default.png",
			lat: marker.lat.toString() ?? "0",
			lng: marker.lng.toString() ?? "0",
		},
	});

	const { executeAsync: updateMarker, isPending: updateMarkerPending } =
		useAction(updateMarkerAction, {
			onSuccess: () => {
				toast.success("Le marqueur a bien été modifié !");

				if (typeof window !== "undefined") {
					window.location.reload();
				}
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		});

	const onSubmit = async (data: UpdateMarkerSchemaType) => {
		await updateMarker(data);
	};

	return (
		<>
			<AlertDialogHeader>
				<AlertDialogTitle>Modifier le marqueur</AlertDialogTitle>
				<AlertDialogDescription>
					Modifiez les informations du marqueur puis validez.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<BlipSelector form={form} fieldName="icon" />
					<FormField
						control={form.control}
						name="label"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Label</FormLabel>
								<FormControl>
									<Input {...field} placeholder="label" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lat"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Latitude</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Latitude" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lng"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Longitude</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Longitude" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<AlertDialogFooter>
						<AlertDialogCancel type="button">
							Retour
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={updateMarkerPending}
							asChild
						>
							<LoadingButton
								loading={updateMarkerPending}
								type="submit"
							>
								Modifier
							</LoadingButton>
						</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</Form>
		</>
	);
};

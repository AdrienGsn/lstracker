"use client";

import { Team } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { toast } from "sonner";

import "leaflet/dist/leaflet.css";

import { createMarkerAction } from "@/actions/marker/create";
import {
	CreateMarkerSchema,
	CreateMarkerSchemaType,
} from "@/actions/marker/create/schema";
import { LoadingButton } from "@/components/loading-button";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BlipSelector } from "../blip-selector";

type CreateMarkerModalProps = {
	teams: Team[];
	isOpen: boolean;
	lat: string;
	lng: string;
	onClose: () => void;
	onCreated: () => Promise<void> | void;
};

export function CreateMarkerModal(props: CreateMarkerModalProps) {
	const form = useZodForm({
		schema: CreateMarkerSchema,
		defaultValues: {
			label: "",
			icon: "default.png",
			lat: props.lat,
			lng: props.lng,
			teamId: "none",
		},
	});

	useEffect(() => {
		if (!props.isOpen) return;

		form.setValue("lat", props.lat);
		form.setValue("lng", props.lng);

		if (!form.getValues("teamId")) {
			form.setValue("teamId", "none");
		}

		if (!form.getValues("icon")) {
			form.setValue("icon", "default.png");
		}
	}, [form, props.isOpen, props.lat, props.lng]);

	useEffect(() => {
		if (props.isOpen) return;

		form.reset({
			label: "",
			icon: "default.png",
			lat: "",
			lng: "",
			teamId: "none",
		});
	}, [form, props.isOpen]);

	const { executeAsync, isPending } = useAction(createMarkerAction, {
		onSuccess: async () => {
			toast.success("Le marqueur a été créé avec succès !");
			await props.onCreated();
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	const onSubmit = async (data: CreateMarkerSchemaType) => {
		await executeAsync(data);
	};

	return (
		<AlertDialog
			open={props.isOpen}
			onOpenChange={(open) => {
				if (!open) {
					props.onClose();
				}
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Créer un nouveau marqueur
					</AlertDialogTitle>
					<AlertDialogDescription>
						Ajoutez un marqueur à la carte en renseignant les
						informations ci-dessous.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-6"
					>
						<BlipSelector form={form} fieldName="icon" />
						<FormField
							control={form.control}
							name="label"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Nom du marqueur"
										/>
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
										<Input
											{...field}
											placeholder="Latitude"
										/>
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
										<Input
											{...field}
											placeholder="Longitude"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{props.teams.length > 0 ? (
							<FormField
								control={form.control}
								name="teamId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Equipe</FormLabel>
										<FormControl>
											<Select
												value={field.value ?? "none"}
												onValueChange={field.onChange}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Sélectionnez une équipe" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="none">
														Aucune
													</SelectItem>
													{props.teams.map((team) => (
														<SelectItem
															key={team.id}
															value={team.id}
														>
															{team.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						) : null}
						<AlertDialogFooter>
							<AlertDialogCancel type="button">
								Retour
							</AlertDialogCancel>
							<LoadingButton loading={isPending} type="submit">
								Créer
							</LoadingButton>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
}

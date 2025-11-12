"use client";

import { Team } from "@prisma/client";
import { Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { createMarkerAction } from "@/actions/marker/create";
import {
	CreateMarkerSchema,
	CreateMarkerSchemaType,
} from "@/actions/marker/create/schema";
import { LoadingButton } from "@/components/loading-button";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { dialog } from "@/providers/dialog-provider";

const CreateForm = (props: { teams: Team[] }) => {
	const form = useZodForm({
		schema: CreateMarkerSchema,
		defaultValues: {
			label: "",
			icon: "default.png",
			lat: "",
			lng: "",
			teamId: "none",
		},
	});

	const { executeAsync, isPending } = useAction(createMarkerAction, {
		onSuccess: ({ data }) => {
			toast.success("Le marqueur a été créé avec succès !");
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	const onSubmit = async (data: CreateMarkerSchemaType) => {
		await executeAsync(data);
	};

	return (
		<>
			<AlertDialogHeader>
				<AlertDialogTitle>Créer un nouveau marqueur</AlertDialogTitle>
				<AlertDialogDescription>
					Ajoutez un marqueur à la carte en renseignant les
					informations ci-dessous.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
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
					{props.teams.length > 0 ? (
						<FormField
							control={form.control}
							name="teamId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Equipe</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Sélectionnez une equipe" />
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
						<AlertDialogAction disabled={isPending} asChild>
							<LoadingButton loading={isPending} type="submit">
								Créer
							</LoadingButton>
						</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</Form>
		</>
	);
};

export type CreateMarkerBtnProps = {
	teams: Team[];
};

export const CreateMarkerBtn = (props: CreateMarkerBtnProps) => {
	return (
		<Button
			onClick={() => {
				dialog.add({
					children: <CreateForm teams={props.teams} />,
				});
			}}
		>
			<Plus />
			Creer
		</Button>
	);
};

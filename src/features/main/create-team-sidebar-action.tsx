"use client";

import { createTeamAction } from "@/actions/organization/team/create";
import {
	CreateTeamSchema,
	CreateTeamSchemaType,
} from "@/actions/organization/team/create/schema";
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
import { SidebarGroupAction } from "@/components/ui/sidebar";
import { dialog } from "@/providers/dialog-provider";
import { Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

const CreateForm = () => {
	const form = useZodForm({
		schema: CreateTeamSchema,
		defaultValues: {
			name: "",
		},
	});

	const { executeAsync, isPending } = useAction(createTeamAction, {
		onSuccess: ({ data }) => {
			toast.success(`Équipe "${data.name}" créée avec succès !`);
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	const onSubmit = async (data: CreateTeamSchemaType) => {
		await executeAsync(data);
	};

	return (
		<>
			<AlertDialogHeader>
				<AlertDialogTitle>Créer une nouvelle équipe</AlertDialogTitle>
				<AlertDialogDescription>
					Créez une équipe pour regrouper des membres et collaborer
					efficacement.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nom de l'équipe</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="Nom de l'équipe"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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

export const CreateTeamSidebarAction = () => {
	return (
		<SidebarGroupAction
			onClick={() => {
				dialog.add({
					children: <CreateForm />,
				});
			}}
		>
			<Plus />
		</SidebarGroupAction>
	);
};

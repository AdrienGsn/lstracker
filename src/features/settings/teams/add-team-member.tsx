"use client";

import { Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { createTeamMemberAction } from "@/actions/organization/team/member/create";
import {
	CreateTeamMemberSchema,
	CreateTeamMemberSchemaType,
} from "@/actions/organization/team/member/create/schema";
import { LoadingButton } from "@/components/loading-button";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { dialog } from "@/providers/dialog-provider";
import { TeamWithRelations } from "@/types/organization";

const CreateForm = (props: AddTeamMember) => {
	const form = useZodForm({
		schema: CreateTeamMemberSchema,
		defaultValues: {
			teamId: props.team.id,
			userId: "",
		},
	});

	const { executeAsync, isPending } = useAction(createTeamMemberAction, {
		onSuccess: ({ data }) => {
			toast.success("Le membre a bien été ajouté à l'équipe.");
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	const onSubmit = async (data: CreateTeamMemberSchemaType) => {
		await executeAsync(data);
	};

	return (
		<>
			<AlertDialogHeader>
				<AlertDialogTitle>
					Ajouter un membre à l'équipe
				</AlertDialogTitle>
				<AlertDialogDescription>
					Sélectionnez un utilisateur à ajouter en tant que membre de
					cette équipe.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<FormField
						control={form.control}
						name="userId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Membre</FormLabel>
								<FormControl>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isPending}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Sélectionnez un membre à ajouter" />
										</SelectTrigger>
										<SelectContent>
											{props.team.organization.members
												.length > 0 ? (
												props.team.organization.members.map(
													(member) => (
														<SelectItem
															key={member.user.id}
															value={
																member.user.id
															}
														>
															<Avatar>
																{member.user
																	.image ? (
																	<AvatarImage
																		src={
																			member
																				.user
																				.image
																		}
																		alt={
																			member
																				.user
																				.name
																		}
																	/>
																) : (
																	<AvatarFallback className="uppercase">
																		{member.user.name.slice(
																			0,
																			2
																		)}
																	</AvatarFallback>
																)}
															</Avatar>
															{member.user.name}
														</SelectItem>
													)
												)
											) : (
												<SelectItem disabled value="">
													Aucun membre existant pour
													cette organisation
												</SelectItem>
											)}
										</SelectContent>
									</Select>
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
								Ajouter
							</LoadingButton>
						</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</Form>
		</>
	);
};

export type AddTeamMember = {
	team: TeamWithRelations;
};

export const AddTeamMember = (props: AddTeamMember) => {
	return (
		<Button
			type="button"
			onClick={() => {
				dialog.add({
					children: <CreateForm team={props.team} />,
				});
			}}
		>
			<Plus />
			Ajouter un membre
		</Button>
	);
};

"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { inviteMemberAction } from "@/actions/organization/member/invite";
import {
	InviteMemberSchema,
	InviteMemberSchemaType,
} from "@/actions/organization/member/invite/schema";
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
import { Typography } from "@/components/ui/typography";
import { dialog } from "@/providers/dialog-provider";
import { FormattedDiscordMember } from "@/types/discord";

const CreateForm = () => {
	const {
		data: membersData,
		isLoading: loadingMembers,
		isError: errorMembers,
		refetch: refetchMembers,
	} = useQuery({
		queryKey: ["members"],
		queryFn: async () => {
			const res = await fetch("/api/discord/members");

			if (!res.ok) throw new Error("Erreur récupération amis Discord");

			const data = await res.json();

			return data.members as FormattedDiscordMember[];
		},
	});

	const form = useZodForm({
		schema: InviteMemberSchema,
		defaultValues: {
			role: "member",
		},
	});

	const { executeAsync, isPending } = useAction(inviteMemberAction, {
		onSuccess: () => {
			toast.success("Invitation envoyée avec succès");
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	const onSubmit = async (data: InviteMemberSchemaType) => {
		await executeAsync(data);
	};

	return (
		<>
			<AlertDialogHeader>
				<AlertDialogTitle>Inviter un membre</AlertDialogTitle>
				<AlertDialogDescription className="flex flex-col gap-2">
					<span>
						Invitez vos amis à rejoindre votre organisation en
						sélectionnant un ami Discord ci-dessous. L'utilisateur
						recevra une invitation par message privé.
					</span>
					<strong>
						Note&nbsp;: La personne invitée doit se trouver dans le
						serveur Discord renseigné lors de la création de
						l'organisation.
					</strong>
				</AlertDialogDescription>
			</AlertDialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<FormField
						control={form.control}
						name="discordId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Utilisateur Discord</FormLabel>
								<FormControl>
									{loadingMembers || !membersData ? (
										<p>LOADING...</p>
									) : (
										<Select
											value={field.value}
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={isPending}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Sélectionner un ami Discord..." />
											</SelectTrigger>
											<SelectContent>
												{membersData.map(
													(
														member: FormattedDiscordMember
													) => (
														<SelectItem
															key={member.id}
															value={member.id}
														>
															<Avatar>
																{member.avatarUrl ? (
																	<AvatarImage
																		src={
																			member.avatarUrl
																		}
																		alt={
																			member.username
																		}
																	/>
																) : (
																	<AvatarFallback>
																		{member.displayName
																			.slice(
																				0,
																				2
																			)
																			.toUpperCase()}
																	</AvatarFallback>
																)}
															</Avatar>
															{member.displayName}
															<Typography variant="muted">
																#
																{
																	member.username
																}
															</Typography>
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									)}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="role"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Role</FormLabel>
								<FormControl>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isPending}
									>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="member">
												Membre
											</SelectItem>
											<SelectItem value="admin">
												Admin
											</SelectItem>
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
						<AlertDialogAction
							disabled={isPending || loadingMembers}
							asChild
						>
							<LoadingButton loading={isPending} type="submit">
								Inviter
							</LoadingButton>
						</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</Form>
		</>
	);
};

export const InviteMemberBtn = () => {
	return (
		<Button
			onClick={() => {
				dialog.add({
					children: <CreateForm />,
				});
			}}
			variant="secondary"
		>
			<Plus className="size-5" />
			Inviter
		</Button>
	);
};

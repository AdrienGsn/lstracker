"use client";

import { Organization } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteOrgMemberAction } from "@/actions/organization/member/delete";
import { updateOrgMemberAction } from "@/actions/organization/member/update";
import {
	UpdateOrgMemberSchema,
	UpdateOrgMemberSchemaType,
} from "@/actions/organization/member/update/schema";
import { LoadingButton } from "@/components/loading-button";
import {
	LayoutActions,
	LayoutContent,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FormField, useZodForm } from "@/components/ui/form";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
} from "@/components/ui/item";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/use-current-user";
import { dialog } from "@/providers/dialog-provider";
import { MarkerWithRelations } from "@/types/marker";
import { MemberWithUser } from "@/types/organization";
import { FormUnsavedBar } from "../form/form-unsaved-bar";
import { MemberMarkersTable } from "./member-markers-table";
import { memberMarkersTable } from "./member-markers-table/columns";
import { MemberTeamsTable } from "./member-teams-table";
import { memberTeamsTable } from "./member-teams-table/columns";

export type MemberPageProps = {
	member: MemberWithUser & { organization: Organization };
	markers: MarkerWithRelations[];
};

export const MemberPage = (props: MemberPageProps) => {
	const router = useRouter();
	const { user } = useCurrentUser();

	const form = useZodForm({
		schema: UpdateOrgMemberSchema,
		defaultValues: { memberId: props.member.id, role: props.member.role },
	});

	const { executeAsync: updateOrgMember, isPending: updateOrhMemberPending } =
		useAction(updateOrgMemberAction, {
			onSuccess: () => {
				toast.success("Le membre a été mis à jour avec succès.");
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		});

	const { executeAsync: deleteOrgMember, isPending: deleteOrgMemberPending } =
		useAction(deleteOrgMemberAction, {
			onSuccess: () => {
				router.replace("/settings/members");

				toast.success("Le membre a été supprimé avec succès.");
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		});

	return (
		<FormUnsavedBar
			form={form}
			onSubmit={async (data: UpdateOrgMemberSchemaType) => {
				await updateOrgMember(data);
			}}
			className="flex-wrap w-full flex gap-6"
		>
			<LayoutHeader>
				<Link
					href="/settings/members"
					className={buttonVariants({ variant: "link" })}
				>
					<ArrowLeft />
					Retour aux membres
				</Link>
				<Item>
					<ItemMedia className="flex -space-x-8">
						<Avatar className="size-20">
							{props.member.organization.logo ? (
								<AvatarImage
									src={props.member.organization.logo}
								/>
							) : (
								<AvatarFallback>
									{props.member.organization.name
										.slice(0, 2)
										.toUpperCase()}
								</AvatarFallback>
							)}
						</Avatar>
						<Avatar className="size-20">
							{props.member.user.image ? (
								<AvatarImage src={props.member.user.image} />
							) : (
								<AvatarFallback>
									{props.member.user.name
										.slice(0, 2)
										.toUpperCase()}
								</AvatarFallback>
							)}
						</Avatar>
					</ItemMedia>
					<ItemContent>
						<LayoutTitle className="font-semibold">
							{props.member.user.name}
						</LayoutTitle>
					</ItemContent>
				</Item>
			</LayoutHeader>
			<LayoutActions>
				{props.member.role !== "owner" ? (
					<ItemActions>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<Select
									onValueChange={field.onChange}
									value={field.value}
									defaultValue={field.value}
								>
									<SelectTrigger className="w-[120px]">
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
							)}
						/>
					</ItemActions>
				) : null}
				<LoadingButton
					variant="destructive"
					type="button"
					loading={deleteOrgMemberPending}
					disabled={props.member.user.id === user?.id}
					onClick={() => {
						dialog.add({
							title: "Êtes-vous sûr ?",
							description:
								"Cette action est irréversible. Ce membre sera définitivement supprimé de l'organisation.",
							action: {
								label: "Supprimer",
								variant: "destructive",
								onClick: async () => {
									await deleteOrgMember({
										memberId: props.member.id,
									});
								},
							},
						});
					}}
				>
					Supprimer
				</LoadingButton>
			</LayoutActions>
			<LayoutContent className="flex flex-col gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Equipes</CardTitle>
						<CardDescription>
							Retrouvez ci-dessous la liste des équipes auxquelles
							ce membre appartient.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<MemberTeamsTable
							columns={memberTeamsTable}
							data={props.member.user.teamMembers.map(
								(teamMember) => {
									const { teamMembers, ...user } =
										props.member.user;
									return {
										...props.member,
										user,
										team: teamMember.team,
									};
								}
							)}
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Marqueurs</CardTitle>
						<CardDescription>
							Voici les marqueurs associés à ce membre.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<MemberMarkersTable
							columns={memberMarkersTable}
							data={props.markers}
						/>
					</CardContent>
				</Card>
			</LayoutContent>
		</FormUnsavedBar>
	);
};

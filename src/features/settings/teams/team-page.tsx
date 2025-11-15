"use client";

import { ArrowLeft } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteTeamAction } from "@/actions/organization/team/delete";
import { updateTeamAction } from "@/actions/organization/team/update";
import {
	UpdateTeamSchema,
	UpdateTeamSchemaType,
} from "@/actions/organization/team/update/schema";
import { LoadingButton } from "@/components/loading-button";
import {
	LayoutActions,
	LayoutContent,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useZodForm } from "@/components/ui/form";
import { useCurrentUser } from "@/hooks/use-current-user";
import { dialog } from "@/providers/dialog-provider";
import { TeamWithRelations } from "@/types/organization";
import { parseMetadata } from "@/utils/metadata";
import { FormUnsavedBar } from "../../form/form-unsaved-bar";
import { DiscordChannelSelector } from "../discord-channel-selector";
import { AddTeamMember } from "./add-team-member";
import { TeamMarkersTable } from "./team-markers-table";
import { teamMarkersTable } from "./team-markers-table/columns";
import { TeamMembersTable } from "./team-members-table";
import { teamMembersTable } from "./team-members-table/columns";

export type TeamPageProps = {
	team: TeamWithRelations;
};

export const TeamPage = (props: TeamPageProps) => {
	const router = useRouter();
	const { user } = useCurrentUser();

	const metadata = parseMetadata<{ channelId: string }>(props.team.metadata);

	const form = useZodForm({
		schema: UpdateTeamSchema,
		defaultValues: {
			teamId: props.team.id,
			name: props.team.name ?? "",
			channelId: metadata?.channelId ?? "",
		},
	});

	const { executeAsync: updateTeam, isPending: updateTeamPending } =
		useAction(updateTeamAction, {
			onSuccess: () => {
				toast.success("L'equipe a été mise à jour avec succès.");
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		});

	const { executeAsync: deleteTeam, isPending: deleteTeamPending } =
		useAction(deleteTeamAction, {
			onSuccess: () => {
				router.replace("/settings/teams");

				toast.success("L'equipe a été supprimée avec succès.");
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		});

	return (
		<FormUnsavedBar
			form={form}
			onSubmit={async (data: UpdateTeamSchemaType) => {
				await updateTeam(data);
			}}
			className="flex-wrap w-full flex gap-6"
		>
			<LayoutHeader>
				<Link
					href="/settings/teams"
					className={buttonVariants({ variant: "link" })}
				>
					<ArrowLeft />
					Retour aux equipes
				</Link>
				<LayoutTitle>{props.team.name}</LayoutTitle>
			</LayoutHeader>
			<LayoutActions>
				<LoadingButton
					variant="destructive"
					type="button"
					loading={deleteTeamPending}
					onClick={() => {
						dialog.add({
							title: "Êtes-vous sûr ?",
							description:
								"Cette action est irréversible. Cette equipe sera définitivement supprimé de l'organisation.",
							action: {
								label: "Supprimer",
								variant: "destructive",
								onClick: async () => {
									await deleteTeam({
										teamId: props.team.id,
										organizationId:
											props.team.organizationId,
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
						<CardTitle>Channel Discord</CardTitle>
						<CardDescription>
							Associez ou modifiez le channel Discord de cette
							équipe pour faciliter la communication sur votre
							serveur.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<DiscordChannelSelector
							form={form}
							fieldName="channelId"
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Membres</CardTitle>
						<CardDescription>
							Voici la liste des membres de cette équipe.
						</CardDescription>
						<CardAction>
							<AddTeamMember team={props.team} />
						</CardAction>
					</CardHeader>
					<CardContent>
						<TeamMembersTable
							columns={teamMembersTable}
							data={props.team.members}
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
						<TeamMarkersTable
							columns={teamMarkersTable}
							data={props.team.markers}
						/>
					</CardContent>
				</Card>
			</LayoutContent>
		</FormUnsavedBar>
	);
};

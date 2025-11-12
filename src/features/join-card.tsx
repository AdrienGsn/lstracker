"use client";

import { Invitation, Organization, User } from "@prisma/client";
import dayjs from "dayjs";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { joinOrganizationAction } from "@/actions/organization/join";
import { LoadingButton } from "@/components/loading-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

export type JoinCardProps = {
	invitation: Invitation & {
		inviter: User;
		organization: Organization;
	};
};

export const JoinCard = (props: JoinCardProps) => {
	const router = useRouter();

	const { executeAsync: joinOrganization, isPending: joinOrgPending } =
		useAction(joinOrganizationAction, {
			onSuccess: () => {
				router.replace("/");

				toast.success(
					`Vous avez bien rejoint l'organisation "${props.invitation.organization.name}" !`
				);
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		});

	return (
		<Card className="min-w-[250px] m-auto">
			<CardHeader className="inline-flex items-center gap-2">
				<Avatar>
					{props.invitation.organization?.logo ? (
						<AvatarImage src={props.invitation.organization.logo} />
					) : null}
					{!props.invitation.organization?.logo ? (
						<AvatarFallback className="uppercase">
							{props.invitation.organization?.name?.slice(0, 2)}
						</AvatarFallback>
					) : null}
				</Avatar>
				<CardTitle>{props.invitation.organization.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<Typography>
					Vous avez été invité à rejoindre{" "}
					{props.invitation.organization.name} par{" "}
					{props.invitation.inviter.name}
				</Typography>
			</CardContent>
			<CardFooter className="flex flex-col gap-4">
				<div className="inline-flex items-center gap-2">
					<LoadingButton>Decliner</LoadingButton>
					<LoadingButton
						loading={joinOrgPending}
						onClick={async () => {
							await joinOrganization({
								invitationId: props.invitation.id,
							});
						}}
					>
						Rejoindre
					</LoadingButton>
				</div>
				<Typography variant="small">
					L'invitation expire dans{" "}
					{dayjs().diff(props.invitation.expiresAt)} jour(s)
				</Typography>
			</CardFooter>
		</Card>
	);
};

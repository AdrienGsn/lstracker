"use client";

import { Invitation, Organization, User } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
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
		<div className="flex items-center justify-center size-full p-4">
			<Card className="min-w-[250px] max-w-xl mx-auto w-full">
				<CardHeader className="inline-flex items-center gap-2">
					<Avatar>
						{props.invitation.organization?.logo ? (
							<AvatarImage
								src={props.invitation.organization.logo}
							/>
						) : null}
						{!props.invitation.organization?.logo ? (
							<AvatarFallback className="uppercase">
								{props.invitation.organization?.name?.slice(
									0,
									2
								)}
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
				<CardFooter>
					<LoadingButton
						loading={joinOrgPending}
						onClick={async () => {
							await joinOrganization({
								invitationId: props.invitation.id,
							});
						}}
						className="w-full"
					>
						Rejoindre
					</LoadingButton>
				</CardFooter>
			</Card>
		</div>
	);
};

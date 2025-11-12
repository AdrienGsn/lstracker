"use client";

import { Session } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteAllUserSessionsAction } from "@/actions/admin/user/session/delete-all";
import { LoadingButton } from "@/components/loading-button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { dialog } from "@/providers/dialog-provider";
import { UserSessionsTable } from "./user-sessions-table";
import { userSessionsTable } from "./user-sessions-table/columns";

export type UserSessionsCardProps = {
	userId: string;
	sessions: Session[];
};

export const UserSessionsCard = (props: UserSessionsCardProps) => {
	const router = useRouter();

	const { executeAsync, isPending } = useAction(deleteAllUserSessionsAction, {
		onSuccess: () => {
			router.refresh();

			toast.success("All sessions have been deleted !");
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Active Sessions</CardTitle>
				<CardDescription>
					View and manage user sessions for debugging
				</CardDescription>
				<CardAction>
					<LoadingButton
						variant="destructive"
						onClick={() => {
							dialog.add({
								title: "Êtes vous sur ?",
								description:
									"Cette action est irréversible. Toutes les sessions de l'utilisateur seront supprimées définitivement.",
								action: {
									label: "Supprimer",
									variant: "destructive",
									onClick: () => {
										executeAsync({ userId: props.userId });
									},
								},
								loading: isPending,
							});
						}}
						loading={isPending}
					>
						Revoke all sessions
					</LoadingButton>
				</CardAction>
			</CardHeader>
			<CardContent>
				<UserSessionsTable
					columns={userSessionsTable}
					data={props.sessions}
				/>
			</CardContent>
		</Card>
	);
};

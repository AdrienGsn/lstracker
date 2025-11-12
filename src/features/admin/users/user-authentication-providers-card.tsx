"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteAllUserSessionsAction } from "@/actions/admin/user/session/delete-all";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SocialProvider } from "@/types/auth";
import { UserAuthenticationProvidersTable } from "./user-authentication-providers-table";
import { userAuthenticationProvidersTable } from "./user-authentication-providers-table/columns";

export type UserAuthenticationProvidersCardProps = {
	providers: SocialProvider[];
};

export const UserAuthenticationProvidersCard = (
	props: UserAuthenticationProvidersCardProps
) => {
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
				<CardTitle>Authentication Providers</CardTitle>
				<CardDescription>
					View and manage user authentication providers
				</CardDescription>
			</CardHeader>
			<CardContent>
				<UserAuthenticationProvidersTable
					columns={userAuthenticationProvidersTable}
					data={props.providers}
				/>
			</CardContent>
		</Card>
	);
};

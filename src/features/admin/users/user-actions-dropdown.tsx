"use client";

import { deleteUserAction } from "@/actions/admin/user/delete";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/client";
import { dialog } from "@/providers/dialog-provider";
import { Ellipsis, Eye, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type UserActionsDropdownProps = {
	userId: string;
};

export const UserActionsDropdown = (props: UserActionsDropdownProps) => {
	const router = useRouter();

	const { executeAsync, isPending } = useAction(deleteUserAction, {
		onSuccess: () => {
			router.replace("/admin/users");

			toast.success("User has been deleted !");
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					<Ellipsis />
					Actions
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="min-w-[250px]">
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={async () => {
						await authClient.admin.impersonateUser({
							userId: props.userId,
						});
					}}
				>
					<Eye className="size-5" />
					Impersonate
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="cursor-pointer"
					variant="destructive"
					onClick={() => {
						dialog.add({
							title: "Êtes-vous sûr ?",
							description:
								"Cette action supprimera définitivement cet utilisateur. Cette opération est irréversible.",
							action: {
								label: "Supprimer",
								variant: "destructive",
								onClick: async () => {
									executeAsync({ userId: props.userId });
								},
							},
						});
					}}
				>
					<Trash className="size-5" />
					Supprimer
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

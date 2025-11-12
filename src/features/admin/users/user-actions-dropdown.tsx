"use client";

import { Ellipsis, Eye, Shield, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { banUserAction } from "@/actions/admin/user/ban";
import {
	BanUserSchema,
	BanUserSchemaType,
} from "@/actions/admin/user/ban/schema";
import { deleteUserAction } from "@/actions/admin/user/delete";
import { unbanUserAction } from "@/actions/admin/user/unban";
import { DatePicker } from "@/components/date-picker";
import { LoadingButton } from "@/components/loading-button";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useZodForm,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth/client";
import { dialog } from "@/providers/dialog-provider";

export type UserActionsDropdownProps = {
	userId: string;
	banned?: boolean;
};

export const UserActionsDropdown = (props: UserActionsDropdownProps) => {
	const router = useRouter();

	const { executeAsync: deleteUser, isPending: deleteUserPending } =
		useAction(deleteUserAction, {
			onSuccess: () => {
				router.replace("/admin/users");

				toast.success("User has been deleted !");
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		});

	const { executeAsync: unbanUser, isPending: unbanUserPending } = useAction(
		unbanUserAction,
		{
			onSuccess: () => {
				router.replace("/admin/users");

				toast.success("L'utilisateur a bien été débanni !");
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		}
	);

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
				{props.banned ? (
					<DropdownMenuItem
						className="cursor-pointer"
						variant="destructive"
						onClick={() => {
							dialog.add({
								title: "Êtes-vous sûr ?",
								description:
									"Cette action retirera le bannissement de cet utilisateur. Êtes-vous sûr de vouloir continuer ?",
								action: {
									label: "Débannir",
									variant: "destructive",
									onClick: async () => {
										await unbanUser({
											userId: props.userId,
										});
									},
								},
								loading: unbanUserPending,
							});
						}}
					>
						<Shield className="size-5" />
						Débannir
					</DropdownMenuItem>
				) : (
					<DropdownMenuItem
						className="cursor-pointer"
						variant="destructive"
						onClick={() => {
							dialog.add({
								// title: "Êtes-vous sûr ?",
								// description:
								// 	"Cette action bannira cet utilisateur. Êtes-vous sûr de vouloir continuer ?",
								// action: {
								// 	label: "Bannir",
								// 	variant: "destructive",
								// 	onClick: async () => {
								// 		await banUser({
								// 			userId: props.userId,
								// 		});
								// 	},
								// },
								children: (
									<BanUserDialog userId={props.userId} />
								),
							});
						}}
					>
						<Shield className="size-5" />
						Bannir
					</DropdownMenuItem>
				)}
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
									deleteUser({ userId: props.userId });
								},
							},
							loading: deleteUserPending,
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

const BanUserDialog = ({ userId }: { userId: string }) => {
	const router = useRouter();

	const form = useZodForm({
		schema: BanUserSchema,
	});

	const { executeAsync: banUser, isPending: banUserPending } = useAction(
		banUserAction,
		{
			onSuccess: () => {
				router.refresh;

				toast.success("L'utilisateur a bien été banni !");
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		}
	);

	const onSubmit = async (data: BanUserSchemaType) => {
		await banUser({ ...data, userId });
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<AlertDialogHeader>
					<AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action bannira cet utilisateur. Êtes-vous sûr de
						vouloir continuer ?
					</AlertDialogDescription>
				</AlertDialogHeader>

				<FormField
					control={form.control}
					name="reason"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Raison</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder="Raison du bannissement..."
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="expires"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Expiration</FormLabel>
							<FormControl>
								<DatePicker {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={banUserPending}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={banUserPending}
						variant="destructive"
						type="submit"
						asChild
					>
						<LoadingButton loading={banUserPending}>
							Bannir
						</LoadingButton>
					</AlertDialogAction>
				</AlertDialogFooter>
			</form>
		</Form>
	);
};

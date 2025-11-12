"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { transfertOrgAction } from "@/actions/organization/transfert";
import {
	TransfertOrgSchema,
	TransfertOrgSchemaType,
} from "@/actions/organization/transfert/schema";
import { LoadingButton } from "@/components/loading-button";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/use-current-user";
import { authClient } from "@/lib/auth/client";
import { dialog } from "@/providers/dialog-provider";
import { MemberWithUser } from "@/types/organization";

export const TransfertOrgCard = () => {
	const router = useRouter();

	const [members, setMembers] = useState<MemberWithUser[]>();

	useEffect(() => {
		const fetchMembers = async () => {
			const { data } = await authClient.organization.listMembers();

			setMembers(data?.members as MemberWithUser[]);
		};
		fetchMembers();
	}, []);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Transférer l’organisation</CardTitle>
				<CardDescription>
					Transférez la propriété de cette organisation à un autre
					utilisateur. Cette action est irréversible. Assurez-vous
					d’avoir sélectionné le bon destinataire avant de confirmer
					le transfert.
				</CardDescription>
			</CardHeader>
			<CardFooter className="justify-end">
				<LoadingButton
					disabled={members?.length === 1}
					variant="secondary"
					onClick={() => {
						dialog.add({
							children: <CreateForm members={members ?? []} />,
						});
					}}
				>
					Transférer l’organisation
				</LoadingButton>
			</CardFooter>
		</Card>
	);
};

const CreateForm = ({ members }: { members: MemberWithUser[] }) => {
	const router = useRouter();
	const { user } = useCurrentUser();

	const form = useZodForm({
		schema: TransfertOrgSchema,
	});

	const { executeAsync, isPending } = useAction(transfertOrgAction, {
		onSuccess: () => {
			router.push("/");

			toast.success(
				"La propriété de l’organisation a été transférée avec succès."
			);
		},
		onError: ({ error }) => {
			toast.error(error.serverError);
		},
	});

	const onSubmit = async (data: TransfertOrgSchemaType) => {
		await executeAsync(data);
	};

	return (
		<>
			<AlertDialogHeader>
				<AlertDialogTitle>Confirmer le transfert</AlertDialogTitle>
				<AlertDialogDescription>
					Êtes-vous sûr de vouloir transférer la propriété de cette
					organisation ? Ce transfert est irréversible. Une fois
					confirmé, vous ne serez plus propriétaire de cette
					organisation.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Transférer a</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) =>
											field.onChange(value)
										}
										value={field.value}
									>
										<SelectTrigger className="w-full" />
										<SelectContent>
											{members &&
												members
													.filter(
														(member: any) =>
															member.userId !==
															user?.id
													)
													.map((member: any) => (
														<SelectItem
															key={member.userId}
															value={
																member.userId
															}
														>
															{member.user.name ||
																member.user
																	.email}
														</SelectItem>
													))}
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
							<LoadingButton
								loading={isPending}
								type="submit"
								variant="destructive"
							>
								Transférer l’organisation
							</LoadingButton>
						</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</Form>
		</>
	);
};

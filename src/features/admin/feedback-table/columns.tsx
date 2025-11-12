"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Ellipsis, Eye, Trash } from "lucide-react";

import { deleteFeedbackAction } from "@/actions/admin/feedback/delete";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Typography } from "@/components/ui/typography";
import { dialog } from "@/providers/dialog-provider";
import { FeedbackWithUser } from "@/types/feedback";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const feedbacksTable: ColumnDef<FeedbackWithUser>[] = [
	{
		accessorKey: "name",
		header: "User",
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<Avatar className="size-10">
						{row.original.user.image ? (
							<AvatarImage src={row.original.user.image} />
						) : (
							<AvatarFallback>
								{row.original.user.name
									.slice(0, 2)
									.toUpperCase()}
							</AvatarFallback>
						)}
					</Avatar>
					<div className="flex flex-col items-start">
						<Typography className="font-bold">
							{row.original.user.name}
						</Typography>
						<Typography variant="muted">
							{row.original.user.email}
						</Typography>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "message",
		header: "Message",
		cell: ({ row }) => {
			return (
				<Typography className="truncate max-w-[250px]">
					{row.original.message}
				</Typography>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created",
		cell: ({ row }) => {
			return (
				<div className="flex flex-col">
					<Typography>
						{dayjs(row.original.createdAt).format("DD/MM/YYYY")}
					</Typography>
					<Typography variant="muted">
						{dayjs(row.original.createdAt).format("HH:mm:ss")}
					</Typography>
				</div>
			);
		},
	},
	{
		header: "Actions",
		cell: ({ row }) => {
			const router = useRouter();

			const { executeAsync, isPending } = useAction(
				deleteFeedbackAction,
				{
					onSuccess: () => {
						router.refresh();

						toast.success("Feedback has been deleted !");
					},
					onError: ({ error }) => {
						toast.error(error.serverError);
					},
				}
			);

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<Ellipsis className="size-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem asChild>
							<Link href={`/admin/feedbacks/${row.original.id}`}>
								<Eye className="size-5" />
								Voir
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								dialog.add({
									title: "Êtes vous sur ?",
									description:
										"Cette action est irréversible. L'utilisateur sera supprimé définitivement.",
									action: {
										label: "Supprimer",
										variant: "destructive",
										onClick: () => {
											executeAsync({
												feedbackId: row.original.id,
											});
										},
									},
									loading: isPending,
								});
							}}
						>
							<Trash className="size-5 text-red-500" />
							Supprimer
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

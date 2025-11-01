"use client";

import { Session } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Monitor, Smartphone, Trash } from "lucide-react";

import { deleteUserSessionAction } from "@/actions/admin/user/session/delete";
import { LoadingButton } from "@/components/loading-button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { dialog } from "@/providers/dialog-provider";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const userSessionsTable: ColumnDef<Session>[] = [
	{
		header: "Device",
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-4">
					{(() => {
						const ua = row.original.userAgent || "";
						const isMobile =
							/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
								ua.toLowerCase()
							);

						return (
							<>
								{isMobile ? (
									<Smartphone className="size-5" />
								) : (
									<Monitor className="size-5" />
								)}
							</>
						);
					})()}
					{(() => {
						const ua = row.original.userAgent || "";

						let browser = "Unknown";
						let os = "Unknown";

						if (/chrome|crios|crmo/i.test(ua)) {
							browser = "Chrome";
						} else if (/firefox|fxios/i.test(ua)) {
							browser = "Firefox";
						} else if (
							/safari/i.test(ua) &&
							!/chrome|crios|crmo/i.test(ua)
						) {
							browser = "Safari";
						} else if (/edg/i.test(ua)) {
							browser = "Edge";
						} else if (/opera|opr\//i.test(ua)) {
							browser = "Opera";
						}

						if (/windows nt/i.test(ua)) {
							os = "Windows";
						} else if (/macintosh|mac os x/i.test(ua)) {
							os = "macOS";
						} else if (/android/i.test(ua)) {
							os = "Android";
						} else if (/ios|iphone|ipad|ipod/i.test(ua)) {
							os = "iOS";
						} else if (/linux/i.test(ua)) {
							os = "Linux";
						}

						return (
							<div className="flex flex-col">
								<Typography>
									{browser} on {os}
								</Typography>
								<Typography
									variant="muted"
									className="truncate max-w-[250px]"
								>
									{ua}
								</Typography>
							</div>
						);
					})()}
				</div>
			);
		},
	},
	{
		accessorKey: "ipAddress",
		header: "IP Address",
	},
	{
		header: "Status",
		cell: ({ row }) => {
			const isExpires = dayjs().isAfter(dayjs(row.original.expiresAt));

			return (
				<Badge variant={isExpires ? "destructive" : "default"}>
					{isExpires ? "Expires" : "Active"}
				</Badge>
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
		accessorKey: "expiresAt",
		header: "Expires",
		cell: ({ row }) => {
			return (
				<div className="flex flex-col">
					<Typography>
						{dayjs(row.original.expiresAt).format("DD/MM/YYYY")}
					</Typography>
					<Typography variant="muted">
						{dayjs(row.original.expiresAt).format("HH:mm:ss")}
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
				deleteUserSessionAction,
				{
					onSuccess: () => {
						router.refresh();

						toast.success("Session has been deleted !");
					},
					onError: ({ error }) => {
						toast.error(error.serverError);
					},
				}
			);

			return (
				<LoadingButton
					variant="destructive"
					size="icon"
					onClick={() => {
						dialog.add({
							title: "Êtes vous sur ?",
							description:
								"Cette action est irréversible. La session sera supprimée définitivement.",
							action: {
								label: "Supprimer",
								variant: "destructive",
								onClick: () => {
									executeAsync({
										sessionId: row.original.id,
									});
								},
							},
							loading: isPending,
						});
					}}
					loading={isPending}
				>
					<Trash className="size-5" />
				</LoadingButton>
			);
		},
	},
];

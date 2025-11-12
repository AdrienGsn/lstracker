"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { DiscordIcon } from "@/components/icons/discord-icon";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { SocialProvider } from "@/types/auth";

export const userAuthenticationProvidersTable: ColumnDef<SocialProvider>[] = [
	{
		accessorKey: "provider",
		header: "Provider",
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<DiscordIcon />
					<p>
						{row.original.provider.charAt(0).toUpperCase() +
							row.original.provider.slice(1)}
					</p>
				</div>
			);
		},
	},
	{
		accessorKey: "accountId",
		header: "Account ID",
	},
	{
		header: "Status",
		cell: ({ row }) => {
			return <Badge variant="secondary">Connected</Badge>;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Connected at",
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
];

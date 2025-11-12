"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { MemberWithUser } from "@/types/organization";

export const adminMembersTable: ColumnDef<MemberWithUser>[] = [
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
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			return <Badge variant="secondary">{row.original.role}</Badge>;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Joined",
		cell: ({ row }) => {
			const joinedDate = dayjs(row.original.createdAt);
			const now = dayjs();
			const diffDays = now.diff(joinedDate, "days");
			const diffMonths = now.diff(joinedDate, "months");
			const diffYears = now.diff(joinedDate, "years");

			return (
				<div className="inline-flex items-center gap-2">
					<CalendarIcon className="size-4" />
					<span>
						{diffDays < 30
							? `${diffDays} days ago${diffDays > 1 ? "s" : ""}`
							: diffMonths < 12
							? `${diffMonths} month ago`
							: `${diffYears} year ago${
									diffYears > 1 ? "s" : ""
							  }`}
					</span>
				</div>
			);
		},
	},
];

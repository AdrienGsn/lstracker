"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { MemberWithTeam } from "@/types/organization";

export const memberTeamsTable: ColumnDef<MemberWithTeam>[] = [
	{
		accessorKey: "team",
		header: "Team",
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<Avatar className="size-10">
						{/* {row.original.team.logo ? (
							<AvatarImage src={row.original.team.logo} />
						) : ( */}
						<AvatarFallback>
							{row.original.team.name.slice(0, 2).toUpperCase()}
						</AvatarFallback>
						{/* )} */}
					</Avatar>
					<Typography className="font-bold">
						{row.original.team.name}
					</Typography>
				</div>
			);
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

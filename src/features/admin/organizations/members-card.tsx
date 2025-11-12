"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { MemberWithUser } from "@/types/organization";
import { AdminMembersTable } from "./admin-members-table";
import { adminMembersTable } from "./admin-members-table/columns";

export type MembersCardProps = {
	members: MemberWithUser[];
};

export const MembersCard = (props: MembersCardProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Members ({props.members.length})</CardTitle>
				<CardDescription>
					Liste des membres de cette organisation
				</CardDescription>
			</CardHeader>
			<CardContent>
				<AdminMembersTable
					columns={adminMembersTable}
					data={props.members}
				/>
			</CardContent>
		</Card>
	);
};

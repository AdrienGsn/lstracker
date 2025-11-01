import {
	Layout,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import { UsersTable } from "@/features/admin/users/users-table";
import { usersTable } from "@/features/admin/users/users-table/columns";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";

export default async function RoutePage(props: PageParams) {
	const users = await prisma.user.findMany();

	return (
		<Layout>
			<LayoutHeader>
				<LayoutTitle>User Management</LayoutTitle>
				<LayoutDescription>
					View and manage all users in the system
				</LayoutDescription>
			</LayoutHeader>
			<LayoutContent>
				<UsersTable columns={usersTable} data={users} />
			</LayoutContent>
		</Layout>
	);
}

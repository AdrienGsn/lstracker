import {
	Layout,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import { AdminOrganizationsTable } from "@/features/admin/organizations/admin-organizations-table";
import { adminOrganizationsTable } from "@/features/admin/organizations/admin-organizations-table/columns";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";

export default async function RoutePage(props: PageParams) {
	const organizations = await prisma.organization.findMany();

	return (
		<Layout>
			<LayoutHeader>
				<LayoutTitle>Organization Management</LayoutTitle>
				<LayoutDescription>
					View and manage all organizations in the system
				</LayoutDescription>
			</LayoutHeader>
			<LayoutContent>
				<AdminOrganizationsTable
					columns={adminOrganizationsTable}
					data={organizations}
				/>
			</LayoutContent>
		</Layout>
	);
}

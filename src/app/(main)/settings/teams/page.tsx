import {
	Layout,
	LayoutActions,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import { CreateTeamBtn } from "@/features/settings/teams/create-team-btn";
import { TeamsTable } from "@/features/settings/teams/teams-table";
import { teamsTable } from "@/features/settings/teams/teams-table/columns";
import { requiredCurrentUserCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";
import { TeamWithRelations } from "@/types/organization";

export async function generateMetadata() {
	const { session } = await requiredCurrentUserCache();

	const org = await prisma.organization.findUnique({
		where: { id: session?.activeOrganizationId! },
		select: { name: true },
	});

	return {
		title: `Équipes - Paramètres - ${org?.name}`,
	};
}

export default async function RoutePage(props: PageParams) {
	const { session } = await requiredCurrentUserCache();

	const teams = await prisma.team.findMany({
		where: { organizationId: session?.activeOrganizationId! },
		include: { members: true, markers: true },
	});

	return (
		<Layout>
			<LayoutHeader>
				<LayoutTitle>Equipes ({teams?.length})</LayoutTitle>
				<LayoutDescription>
					Gérez les equipes de votre organisation ici.
				</LayoutDescription>
			</LayoutHeader>
			<LayoutActions>
				<CreateTeamBtn />
			</LayoutActions>
			<LayoutContent>
				<TeamsTable
					columns={teamsTable}
					data={teams as TeamWithRelations[]}
				/>
			</LayoutContent>
		</Layout>
	);
}

import {
	Layout,
	LayoutActions,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import { CreateTeamBtn } from "@/features/settings/create-team-btn";
import { TeamsTable } from "@/features/settings/teams-table";
import { teamsTable } from "@/features/settings/teams-table/columns";
import { requiredCurrentUserCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";
import { TeamWithMembersAndMarkers } from "@/types/organization";

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
					data={teams as TeamWithMembersAndMarkers[]}
				/>
			</LayoutContent>
		</Layout>
	);
}

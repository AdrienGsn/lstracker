import { Team } from "@prisma/client";
import { headers } from "next/headers";

import { GTAMap } from "@/features/map/gta-map";
import { auth } from "@/lib/auth";
import { requiredCurrentUserCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";

export default async function RoutePage(props: PageParams) {
	const { user, session } = await requiredCurrentUserCache();

	if (!session?.activeOrganizationId) {
		return null;
	}

	const teams = await prisma.team.findMany({
		where: {
			organizationId: session.activeOrganizationId,
			members: {
				some: {
					userId: user?.id,
				},
			},
		},
	});

	const createPermissionResponse = await auth.api.hasPermission({
		body: { permissions: { marker: ["create"] } },
		headers: await headers(),
	});

	return (
		<GTAMap
			teams={teams as Team[]}
			canCreateMarker={Boolean(createPermissionResponse?.success)}
		/>
	);
}

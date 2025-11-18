import { Team } from "@prisma/client";
import { headers } from "next/headers";

import { GTAMap } from "@/features/map/gta-map";
import { auth } from "@/lib/auth";
import { requiredCurrentUserCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";

export async function generateMetadata() {
	const { user, session } = await requiredCurrentUserCache();

	if (!session?.activeOrganizationId) {
		return {
			title: "Carte",
		};
	}

	const team = await prisma.team.findUnique({
		where: { id: session.activeTeamId! },
		select: { name: true },
	});

	const org = await prisma.organization.findUnique({
		where: { id: session.activeOrganizationId },
		select: { name: true },
	});

	return {
		title: team ? `${team.name} - ${org?.name}` : `${org?.name}`,
	};
}

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

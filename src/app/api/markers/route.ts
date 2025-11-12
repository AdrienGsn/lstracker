import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orgRoute } from "@/lib/safe-route";

export const GET = orgRoute.handler(async (_req, { ctx }) => {
	const data = await auth.api.getSession({
		headers: await headers(),
	});

	const markers = await prisma.marker.findMany({
		where: {
			organizationId: ctx.organization.id,
			teamId: null,
		},
	});

	const teamMarkers = data?.session.activeTeamId
		? await prisma.marker.findMany({
				where: {
					organizationId: ctx.organization.id,
					teamId: data?.session.activeTeamId,
				},
		  })
		: [];

	return [...markers, ...teamMarkers];
});

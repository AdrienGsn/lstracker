import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orgRoute } from "@/lib/safe-route";

export const GET = orgRoute.handler(async (req, { ctx, params }) => {
	const markerId = params.id;

	const data = await auth.api.getSession({
		headers: await headers(),
	});

	const marker = await prisma.marker.findFirst({
		where: {
			id: markerId,
			organizationId: data?.session.activeOrganizationId!,
		},
	});

	if (!marker) {
		return new Response("Marqueur non trouvé", { status: 404 });
	}

	if (marker.teamId) {
		const teamMember = await prisma.teamMember.findFirst({
			where: {
				teamId: marker.teamId,
				userId: data?.user?.id!,
			},
		});

		if (!teamMember) {
			return new Response("Accès refusé", { status: 403 });
		}
	}

	return Response.json(marker);
});

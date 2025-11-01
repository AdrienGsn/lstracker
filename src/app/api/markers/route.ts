import { prisma } from "@/lib/prisma";
import { authRoute } from "@/lib/safe-route";
import { Marker } from "@prisma/client";

export const GET = authRoute.handler(async (_req) => {
	const markers = await prisma.marker.findMany();

	return markers as Marker[];
});

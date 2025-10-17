import { Marker } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { route } from "@/lib/safe-route";

export const GET = route.handler(async (_req) => {
	const markers = await prisma.marker.findMany();

	return markers as Marker[];
});

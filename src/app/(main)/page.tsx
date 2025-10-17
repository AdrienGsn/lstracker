import { GTAMap } from "@/features/gta-map";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";

export default async function RoutePage(props: PageParams) {
	const markers = await prisma.marker.findMany();

	return <GTAMap markers={markers} />;
}

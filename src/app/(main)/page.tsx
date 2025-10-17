import { GTAMap } from "@/features/gta-map";
import type { PageParams } from "@/types/next";

export default async function RoutePage(props: PageParams) {
	const markers = await fetch("/api/markers", { cache: "no-store" });

	const markersData = await markers.json();

	return <GTAMap markers={markersData} />;
}

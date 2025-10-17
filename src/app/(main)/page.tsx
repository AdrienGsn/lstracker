import { GTAMap } from "@/features/gta-map";
import type { PageParams } from "@/types/next";

export default async function RoutePage(props: PageParams) {
	return <GTAMap />;
}

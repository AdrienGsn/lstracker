import { Team } from "@prisma/client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { CreateMarkerBtn } from "./create-marker-btn";

export type MapHeaderProps = {
	teams: Team[];
};

export const MapHeader = (props: MapHeaderProps) => {
	return (
		<header className="flex items-center justify-between w-full z-50 p-4 absolute top-0 left-0 gap-4">
			<SidebarTrigger />
			<CreateMarkerBtn teams={props.teams} />
		</header>
	);
};

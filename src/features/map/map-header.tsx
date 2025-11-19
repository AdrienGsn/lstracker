import { Team } from "@prisma/client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CreateMarkerBtn } from "./create-marker-btn";

export type MapHeaderProps = {
	teams: Team[];
};

export const MapHeader = async (props: MapHeaderProps) => {
	const hasPermissionToCreate = await auth.api.hasPermission({
		body: {
			permissions: { marker: ["create"] },
		},
		headers: await headers(),
	});

	return (
		<header className="flex items-center justify-between w-full z-50 p-2 absolute top-0 left-0 gap-4">
			<SidebarTrigger variant="secondary" size="icon" />
			{hasPermissionToCreate?.success ? (
				<CreateMarkerBtn teams={props.teams} />
			) : null}
		</header>
	);
};

import { Team } from "@prisma/client";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MainSidebar } from "@/features/main/main-sidebar";
import { MapHeader } from "@/features/map/map-header";
import { auth } from "@/lib/auth";
import { requiredCurrentUserCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import type { LayoutParams } from "@/types/next";

export default async function RoutePage(props: LayoutParams) {
	const { user, session } = await requiredCurrentUserCache();

	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	if (!session?.activeOrganizationId) {
		const org = await prisma.organization.findFirst({
			where: { members: { some: { userId: user?.id } } },
		});

		if (!org) {
			return redirect("/onboarding");
		}

		await auth.api.setActiveOrganization({
			body: {
				organizationId: org?.id,
			},
			headers: await headers(),
		});
	}

	const teams = await prisma.team.findMany({
		where: {
			organizationId: session?.activeOrganizationId!,
			members: {
				some: {
					userId: user?.id,
				},
			},
		},
	});

	const markers = await prisma.marker.findMany({
		where: {
			organizationId: session?.activeOrganizationId!,
			OR: [
				{ teamId: null },
				{
					team: {
						members: {
							some: {
								userId: user?.id,
							},
						},
					},
				},
			],
		},
	});

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<MainSidebar
				teams={teams as Team[]}
				activeTeamId={session?.activeTeamId!}
				markers={markers}
			/>
			<SidebarInset className="relative">
				<MapHeader teams={teams as Team[]} />
				<main className="flex-1">{props.children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

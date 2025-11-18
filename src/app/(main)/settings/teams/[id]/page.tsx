import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Layout } from "@/components/page/layout";
import { TeamPage } from "@/features/settings/teams/team-page";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";
import { TeamWithRelations } from "@/types/organization";

export async function generateMetadata({ params }: PageParams<{ id: string }>) {
	const { id } = await params;

	const team = await prisma.team.findUnique({
		where: { id },
		select: { name: true, organization: { select: { name: true } } },
	});

	return {
		title: `${team?.name} - Paramètres - ${team?.organization.name}`,
	};
}

export default async function RoutePage(props: PageParams<{ id: string }>) {
	const { id } = await props.params;

	const team = await prisma.team.findUnique({
		where: { id },
		include: {
			members: { include: { user: true } },
			markers: { include: { user: true } },
			organization: { include: { members: { include: { user: true } } } },
		},
	});

	if (!team) {
		return notFound();
	}

	return (
		<Layout>
			<Suspense fallback={"Loading..."}>
				<TeamPage team={team as TeamWithRelations} />
			</Suspense>
		</Layout>
	);
}

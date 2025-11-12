import { Layout } from "@/components/page/layout";
import { TeamPage } from "@/features/settings/team-page";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function RoutePage(props: PageParams<{ id: string }>) {
	const { id } = await props.params;

	const team = await prisma.team.findUnique({
		where: { id },
		include: {
			members: { include: { user: true } },
			markers: { include: { user: true } },
		},
	});

	if (!team) {
		return notFound();
	}

	return (
		<Layout>
			<Suspense fallback={"Loading..."}>
				<TeamPage team={team} />
			</Suspense>
		</Layout>
	);
}

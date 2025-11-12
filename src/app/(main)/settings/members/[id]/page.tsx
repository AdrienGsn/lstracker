import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Layout } from "@/components/page/layout";
import { MemberPage } from "@/features/settings/member-page";
import { prisma } from "@/lib/prisma";
import { MarkerWithRelations } from "@/types/marker";
import type { PageParams } from "@/types/next";

export default async function RoutePage(props: PageParams<{ id: string }>) {
	const { id } = await props.params;

	const member = await prisma.member.findUnique({
		where: { id },
		include: {
			user: { include: { teamMembers: { include: { team: true } } } },
			organization: true,
		},
	});

	if (!member) {
		return notFound();
	}

	const markers = await prisma.marker.findMany({
		where: { userId: member.userId },
		include: {
			user: true,
			organization: true,
			team: true,
		},
	});

	return (
		<Layout>
			<Suspense fallback={"Loading..."}>
				<MemberPage
					member={member}
					markers={markers as MarkerWithRelations[]}
				/>
			</Suspense>
		</Layout>
	);
}

import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Layout } from "@/components/page/layout";
import { MemberPage } from "@/features/settings/members/member-page";
import { prisma } from "@/lib/prisma";
import { MarkerWithRelations } from "@/types/marker";
import type { PageParams } from "@/types/next";

export async function generateMetadata({ params }: PageParams<{ id: string }>) {
	const { id } = await params;

	const member = await prisma.member.findUnique({
		where: { id },
		select: {
			user: { select: { name: true } },
			organization: { select: { name: true } },
		},
	});

	return {
		title: `${member?.user?.name} - Membres - Paramètres - ${member?.organization.name}`,
	};
}

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

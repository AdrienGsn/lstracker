import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JoinCard } from "@/features/join-card";
import { requiredCurrentUserCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";

export async function generateMetadata({
	params,
}: PageParams<{ id: string }>): Promise<Metadata> {
	const { id } = await params;

	const invitation = await prisma.invitation.findUnique({
		where: { id },
		select: { organization: { select: { name: true } } },
	});

	if (!invitation) {
		return notFound();
	}

	return {
		title: `Rejoindre ${invitation.organization.name}`,
	};
}

export default async function RoutePage(props: PageParams<{ id: string }>) {
	const { user } = await requiredCurrentUserCache();

	const { id } = await props.params;

	const invitation = await prisma.invitation.findUnique({
		where: { id },
		include: { inviter: true, organization: true },
	});

	if (!invitation) {
		return notFound();
	}

	return <JoinCard invitation={invitation} />;
}

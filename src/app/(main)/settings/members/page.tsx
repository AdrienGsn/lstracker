import { headers } from "next/headers";
import { notFound } from "next/navigation";

import {
	Layout,
	LayoutActions,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import { InviteMemberBtn } from "@/features/settings/members/invite-member-btn";
import { MembersTable } from "@/features/settings/members/members-table";
import { membersTable } from "@/features/settings/members/members-table/columns";
import { auth } from "@/lib/auth";
import { requiredCurrentUserCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";
import { MemberWithUser } from "@/types/organization";

export async function generateMetadata() {
	const { session } = await requiredCurrentUserCache();

	const org = await prisma.organization.findUnique({
		where: { id: session?.activeOrganizationId! },
		select: { name: true },
	});

	if (!org) {
		return notFound();
	}

	return {
		title: `Membres - Paramètres - ${org.name}`,
	};
}

export default async function RoutePage(props: PageParams) {
	const { session } = await requiredCurrentUserCache();

	const { members, total } = await auth.api.listMembers({
		headers: await headers(),
	});

	const hasPermissionToInvite = await auth.api.hasPermission({
		headers: await headers(),
		body: {
			permission: { invitation: ["create"] },
		},
	});

	return (
		<Layout>
			<LayoutHeader>
				<LayoutTitle>Membres ({total})</LayoutTitle>
				<LayoutDescription>
					Gérez les membres de votre organisation ici.
				</LayoutDescription>
			</LayoutHeader>
			{hasPermissionToInvite.success ? (
				<LayoutActions>
					<InviteMemberBtn />
				</LayoutActions>
			) : null}
			<LayoutContent>
				<MembersTable
					columns={membersTable}
					data={members as MemberWithUser[]}
				/>
			</LayoutContent>
		</Layout>
	);
}

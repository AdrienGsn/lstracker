import { headers } from "next/headers";

import {
	Layout,
	LayoutActions,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import { InviteMemberBtn } from "@/features/settings/invite-member-btn";
import { MembersTable } from "@/features/settings/members-table";
import { membersTable } from "@/features/settings/members-table/columns";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/org";
import { requiredCurrentUserCache } from "@/lib/cache";
import type { PageParams } from "@/types/next";
import { MemberWithUser } from "@/types/organization";

export default async function RoutePage(props: PageParams) {
	const { session } = await requiredCurrentUserCache();

	const { members, total } = await auth.api.listMembers({
		headers: await headers(),
	});

	const hasPermissionToInvite = await hasPermission({
		invitation: ["create"],
	});

	return (
		<Layout>
			<LayoutHeader>
				<LayoutTitle>Membres ({total})</LayoutTitle>
				<LayoutDescription>
					Gérez les membres de votre organisation ici.
				</LayoutDescription>
			</LayoutHeader>
			{hasPermissionToInvite ? (
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

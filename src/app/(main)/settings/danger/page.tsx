import {
	Layout,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import { DeleteOrgCard } from "@/features/settings/delete-org-card";
import { TransfertOrgCard } from "@/features/settings/transfert-org-card";
import { auth } from "@/lib/auth";
import { requiredCurrentUserCache } from "@/lib/cache";
import type { PageParams } from "@/types/next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function RoutePage(props: PageParams) {
	const { session } = await requiredCurrentUserCache();

	const hasPermission = await auth.api.hasPermission({
		body: {
			organizationId: session?.activeOrganizationId!,
			permission: {
				organization: ["delete"],
			},
		},
		headers: await headers(),
	});

	if (!hasPermission) {
		return notFound();
	}

	return (
		<Layout>
			<LayoutHeader>
				<LayoutTitle>Danger Zone</LayoutTitle>
				<LayoutDescription>
					Cette section contient des actions sensibles et
					potentiellement destructives pour l’organisation. Veuillez
					procéder avec prudence.
				</LayoutDescription>
			</LayoutHeader>
			<LayoutContent className="space-y-4">
				<TransfertOrgCard />
				<DeleteOrgCard />
			</LayoutContent>
		</Layout>
	);
}

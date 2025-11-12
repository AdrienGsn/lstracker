import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { requiredCurrentUserCache } from "@/lib/cache";
import type { LayoutParams } from "@/types/next";

export default async function RoutePage(props: LayoutParams) {
	const { session } = await requiredCurrentUserCache();

	const hasPermission = await auth.api.hasPermission({
		body: {
			organizationId: session?.activeOrganizationId!,
			permission: {
				organization: ["update"],
				member: ["create", "update"],
				invitation: ["create"],
			},
		},
		headers: await headers(),
	});

	if (!hasPermission) {
		return notFound();
	}

	return props.children;
}

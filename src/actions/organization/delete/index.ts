"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { orgAction } from "@/lib/safe-action";

export const deleteOrganizationAction = orgAction
	.metadata({ permissions: { organization: ["delete"] } })
	.action(async ({ ctx }) => {
		return await auth.api.deleteOrganization({
			body: {
				organizationId: ctx.session.activeOrganizationId!,
			},
			headers: await headers(),
		});
	});

"use server";

import { auth } from "@/lib/auth";
import { adminAction } from "@/lib/safe-action";
import { headers } from "next/headers";
import { DeleteOrganizationSchema } from "./schema";

export const deleteOrganizationAction = adminAction
	.inputSchema(DeleteOrganizationSchema)
	.action(async ({ parsedInput: { orgId }, ctx }) => {
		return await auth.api.deleteOrganization({
			body: {
				organizationId: orgId,
			},
			headers: await headers(),
		});
	});

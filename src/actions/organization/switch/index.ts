"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { authAction } from "@/lib/safe-action";
import { SwitchOrgSchema } from "./schema";

export const switchOrgAction = authAction
	.inputSchema(SwitchOrgSchema)
	.action(async ({ parsedInput: { organizationId }, ctx }) => {
		const org = await auth.api.setActiveOrganization({
			body: {
				organizationId,
			},
			headers: await headers(),
		});

		revalidatePath("/");

		return org;
	});

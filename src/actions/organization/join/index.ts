"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { authAction } from "@/lib/safe-action";
import { JoinOrganizationSchema } from "./schema";

export const joinOrganizationAction = authAction
	.inputSchema(JoinOrganizationSchema)
	.action(async ({ parsedInput: { invitationId }, ctx }) => {
		await auth.api.acceptInvitation({
			body: {
				invitationId,
			},
			headers: await headers(),
		});
	});

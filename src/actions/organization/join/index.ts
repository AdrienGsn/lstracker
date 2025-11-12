"use server";

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
		});
	});

"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { orgAction } from "@/lib/safe-action";
import { DeleteTeamMemberSchema } from "./schema";

export const deleteTeamMemberAction = orgAction
	.metadata({ permissions: { team: ["delete"] } })
	.inputSchema(DeleteTeamMemberSchema)
	.action(async ({ parsedInput: { teamId, userId }, ctx }) => {
		await auth.api.removeTeamMember({
			body: {
				teamId,
				userId,
			},
		});

		revalidatePath(`/settings/teams/${teamId}`);
	});

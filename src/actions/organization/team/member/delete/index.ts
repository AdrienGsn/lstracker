"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { orgAction } from "@/lib/safe-action";
import { DeleteTeamMemberSchema } from "./schema";

export const deleteTeamMemberAction = orgAction
	.metadata({ permissions: { team: ["delete"] } })
	.inputSchema(DeleteTeamMemberSchema)
	.action(async ({ parsedInput: { teamId, memberId }, ctx }) => {
		await prisma.teamMember.delete({
			where: {
				id: memberId,
				teamId,
			},
		});

		revalidatePath(`/settings/teams/${teamId}`);
	});

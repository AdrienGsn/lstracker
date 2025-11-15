"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ActionError, orgAction } from "@/lib/safe-action";
import { CreateTeamMemberSchema } from "./schema";

export const createTeamMemberAction = orgAction
	.metadata({ permissions: { team: ["create"] } })
	.inputSchema(CreateTeamMemberSchema)
	.action(async ({ parsedInput: { teamId, userId }, ctx }) => {
		const team = await prisma.team.findUnique({ where: { id: teamId } });

		if (!team) {
			throw new ActionError("L'équipe spécifiée est introuvable.");
		}

		const user = await prisma.user.findUnique({ where: { id: userId } });

		if (!user) {
			throw new ActionError("L'utilisateur spécifié est introuvable.");
		}

		await prisma.teamMember.create({
			data: {
				teamId,
				userId,
			},
		});

		revalidatePath(`/settings/teams/${teamId}`);
	});

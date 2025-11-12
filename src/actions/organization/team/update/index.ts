"use server";

import { prisma } from "@/lib/prisma";
import { orgAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { UpdateTeamSchema } from "./schema";

export const updateTeamAction = orgAction
	.metadata({ permissions: { team: ["update"] } })
	.inputSchema(UpdateTeamSchema)
	.action(async ({ parsedInput: { teamId, name, channelId }, ctx }) => {
		const team = await prisma.team.update({
			where: { id: teamId },
			data: {
				name,
				...(channelId !== undefined
					? {
							metadata: channelId
								? JSON.stringify({ channelId })
								: null,
					  }
					: {}),
			},
		});

		revalidatePath("/");

		return team;
	});

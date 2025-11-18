"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { orgAction } from "@/lib/safe-action";
import { CreateTeamSchema } from "./schema";

export const createTeamAction = orgAction
	.metadata({ permissions: { team: ["create"] } })
	.inputSchema(CreateTeamSchema)
	.action(async ({ parsedInput: { name, channelId }, ctx }) => {
		const team = await auth.api.createTeam({
			body: {
				name,
				...(channelId !== undefined
					? {
							metadata: channelId
								? JSON.stringify({ channelId })
								: undefined,
					  }
					: {}),
			},
			headers: await headers(),
		});

		await auth.api.addTeamMember({
			body: {
				userId: ctx.user.id,
				teamId: team.id,
			},
			headers: await headers(),
		});

		revalidatePath("/");
		revalidatePath("/settings/teams");

		return team;
	});

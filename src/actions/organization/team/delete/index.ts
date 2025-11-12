"use server";

import { auth } from "@/lib/auth";
import { orgAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { DeleteTeamSchema } from "./schema";

export const deleteTeamAction = orgAction
	.metadata({ permissions: { team: ["delete"] } })
	.inputSchema(DeleteTeamSchema)
	.action(async ({ parsedInput: { teamId, organizationId }, ctx }) => {
		if (ctx.session.activeTeamId === teamId) {
			await auth.api.setActiveTeam({
				body: {
					teamId: undefined,
				},
				headers: await headers(),
			});
		}

		await auth.api.removeTeam({
			body: {
				teamId,
				organizationId,
			},
			headers: await headers(),
		});

		revalidatePath("/");
		revalidatePath("/settings/teams");
	});

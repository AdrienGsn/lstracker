"use server";

import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/safe-action";
import { BugReportSchema } from "./schema";

export const bugReportAction = authAction
	.inputSchema(BugReportSchema)
	.action(async ({ parsedInput: { message }, ctx }) => {
		await prisma.bugReport.create({
			data: {
				userId: ctx.user.id,
				message,
			},
		});
	});

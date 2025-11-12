"use server";

import { auth } from "@/lib/auth";
import { authAction } from "@/lib/safe-action";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { CreateOrgSchema } from "./schema";

export const createOrgAction = authAction
	.inputSchema(CreateOrgSchema)
	.action(async ({ parsedInput: { name, slug, files, guildId }, ctx }) => {
		let blob = { url: "" };

		if (files && files.length > 0 && files[0]) {
			blob = await put(files[0].name, files[0], {
				access: "public",
				addRandomSuffix: true,
			});
		}

		const org = await auth.api.createOrganization({
			body: {
				userId: ctx.user.id,
				name,
				slug,
				logo: files && files[0] ? blob.url : undefined,
				metadata: { guildId },
			},
			headers: await headers(),
		});

		revalidatePath("/");

		return org;
	});

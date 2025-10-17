"use server";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { action } from "@/lib/safe-action";
import { FamtomeSchema } from "./schema";

export const fantomeAction = action
	.inputSchema(FamtomeSchema)
	.action(async ({ parsedInput: { lat, lng } }) => {
		logger.debug(lat, lng);
		await prisma.marker.create({
			data: {
				lat: Number(lat),
				lng: Number(lng),
				label: "Fantome",
			},
		});
	});

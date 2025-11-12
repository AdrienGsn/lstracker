import { z } from "zod";

export const BanUserSchema = z.object({
	userId: z.string(),
	reason: z.string(),
	expires: z.number(),
});

export type BanUserSchemaType = z.infer<typeof BanUserSchema>;

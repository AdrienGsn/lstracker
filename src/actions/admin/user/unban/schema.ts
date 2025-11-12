import { z } from "zod";

export const UnbanUserSchema = z.object({
	userId: z.string(),
});

export type UnbanUserSchemaType = z.infer<typeof UnbanUserSchema>;

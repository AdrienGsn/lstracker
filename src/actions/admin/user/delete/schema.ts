import { z } from "zod";

export const DeleteUserSchema = z.object({
	userId: z.string(),
});

export type DeleteUserSchemaType = z.infer<typeof DeleteUserSchema>;

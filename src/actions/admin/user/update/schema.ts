import { z } from "zod";

export const UpdateUserSchema = z.object({
	userId: z.string(),
	name: z.string(),
	email: z.email(),
	role: z.enum(["user", "admin"]),
});

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;

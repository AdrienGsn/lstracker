import { z } from "zod";

export const DeleteAllUserSessionsSchema = z.object({
	userId: z.string(),
});

export type DeleteAllUserSessionsSchemaType = z.infer<
	typeof DeleteAllUserSessionsSchema
>;

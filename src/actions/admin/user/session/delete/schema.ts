import { z } from "zod";

export const DeleteUserSession = z.object({
	sessionId: z.string(),
});

export type DeleteUserSessionSchemaType = z.infer<typeof DeleteUserSession>;

import { z } from "zod";

export const CreateTeamSchema = z.object({
	name: z.string(),
	channelId: z.string().optional().nullable(),
});

export type CreateTeamSchemaType = z.infer<typeof CreateTeamSchema>;

import { z } from "zod";

export const UpdateTeamSchema = z.object({
	teamId: z.string(),
	name: z.string(),
	channelId: z.string().optional().nullable(),
});

export type UpdateTeamSchemaType = z.infer<typeof UpdateTeamSchema>;

import { z } from "zod";

export const DeleteTeamSchema = z.object({
	teamId: z.string(),
	organizationId: z.string(),
});

export type DeleteTeamSchemaType = z.infer<typeof DeleteTeamSchema>;

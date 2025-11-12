import { z } from "zod";
export const CreateTeamSchema = z.object({
	name: z.string(),
});

export type CreateTeamSchemaType = z.infer<typeof CreateTeamSchema>;

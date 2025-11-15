import { z } from "zod";

export const CreateTeamMemberSchema = z.object({
	teamId: z.string(),
	userId: z.string(),
});

export type CreateTeamMemberSchemaType = z.infer<typeof CreateTeamMemberSchema>;

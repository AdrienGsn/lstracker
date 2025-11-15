import { z } from "zod";

export const DeleteTeamMemberSchema = z.object({
	teamId: z.string(),
	userId: z.string(),
});

export type DeleteTeamMemberSchemaType = z.infer<typeof DeleteTeamMemberSchema>;

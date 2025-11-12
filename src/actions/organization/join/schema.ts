import { z } from "zod";

export const JoinOrganizationSchema = z.object({
	invitationId: z.string(),
});

export type JoinOrganizationSchemaType = z.infer<typeof JoinOrganizationSchema>;

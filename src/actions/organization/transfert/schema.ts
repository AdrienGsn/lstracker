import { z } from "zod";

export const TransfertOrgSchema = z.object({
	memberId: z.string(),
});

export type TransfertOrgSchemaType = z.infer<typeof TransfertOrgSchema>;

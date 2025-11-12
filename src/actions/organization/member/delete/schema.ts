import { z } from "zod";

export const DeleteOrgMemberSchema = z.object({
	memberId: z.string(),
});

export type DeleteOrgMemberSchemaType = z.infer<typeof DeleteOrgMemberSchema>;

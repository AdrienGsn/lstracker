import { z } from "zod";

export const UpdateOrgMemberSchema = z.object({
	memberId: z.string(),
	role: z.enum(["member", "admin", "owner"]),
});

export type UpdateOrgMemberSchemaType = z.infer<typeof UpdateOrgMemberSchema>;

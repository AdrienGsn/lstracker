import { z } from "zod";

export const SwitchOrgSchema = z.object({
	organizationId: z.string(),
});

export type SwitchOrgSchemaType = z.infer<typeof SwitchOrgSchema>;

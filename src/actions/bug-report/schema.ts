import { z } from "zod";

export const BugReportSchema = z.object({
	message: z.string(),
});

export type BugReportSchemaType = z.infer<typeof BugReportSchema>;

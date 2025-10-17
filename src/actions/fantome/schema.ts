import { z } from "zod";

export const FamtomeSchema = z.object({
	lat: z.string().regex(/^-?\d+(\.\d+)?$/, "Nombre invalide"),
	lng: z.string().regex(/^-?\d+(\.\d+)?$/, "Nombre invalide"),
});

export type FantomeSchemaType = z.infer<typeof FamtomeSchema>;

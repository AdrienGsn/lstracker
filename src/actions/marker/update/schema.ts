import { z } from "zod";

export const UpdateMarkerSchema = z.object({
	markerId: z.string(),
	label: z
		.string({ error: "Veuillez entrer un nom" })
		.min(3, "Le nom doit contenir au moins 3 caractères")
		.max(50, "Le nom ne peut pas dépasser 50 caractères")
		.regex(/^[a-zA-ZÀ-ÿ0-9\s'-]+$/, {
			message: "Le nom ne doit pas contenir de caractères spéciaux",
		}),
	icon: z.string().optional(),
	lat: z.string(),
	lng: z.string(),
});

export type UpdateMarkerSchemaType = z.infer<typeof UpdateMarkerSchema>;

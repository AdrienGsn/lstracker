import { SiteConfig } from "@/types/config/site";

export const siteConfig: SiteConfig = {
	title: "LSTracker",
	prodUrl: "https://lstracker.addevelopment.fr",
	domain: "lstracker.addevelopment.fr",
	company: {
		name: "LSTracker",
		address: "1234 Main St, Anytown, USA",
	},
	email: {
		from: "LSTracker <onboarding@resend.dev>",
		contact: "onboarding@resend.dev",
	},
} as const;

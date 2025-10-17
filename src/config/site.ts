import { SiteConfig } from "@/types/config/site";

export const siteConfig: SiteConfig = {
	title: "LSTracker",
	prodUrl: "https://lstracker.vercel.app",
	domain: "lstracker.vercel.app",
	company: {
		name: "RoyalRP",
		address: "1234 Main St, Anytown, USA",
	},
	email: {
		from: "LSTracker <onboarding@resend.dev>",
		contact: "onboarding@resend.dev",
	},
} as const;

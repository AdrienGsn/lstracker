import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		authInterrupts: true,
		serverActions: {
			bodySizeLimit: "2mb",
		},
	},

	serverExternalPackages: ["discord.js", "@discordjs/ws"],
};

export default nextConfig;

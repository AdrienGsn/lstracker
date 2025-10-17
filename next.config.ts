import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		authInterrupts: true,
		serverComponentsExternalPackages: ["@prisma/client", "prisma"],
	},
};

export default nextConfig;

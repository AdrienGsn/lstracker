import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PropsWithChildren, Suspense } from "react";

import "@/app/globals.css";

import { TailwindIndicator } from "@/components/utils/tailwind-indicator";
import { siteConfig } from "@/config/site";
import { ServerToaster } from "@/lib/server-toast/server-toast.server";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";
import { PageParams } from "@/types/next";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: siteConfig.title,
		template: `%s | ${siteConfig.title}`,
	},
	icons: [
		{
			rel: "favicon",
			url: "/images/favicon.ico",
		},
		{
			rel: "icon",
			url: "/images/logo.svg",
		},
		{
			rel: "apple-icon",
			url: "/images/apple-icon.png",
		},
	],
};

export type RootLayoutProps = PropsWithChildren<{ modal: React.ReactNode }> &
	PageParams;

export default async function RootLayout(props: RootLayoutProps) {
	return (
		<html lang="fr" className="h-full" suppressHydrationWarning>
			<body
				className={cn(
					"h-full antialiased",
					geistSans.variable,
					geistMono.variable
				)}
			>
				<Providers>
					{props.children}
					<Suspense>
						<ServerToaster />
					</Suspense>
					<TailwindIndicator />
				</Providers>
			</body>
		</html>
	);
}

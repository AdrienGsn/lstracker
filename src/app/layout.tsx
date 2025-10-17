import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { PropsWithChildren } from "react";

import "@/app/globals.css";

import { TailwindIndicator } from "@/components/utils/tailwind-indicator";
import { siteConfig } from "@/config/site";
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
			url: "/images/logo.png",
		},
		{
			rel: "apple-icon",
			url: "/images/apple-icon.png",
		},
	],
	robots: {
		index: false,
		follow: false,
		googleBot: {
			index: false,
			follow: false,
		},
	},
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
				<NextTopLoader
					color="hsl(var(--primary))"
					showSpinner={false}
					shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))"
					height={2}
					zIndex={99999}
				/>
				<Providers>
					{props.children}
					<TailwindIndicator />
				</Providers>
			</body>
		</html>
	);
}

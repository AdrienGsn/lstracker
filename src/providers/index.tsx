"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren, useState } from "react";

import { Toaster } from "@/components/ui/sonner";
import { DialogProvider } from "./dialog-provider";

export type ProvidersProps = PropsWithChildren;

export const Providers = (props: ProvidersProps) => {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			storageKey="theme"
		>
			<QueryClientProvider client={queryClient}>
				<Toaster />
				<DialogProvider />
				{props.children}
			</QueryClientProvider>
		</ThemeProvider>
	);
};

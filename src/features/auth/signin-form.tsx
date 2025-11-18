"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { DiscordIcon } from "@/components/icons/discord-icon";
import { LoadingButton } from "@/components/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authConfig } from "@/config/auth";
import { authClient } from "@/lib/auth/client";

export const SigninForm = () => {
	const searchParams = useSearchParams();
	const redirectUrl =
		searchParams.get("redirectUrl") || authConfig.callbackUrl;

	const [loading, setLoading] = useState(false);

	return (
		<Card className="max-w-lg w-full">
			<CardHeader>
				<CardTitle>Se connecter</CardTitle>
			</CardHeader>
			<CardContent>
				<LoadingButton
					className="w-full"
					variant="secondary"
					size="lg"
					loading={loading}
					onClick={async () => {
						setLoading(true);

						await authClient.signIn.social({
							provider: "discord",
							callbackURL: redirectUrl,
						});
					}}
				>
					<DiscordIcon className="size-6" />
					Se connecter avec Discord
				</LoadingButton>
			</CardContent>
		</Card>
	);
};

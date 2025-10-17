import { Metadata } from "next";

import { SigninForm } from "@/features/auth/signin-form";
import type { PageParams } from "@/types/next";

export const metadata: Metadata = {
	title: "Se connecter",
};

export default async function RoutePage(props: PageParams) {
	return (
		<div className="size-full flex items-center justify-center p-4">
			<SigninForm />
		</div>
	);
}

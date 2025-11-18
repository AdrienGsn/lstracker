import { Metadata } from "next";

import {
	Layout,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import { DeleteAccountCard } from "@/features/account/delete-account-card";
import type { PageParams } from "@/types/next";

export const metadata: Metadata = {
	title: "Mon compte",
};

export default async function RoutePage(props: PageParams) {
	return (
		<Layout>
			<LayoutHeader>
				<LayoutTitle>Mon compte</LayoutTitle>
				<LayoutDescription>
					Gérez vos informations personnelles et votre compte.
				</LayoutDescription>
			</LayoutHeader>
			<LayoutContent>
				<DeleteAccountCard />
			</LayoutContent>
		</Layout>
	);
}

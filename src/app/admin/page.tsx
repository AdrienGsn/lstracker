import { Metadata } from "next";

import {
	Layout,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import type { PageParams } from "@/types/next";

export const metadata: Metadata = {
	title: "Administration",
};

export default async function RoutePage(props: PageParams) {
	return (
		<Layout>
			<LayoutHeader>
				<LayoutTitle>Admin Dashboard</LayoutTitle>
				<LayoutDescription>
					Manage users and organizations
				</LayoutDescription>
			</LayoutHeader>
			<LayoutContent></LayoutContent>
		</Layout>
	);
}

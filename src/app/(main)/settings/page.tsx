import { Layout, LayoutContent } from "@/components/page/layout";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { requiredCurrentUserCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";

export default async function RoutePage(props: PageParams) {
	const { session } = await requiredCurrentUserCache();

	const organization = await prisma.organization.findUnique({
		where: { id: session?.activeOrganizationId! },
		include: {
			markers: true,
			members: true,
		},
	});

	return (
		<Layout>
			<LayoutContent>
				<div className="grid grid-cols-4 gap-4 w-full">
					<Card>
						<CardHeader>
							<CardTitle>Marqueur(s)</CardTitle>
							<CardDescription>
								Nombre total de marqueurs
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Typography variant="h1">
								{organization?.markers.length}
							</Typography>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Membre(s)</CardTitle>
							<CardDescription>
								Nombre total de membres
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Typography variant="h1">
								{organization?.members.length}
							</Typography>
						</CardContent>
					</Card>
				</div>
			</LayoutContent>
		</Layout>
	);
}

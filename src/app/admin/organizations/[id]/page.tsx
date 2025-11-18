import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
	Layout,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { MembersCard } from "@/features/admin/organizations/members-card";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";
import { MemberWithUser } from "@/types/organization";

export async function generateMetadata({ params }: PageParams<{ id: string }>) {
	const { id } = await params;

	const organization = await prisma.organization.findUnique({
		where: { id },
		select: { name: true },
	});

	if (!organization) {
		return notFound();
	}

	return {
		title: `${organization.name} - Administration`,
	};
}

export default async function RoutePage(props: PageParams<{ id: string }>) {
	const { id } = await props.params;

	const organization = await prisma.organization.findUnique({
		where: { id },
	});

	if (!organization) {
		return notFound();
	}

	const members = await prisma.member.findMany({
		where: {
			organizationId: id,
		},
		include: {
			user: true,
		},
	});

	return (
		<Layout>
			<LayoutHeader>
				<Link
					href="/admin/organizations"
					className={buttonVariants({ variant: "link" })}
				>
					<ArrowLeft />
					Back to organizations
				</Link>
				<LayoutTitle>{organization.name}</LayoutTitle>
				<LayoutDescription>
					Manage {organization.name}'s members
				</LayoutDescription>
			</LayoutHeader>
			<LayoutContent className="flex flex-col gap-4">
				<Item variant="muted">
					<ItemMedia>
						<Avatar className="size-10">
							{organization.logo ? (
								<AvatarImage src={organization.logo} />
							) : (
								<AvatarFallback>
									{organization.name
										.slice(0, 2)
										.toUpperCase()}
								</AvatarFallback>
							)}
						</Avatar>
					</ItemMedia>
					<ItemContent>
						<ItemTitle className="font-bold">
							{organization.name}
						</ItemTitle>
					</ItemContent>
				</Item>
				<MembersCard members={members as MemberWithUser[]} />
			</LayoutContent>
		</Layout>
	);
}

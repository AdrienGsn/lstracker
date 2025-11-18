import { Session } from "@prisma/client";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
	Layout,
	LayoutActions,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { UserActionsDropdown } from "@/features/admin/users/user-actions-dropdown";
import { UserAuthenticationProvidersCard } from "@/features/admin/users/user-authentication-providers-card";
import { UserOrganizationsCard } from "@/features/admin/users/user-organizations-card";
import { UserSessionsCard } from "@/features/admin/users/user-sessions-card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SocialProvider } from "@/types/auth";
import type { PageParams } from "@/types/next";

export async function generateMetadata({ params }: PageParams<{ id: string }>) {
	const { id } = await params;

	const user = await prisma.user.findUnique({
		where: { id },
		select: { name: true },
	});

	if (!user) {
		return notFound();
	}

	return {
		title: `${user.name} - Administration`,
	};
}

export default async function RoutePage(props: PageParams<{ id: string }>) {
	const { id } = await props.params;

	const user = await prisma.user.findUnique({ where: { id } });

	if (!user) {
		return notFound();
	}

	const orgs = await prisma.organization.findMany({
		where: {
			members: {
				some: {
					userId: user.id,
				},
			},
		},
		include: {
			members: {
				where: {
					userId: user.id,
				},
			},
		},
	});

	const { sessions } = await auth.api.listUserSessions({
		body: {
			userId: user.id,
		},
		headers: await headers(),
	});

	const providers = await auth.api.listUserAccounts({
		headers: await headers(),
	});

	return (
		<Layout>
			<LayoutHeader>
				<Link
					href="/admin/users"
					className={buttonVariants({ variant: "link" })}
				>
					<ArrowLeft />
					Back to users
				</Link>
				<LayoutTitle>User Details</LayoutTitle>
				<LayoutDescription>
					View and manage user information and organization
					memberships
				</LayoutDescription>
			</LayoutHeader>
			<LayoutActions>
				<UserActionsDropdown
					userId={user.id}
					banned={user.banned || false}
				/>
			</LayoutActions>
			<LayoutContent className="flex flex-col gap-4">
				<Item variant="muted">
					<ItemMedia>
						<Avatar className="size-10">
							{user.image ? (
								<AvatarImage src={user.image} />
							) : (
								<AvatarFallback>
									{user.name.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							)}
						</Avatar>
					</ItemMedia>
					<ItemContent>
						<ItemTitle className="font-bold">{user.name}</ItemTitle>
						<ItemDescription>{user.email}</ItemDescription>
					</ItemContent>
					<ItemFooter className="justify-start">
						<Badge
							variant={
								user.role === "admin" ? "default" : "secondary"
							}
						>
							{user.role}
						</Badge>
						<span>
							{" "}
							• Created:{" "}
							{dayjs(user.createdAt).format("DD/MM/YYYY")}
						</span>
					</ItemFooter>
					<ItemActions>
						{user.banned ? (
							<Badge variant="destructive">Bannis</Badge>
						) : null}
					</ItemActions>
				</Item>
				<UserOrganizationsCard organizations={orgs} />
				<UserSessionsCard
					userId={user.id}
					sessions={sessions as Session[]}
				/>
				<UserAuthenticationProvidersCard
					providers={providers as SocialProvider[]}
				/>
			</LayoutContent>
		</Layout>
	);
}

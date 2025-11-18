import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
	Layout,
	LayoutActions,
	LayoutContent,
	LayoutHeader,
} from "@/components/page/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";

export async function generateMetadata({ params }: PageParams<{ id: string }>) {
	const { id } = await params;

	const feedback = await prisma.bugReport.findUnique({
		where: { id },
		select: { user: { select: { name: true } } },
	});

	if (!feedback) {
		return notFound();
	}

	return {
		title: `${feedback.user?.name} - Feedback - Administration`,
	};
}

export default async function RoutePage(props: PageParams<{ id: string }>) {
	const { id } = await props.params;

	const feedback = await prisma.bugReport.findUnique({
		where: { id },
		include: { user: true },
	});

	if (!feedback) {
		return notFound();
	}

	return (
		<Layout>
			<LayoutHeader>
				<Link
					href="/admin/feedback"
					className={buttonVariants({ variant: "link" })}
				>
					<ArrowLeft />
					Back to feedbacks
				</Link>
			</LayoutHeader>
			<LayoutActions>CASAS</LayoutActions>
			<LayoutContent className="flex flex-col gap-4">
				<Item variant="muted">
					<ItemMedia>
						<Avatar className="size-10">
							{feedback.user?.image ? (
								<AvatarImage src={feedback.user?.image} />
							) : (
								<AvatarFallback>
									{feedback.user?.name
										.slice(0, 2)
										.toUpperCase()}
								</AvatarFallback>
							)}
						</Avatar>
					</ItemMedia>
					<ItemContent>
						<ItemTitle className="font-bold">
							{feedback.user?.name}
						</ItemTitle>
						<ItemDescription>
							{feedback.user?.email}
						</ItemDescription>
					</ItemContent>
				</Item>
				<Item variant="muted">
					<ItemContent>
						<ItemTitle className="font-bold">Message</ItemTitle>
						<ItemDescription>{feedback.message}</ItemDescription>
					</ItemContent>
				</Item>
			</LayoutContent>
		</Layout>
	);
}

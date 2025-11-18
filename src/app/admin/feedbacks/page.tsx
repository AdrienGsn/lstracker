import { Metadata } from "next";

import {
	Layout,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import { FeedbacksTable } from "@/features/admin/feedback-table";
import { feedbacksTable } from "@/features/admin/feedback-table/columns";
import { prisma } from "@/lib/prisma";
import { FeedbackWithUser } from "@/types/feedback";
import type { PageParams } from "@/types/next";

export const metadata: Metadata = {
	title: "Feedback - Administration",
};

export default async function RoutePage(props: PageParams) {
	const feedbacks = await prisma.bugReport.findMany({
		include: { user: true },
	});

	return (
		<Layout>
			<LayoutHeader>
				<LayoutTitle>Feedback</LayoutTitle>
				<LayoutDescription>
					View and manage all feedback in the system
				</LayoutDescription>
			</LayoutHeader>
			<LayoutContent>
				<FeedbacksTable
					columns={feedbacksTable}
					data={feedbacks as FeedbackWithUser[]}
				/>
			</LayoutContent>
		</Layout>
	);
}

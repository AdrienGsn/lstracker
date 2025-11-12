import { BugReport, User } from "@prisma/client";

export type FeedbackWithUser = BugReport & {
	user: User;
};

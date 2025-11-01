"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from ".";

export const currentUser = async () => {
	const data = await auth.api.getSession({
		headers: await headers(),
	});

	return {
		user: data?.user,
		session: data?.session,
	};
};

export const requiredCurrentUser = async () => {
	const session = await currentUser();

	if (!session?.user) {
		return redirect("/signin");
	}

	return session;
};

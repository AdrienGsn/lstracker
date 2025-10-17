"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from ".";

export const currentUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return {
		user: session?.user,
		session: session?.session,
	};
};

export const requiredCurrentUser = async () => {
	const data = await currentUser();

	if (!data.user) {
		return redirect("/signin");
	}

	return data;
};

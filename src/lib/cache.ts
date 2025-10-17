import { cache } from "react";

import { currentUser, requiredCurrentUser } from "@/lib/auth/helper";

export const currentUserCache = cache(currentUser);

export const requiredCurrentUserCache = cache(requiredCurrentUser);

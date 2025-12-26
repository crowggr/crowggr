import { auth } from "@better-blog/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { authMiddleware } from "@/middleware/auth";

export const getUserOrgs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.session) {
      return [];
    }

    try {
      const orgs = await auth.api.listOrganizations({
        headers: getRequestHeaders(),
      });

      return orgs || [];
    } catch {
      return [];
    }
  });

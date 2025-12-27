import { db } from "@better-blog/db";
import { member, site } from "@better-blog/db/schema/auth";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { authMiddleware } from "@/middleware/auth";

const GetOrgSitesSchema = z.object({
  organizationId: z.string().min(1),
});

export const getOrgSites = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator((data: z.infer<typeof GetOrgSitesSchema>) =>
    GetOrgSitesSchema.parse(data)
  )
  .handler(async ({ context, data }) => {
    if (!context.session) {
      return [];
    }

    // Verify user is a member of this organization
    const membership = await db
      .select()
      .from(member)
      .where(
        and(
          eq(member.userId, context.session.user.id),
          eq(member.organizationId, data.organizationId)
        )
      )
      .limit(1);

    if (membership.length === 0) {
      return [];
    }

    const sites = await db
      .select()
      .from(site)
      .where(eq(site.organizationId, data.organizationId));

    return sites;
  });

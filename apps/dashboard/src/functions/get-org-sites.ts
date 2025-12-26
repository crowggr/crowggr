import { db } from "@better-blog/db";
import { site } from "@better-blog/db/schema/auth";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
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

    const sites = await db
      .select()
      .from(site)
      .where(eq(site.organizationId, data.organizationId));

    return sites;
  });

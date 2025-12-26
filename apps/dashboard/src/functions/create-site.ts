import { auth } from "@better-blog/auth";
import { db } from "@better-blog/db";
import { site } from "@better-blog/db/schema/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { nanoid } from "nanoid";
import { z } from "zod";

import { authMiddleware } from "@/middleware/auth";

const CreateSiteSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(1).max(100),
  url: z.string().url(),
});

export const createSite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: z.infer<typeof CreateSiteSchema>) =>
    CreateSiteSchema.parse(data)
  )
  .handler(async ({ context, data }) => {
    if (!context.session) {
      throw new Error("Unauthorized");
    }

    // Verify user is a member of the organization
    const membership = await auth.api.getFullOrganization({
      headers: getRequestHeaders(),
      query: { organizationId: data.organizationId },
    });

    if (!membership) {
      throw new Error("Not a member of this organization");
    }

    const [newSite] = await db
      .insert(site)
      .values({
        id: nanoid(),
        organizationId: data.organizationId,
        name: data.name,
        url: data.url,
      })
      .returning();

    return newSite;
  });

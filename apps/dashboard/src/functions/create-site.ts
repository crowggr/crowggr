import { db } from "@better-blog/db";
import { site } from "@better-blog/db/schema/auth";
import { createServerFn } from "@tanstack/react-start";
import { nanoid } from "nanoid";

interface CreateSiteInput {
  organizationId: string;
  name: string;
  url: string;
}

export const createSite = createServerFn({ method: "POST" })
  .inputValidator((data: CreateSiteInput) => data)
  .handler(async ({ data }) => {
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

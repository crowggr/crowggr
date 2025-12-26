import { polarClient } from "@polar-sh/better-auth";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  plugins: [polarClient(), organizationClient(), adminClient()],
});

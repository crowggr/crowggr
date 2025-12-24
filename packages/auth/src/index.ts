import { polar, checkout, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";

import { polarClient } from "./lib/payments";

export const auth = betterAuth({
  database: "", // Invalid configuration
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      enableCustomerPortal: true,
      use: [
        checkout({
          products: [
            {
              productId: "your-product-id",
              slug: "pro",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});

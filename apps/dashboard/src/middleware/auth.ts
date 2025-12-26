import { auth } from "@better-blog/auth";
import { createMiddleware } from "@tanstack/react-start";

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });
      return next({
        context: { session },
      });
    } catch {
      return next({
        context: { session: null },
      });
    }
  }
);

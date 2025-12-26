import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { getPayment } from "@/functions/get-payment";
import { getUser } from "@/functions/get-user";
import { getUserOrgs } from "@/functions/get-user-orgs";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/")({
  component: DashboardPage,
  beforeLoad: async () => {
    const session = await getUser();
    if (!session) {
      throw redirect({ to: "/login" });
    }

    // Check if user has completed onboarding (has a team)
    const orgs = await getUserOrgs();
    if (!orgs || orgs.length === 0) {
      throw redirect({ to: "/onboarding" });
    }

    const customerState = await getPayment();
    return { session, customerState };
  },
});

function DashboardPage() {
  const { session, customerState } = Route.useRouteContext();

  const privateData = useQuery(orpc.privateData.queryOptions());

  const hasProSubscription =
    (customerState?.activeSubscriptions?.length ?? 0) > 0;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user.name}</p>
      <p>API: {privateData.data?.message}</p>
      <p>Plan: {hasProSubscription ? "Pro" : "Free"}</p>
      {hasProSubscription ? (
        <Button
          onClick={async function handlePortal() {
            await authClient.customer.portal();
          }}
        >
          Manage Subscription
        </Button>
      ) : (
        <Button
          onClick={async function handleUpgrade() {
            await authClient.checkout({ slug: "pro" });
          }}
        >
          Upgrade to Pro
        </Button>
      )}
    </div>
  );
}

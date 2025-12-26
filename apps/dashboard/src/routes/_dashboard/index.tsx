import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { getPayment } from "@/functions/get-payment";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_dashboard/")({
  component: DashboardPage,
  loader: async () => {
    const customerState = await getPayment();
    return { customerState };
  },
});

function DashboardPage() {
  const { session } = Route.useRouteContext();
  const { customerState } = Route.useLoaderData();

  const privateData = useQuery(orpc.privateData.queryOptions());

  const hasProSubscription =
    (customerState?.activeSubscriptions?.length ?? 0) > 0;

  return (
    <div className="p-4">
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

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getOrgSites } from "@/functions/get-org-sites";
import { getUser } from "@/functions/get-user";
import { getUserOrgs } from "@/functions/get-user-orgs";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayout,
  beforeLoad: async () => {
    const session = await getUser();
    if (!session) {
      throw redirect({ to: "/login" });
    }

    const orgs = await getUserOrgs();
    if (!orgs || orgs.length === 0) {
      throw redirect({ to: "/onboarding" });
    }

    // Fetch sites for the first org
    const sites = orgs[0]
      ? await getOrgSites({ data: { organizationId: orgs[0].id } })
      : [];

    return { session, orgs, sites };
  },
});

function DashboardLayout() {
  const { orgs, session, sites } = Route.useRouteContext();

  return (
    <SidebarProvider>
      <AppSidebar orgs={orgs} sites={sites} />
      <SidebarInset>
        <DashboardHeader user={session.user} />
        <main className="flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

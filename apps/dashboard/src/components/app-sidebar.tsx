"use client";

import type { Icon } from "@phosphor-icons/react";
import {
  ArrowSquareOut,
  CaretDown,
  ChartLine,
  CreditCard,
  Envelope,
  FileText,
  Gear,
  House,
  Image,
  Tag,
  Users,
} from "@phosphor-icons/react";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import * as React from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { getOrgSites } from "@/functions/get-org-sites";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

interface Site {
  id: string;
  organizationId: string;
  name: string;
  url: string;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  orgs: Organization[];
  sites: Site[];
}

interface NavItem {
  title: string;
  url?: string;
  icon: Icon;
  items?: { title: string; url: string }[];
  external?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const STORAGE_KEY_ORG = "crowggr-active-org";
const STORAGE_KEY_SITE = "crowggr-active-site";

const homeItem: NavItem = { title: "Home", url: "/", icon: House };

const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { title: "Analytics", url: "/analytics", icon: ChartLine },
      { title: "Subscribers", url: "/subscribers", icon: Envelope },
    ],
  },
  {
    label: "Content",
    items: [
      {
        title: "Posts",
        icon: FileText,
        items: [
          { title: "All Posts", url: "/posts" },
          { title: "New Post", url: "/posts/new" },
        ],
      },
      { title: "Media", url: "/media", icon: Image },
      { title: "Tags", url: "/tags", icon: Tag },
    ],
  },
  {
    label: "Workspace",
    items: [
      { title: "Team", url: "/team", icon: Users },
      {
        title: "Settings",
        icon: Gear,
        items: [
          { title: "Site Settings", url: "/settings" },
          { title: "API Keys", url: "/settings/api-keys" },
        ],
      },
      { title: "Billing", url: "/billing", icon: CreditCard },
    ],
  },
];

export function AppSidebar({ orgs, sites, ...props }: AppSidebarProps) {
  const router = useRouter();
  const location = useLocation();

  // Initialize from localStorage or fallback to first item
  const [activeOrg, setActiveOrg] = React.useState<Organization | undefined>(
    () => {
      if (typeof window === "undefined") return orgs[0];
      const savedId = localStorage.getItem(STORAGE_KEY_ORG);
      return orgs.find((o) => o.id === savedId) ?? orgs[0];
    }
  );

  const [currentSites, setCurrentSites] = React.useState<Site[]>(sites);
  const [activeSite, setActiveSite] = React.useState<Site | undefined>(() => {
    if (typeof window === "undefined") return sites[0];
    const savedId = localStorage.getItem(STORAGE_KEY_SITE);
    return sites.find((s) => s.id === savedId) ?? sites[0];
  });

  // Handle org change - fetch new sites
  const handleOrgChange = React.useCallback(
    async (org: Organization) => {
      setActiveOrg(org);
      localStorage.setItem(STORAGE_KEY_ORG, org.id);

      // Fetch sites for the new org
      const newSites = await getOrgSites({ data: { organizationId: org.id } });
      setCurrentSites(newSites);

      // Reset active site to first of new org's sites
      const firstSite = newSites[0];
      setActiveSite(firstSite);
      if (firstSite) {
        localStorage.setItem(STORAGE_KEY_SITE, firstSite.id);
      } else {
        localStorage.removeItem(STORAGE_KEY_SITE);
      }

      // Invalidate router to refresh data
      router.invalidate();
    },
    [router]
  );

  // Handle site change
  const handleSiteChange = React.useCallback(
    (site: Site) => {
      setActiveSite(site);
      localStorage.setItem(STORAGE_KEY_SITE, site.id);
      router.invalidate();
    },
    [router]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-sidebar-border border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex h-10 items-center gap-3 px-2">
              <Logo color="purple" size={20} />
              <div className="flex-1 group-data-[collapsible=icon]:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        className="w-full justify-between border-none bg-transparent shadow-none"
                        variant="ghost"
                      >
                        {activeOrg?.name ?? "Select Team"}
                        <CaretDown
                          className="-me-1 size-4 opacity-60"
                          weight="bold"
                        />
                      </Button>
                    }
                  />
                  <DropdownMenuContent>
                    {orgs.map((org) => (
                      <DropdownMenuItem
                        key={org.id}
                        onClick={() => handleOrgChange(org)}
                      >
                        {org.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pt-2 pb-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={location.pathname === homeItem.url}
                render={<Link to={homeItem.url!} />}
              >
                <homeItem.icon className="size-4" />
                <span>{homeItem.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {navSections.map((section) => (
          <SidebarGroup className="py-1" key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) =>
                item.items ? (
                  <Collapsible className="group/collapsible" key={item.title}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger className="w-full">
                        <SidebarMenuButton>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          <CaretDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                isActive={location.pathname === subItem.url}
                                render={<Link to={subItem.url} />}
                              >
                                {subItem.title}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : item.external ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={
                        <a
                          href={item.url}
                          rel="noopener noreferrer"
                          target="_blank"
                        />
                      }
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={location.pathname === item.url}
                      render={<Link to={item.url!} />}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroup>
        ))}
        <SidebarGroup className="mt-auto px-2 pb-2 group-data-[collapsible=icon]:hidden">
          <div className="relative overflow-hidden rounded-lg bg-background">
            <img
              alt="Crow"
              className="h-24 w-full object-cover object-[center_30%] mix-blend-exclusion"
              src="/crow-image.png"
            />
            <div className="absolute inset-0 bg-background/50" />
            <div className="absolute top-3/4 left-2 -translate-y-1/2">
              <Logo className="h-6" color="purple" variant="wordmark" />
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <a
                  href="https://docs.better.blog"
                  rel="noopener noreferrer"
                  target="_blank"
                />
              }
            >
              <ArrowSquareOut className="size-4" />
              <span>Docs</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    className="w-full justify-between border-none bg-transparent shadow-none"
                    variant="ghost"
                  >
                    {activeSite?.name ?? "Select Site"}
                    <CaretDown
                      className="-me-1 size-4 opacity-60"
                      weight="bold"
                    />
                  </Button>
                }
              />
              <DropdownMenuContent align="start" side="top">
                {currentSites.length > 0 ? (
                  currentSites.map((site) => (
                    <DropdownMenuItem
                      key={site.id}
                      onClick={() => handleSiteChange(site)}
                    >
                      {site.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No sites yet</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

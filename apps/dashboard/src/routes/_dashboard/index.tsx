"use client";

import { Eye, Plus, Users } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame";

export const Route = createFileRoute("/_dashboard/")({
  component: HomePage,
});

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Placeholder data - will be wired up when posts table exists
const recentPosts = [
  {
    id: "1",
    title: "Getting Started with Better Blog",
    status: "published",
    views: 1243,
    date: "Dec 24",
  },
  {
    id: "2",
    title: "How to Write Great Content",
    status: "draft",
    views: 0,
    date: "Dec 23",
  },
  {
    id: "3",
    title: "SEO Tips for Bloggers",
    status: "published",
    views: 892,
    date: "Dec 22",
  },
  {
    id: "4",
    title: "Building Your Audience",
    status: "draft",
    views: 0,
    date: "Dec 20",
  },
  {
    id: "5",
    title: "Welcome to My Blog",
    status: "published",
    views: 2156,
    date: "Dec 18",
  },
];

function HomePage() {
  const { session, sites } = Route.useRouteContext();
  const activeSite = sites[0];

  // Placeholder stats - will be wired up when posts/subscribers tables exist
  const stats = {
    totalPosts: 12,
    views: 4291,
    subscribers: 128,
  };

  return (
    <div className="grid grid-cols-3 grid-rows-[1fr_1fr_auto] gap-4 p-6">
      {/* Row 1: Greeting (2 cols) | What's New (spans 2 rows) */}
      <div className="col-span-2 flex flex-col justify-center gap-4">
        <div>
          <h1 className="font-semibold text-4xl">
            {getGreeting()}, {session?.user.name?.split(" ")[0] ?? "there"}
          </h1>
          {activeSite && (
            <p className="text-muted-foreground">{activeSite.name}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button render={<Link to="/posts/new" />}>
            <Plus className="size-4" />
            New Post
          </Button>
          <Button render={<Link to="/posts" />} variant="outline">
            View Posts
          </Button>
        </div>
      </div>

      <Frame className="row-span-2">
        <FrameHeader>
          <FrameTitle>What's New</FrameTitle>
        </FrameHeader>
        <FramePanel className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-sm">Dark Mode</p>
            <p className="text-muted-foreground text-xs">
              Toggle between light and dark themes.
            </p>
            <Button className="mt-1 h-7 px-2 text-xs" variant="outline">
              Read more
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-sm">Media Library</p>
            <p className="text-muted-foreground text-xs">
              Upload and manage images for your posts.
            </p>
            <Button className="mt-1 h-7 px-2 text-xs" variant="outline">
              Read more
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-sm">SEO Settings</p>
            <p className="text-muted-foreground text-xs">
              Optimize your posts for search engines.
            </p>
            <Button className="mt-1 h-7 px-2 text-xs" variant="outline">
              Read more
            </Button>
          </div>
        </FramePanel>
      </Frame>

      {/* Row 2: Views | Subscribers */}
      <Frame>
        <FrameHeader>
          <FrameTitle>Views</FrameTitle>
        </FrameHeader>
        <FramePanel className="flex flex-1 items-center justify-between">
          <div className="flex flex-1 flex-col justify-between self-stretch">
            <p className="font-semibold text-4xl">{stats.views}</p>
            <p className="text-green-600 text-sm">↑ 12% from last week</p>
          </div>
          <Eye className="size-12 text-muted-foreground" />
        </FramePanel>
      </Frame>

      <Frame>
        <FrameHeader>
          <FrameTitle>Subscribers</FrameTitle>
        </FrameHeader>
        <FramePanel className="flex flex-1 items-center justify-between">
          <div className="flex flex-1 flex-col justify-between self-stretch">
            <p className="font-semibold text-4xl">{stats.subscribers}</p>
            <p className="text-red-600 text-sm">↓ 3% from last week</p>
          </div>
          <Users className="size-12 text-muted-foreground" />
        </FramePanel>
      </Frame>

      {/* Row 3: Recent Posts */}
      <Frame className="col-span-3">
        <FrameHeader>
          <FrameTitle className="text-lg">Recent Posts</FrameTitle>
        </FrameHeader>
        <FramePanel className="p-0">
          <div className="divide-y">
            {recentPosts.map((post) => (
              <Link
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50"
                key={post.id}
                to="/posts"
              >
                <span className="font-medium">{post.title}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Eye className="size-4" />
                    {post.views.toLocaleString()}
                  </div>
                  <Badge
                    variant={
                      post.status === "published" ? "default" : "secondary"
                    }
                  >
                    {post.status}
                  </Badge>
                  <span className="w-14 text-muted-foreground text-sm">
                    {post.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </FramePanel>
      </Frame>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/posts/")({
  component: PostsPage,
});

function PostsPage() {
  return (
    <div className="p-6">
      <h1 className="font-semibold text-2xl">Posts</h1>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  );
}

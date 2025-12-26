"use client";

import { Toaster as SonnerToaster } from "sonner";

function Toaster(props: React.ComponentProps<typeof SonnerToaster>) {
  return <SonnerToaster theme="dark" {...props} />;
}

export { Toaster };

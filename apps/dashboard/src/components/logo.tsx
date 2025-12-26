"use client";

import { useTheme } from "@/components/theme-provider";

type LogoVariant = "logo" | "wordmark" | "wordmarkLogo";
type LogoColor = "black" | "purple" | "white" | "auto";

interface LogoProps {
  className?: string;
  size?: number;
  variant?: LogoVariant;
  color?: LogoColor;
}

const LOGO_PATHS: Record<
  LogoVariant,
  Record<Exclude<LogoColor, "auto">, string>
> = {
  logo: {
    black: "/branding/logo/black.png",
    purple: "/branding/logo/purple.png",
    white: "/branding/logo/white.png",
  },
  wordmark: {
    black: "/branding/wordmark/black.png",
    purple: "/branding/wordmark/purple.png",
    white: "/branding/wordmark/white.png",
  },
  wordmarkLogo: {
    black: "/branding/wordmarkLogo/black.png",
    purple: "/branding/wordmarkLogo/purple.png",
    white: "/branding/wordmarkLogo/white.png",
  },
};

export function Logo({
  className,
  size = 32,
  variant = "logo",
  color = "auto",
}: LogoProps) {
  const { resolvedTheme } = useTheme();

  let resolvedColor: Exclude<LogoColor, "auto">;
  if (color === "auto") {
    resolvedColor = resolvedTheme === "dark" ? "white" : "black";
  } else {
    resolvedColor = color;
  }

  const path = LOGO_PATHS[variant][resolvedColor];

  return (
    <img
      alt="Crowggr"
      className={className}
      height={size}
      src={path}
      width={variant === "logo" ? size : undefined}
    />
  );
}

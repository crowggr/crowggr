interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <img
      alt="Logo"
      className={className}
      height={size}
      src="/logo.png"
      width={size}
    />
  );
}

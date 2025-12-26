"use client";

import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useState } from "react";

import { Input, type InputProps } from "@/components/ui/input";

type PasswordInputProps = Omit<InputProps, "type" | "rightIcon">;

function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      rightIcon={
        <button
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          type="button"
        >
          {showPassword ? (
            <EyeSlash className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      }
      type={showPassword ? "text" : "password"}
    />
  );
}

export { PasswordInput };

"use client";

import { Envelope, Lock, User } from "@phosphor-icons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Account created successfully");
        navigate({ to: "/" });
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        navigate({ to: "/" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOAuthSignIn(provider: "github" | "google") {
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-4xl flex-col gap-6">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-4 text-center">
                  <Logo size={48} />
                  <div>
                    <h1 className="font-bold text-2xl">
                      {isSignUp ? "Create an account" : "Welcome back"}
                    </h1>
                    <p className="text-balance text-muted-foreground">
                      {isSignUp
                        ? "Enter your details to get started"
                        : "Login to your account"}
                    </p>
                  </div>
                </div>
                {isSignUp && (
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      icon={<User className="size-4" />}
                      id="name"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      type="text"
                      value={name}
                    />
                  </Field>
                )}
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    icon={<Envelope className="size-4" />}
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    icon={<Lock className="size-4" />}
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    type="password"
                    value={password}
                  />
                </Field>
                <Field>
                  <Button className="w-full" disabled={isLoading} type="submit">
                    {isLoading
                      ? "Loading..."
                      : isSignUp
                        ? "Create account"
                        : "Login"}
                  </Button>
                  {!isSignUp && (
                    <a
                      className="mt-4 -mb-1 block w-full text-center text-muted-foreground text-sm underline-offset-2 hover:underline"
                      href="#"
                    >
                      Forgot your password?
                    </a>
                  )}
                </Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleOAuthSignIn("github")}
                    type="button"
                    variant="outline"
                  >
                    <svg
                      className="size-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </Button>
                  <Button
                    onClick={() => handleOAuthSignIn("google")}
                    type="button"
                    variant="outline"
                  >
                    <svg
                      className="size-4"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                </Field>
                <p className="text-center text-muted-foreground text-xs">
                  {isSignUp ? (
                    <>
                      Already have an account?{" "}
                      <button
                        className="underline underline-offset-2"
                        onClick={() => setIsSignUp(false)}
                        type="button"
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        className="underline underline-offset-2"
                        onClick={() => setIsSignUp(true)}
                        type="button"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </p>
              </FieldGroup>
            </form>
            <div className="relative hidden bg-background md:block">
              <img
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
                src="/crow-image.png"
              />
              <div className="absolute inset-0 bg-background/50" />
            </div>
          </CardContent>
        </Card>
        <p className="px-6 text-center text-muted-foreground text-xs">
          By clicking continue, you agree to our{" "}
          <a className="underline underline-offset-2" href="#">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="underline underline-offset-2" href="#">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

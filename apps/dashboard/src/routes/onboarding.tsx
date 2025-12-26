"use client";

import { Buildings, Globe, TextT } from "@phosphor-icons/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createSite } from "@/functions/create-site";
import { getUser } from "@/functions/get-user";
import { getUserOrgs } from "@/functions/get-user-orgs";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: async () => {
    const session = await getUser();
    if (!session) {
      throw redirect({ to: "/login" });
    }

    // Check if user already has a team
    const orgs = await getUserOrgs();
    if (orgs && orgs.length > 0) {
      throw redirect({ to: "/" });
    }
  },
  component: OnboardingPage,
});

interface FormErrors {
  teamName?: string;
  siteName?: string;
  siteUrl?: string;
}

function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Step 1: Team
  const [teamName, setTeamName] = useState("");

  // Step 2: Site
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");

  // Store created team ID for step 2
  const [teamId, setTeamId] = useState("");

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function validateStep1(): boolean {
    const newErrors: FormErrors = {};
    if (!teamName.trim()) {
      newErrors.teamName = "Team name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep2(): boolean {
    const newErrors: FormErrors = {};
    if (!siteName.trim()) {
      newErrors.siteName = "Site name is required";
    }
    if (!siteUrl.trim()) {
      newErrors.siteUrl = "Website URL is required";
    } else if (!/^https?:\/\/.+\..+/.test(siteUrl)) {
      newErrors.siteUrl = "Please enter a valid URL";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();

    if (!validateStep1()) {
      return;
    }

    setIsLoading(true);

    try {
      const slug = generateSlug(teamName);
      const { data, error } = await authClient.organization.create({
        name: teamName,
        slug,
      });

      if (error) {
        setErrors({
          teamName: error.message || "Failed to create team",
        });
        return;
      }

      if (data) {
        setTeamId(data.id);
        setStep(2);
        toast.success("Team created!");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateSite(e: React.FormEvent) {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);

    try {
      await createSite({
        data: {
          organizationId: teamId,
          name: siteName,
          url: siteUrl,
        },
      });

      toast.success("Site created! Redirecting to dashboard...");
      window.location.href = "/";
    } catch {
      setErrors({ siteUrl: "Failed to create site" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Card className="overflow-hidden p-0">
          <CardContent className="p-6 md:p-8">
            <form
              noValidate
              onSubmit={step === 1 ? handleCreateTeam : handleCreateSite}
            >
              <FieldGroup>
                <div className="flex flex-col items-center gap-4 text-center">
                  <Logo size={48} />
                  <div>
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <span
                        className={`flex size-6 items-center justify-center rounded-full text-xs ${
                          step >= 1
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        1
                      </span>
                      <div className="h-px w-8 bg-muted" />
                      <span
                        className={`flex size-6 items-center justify-center rounded-full text-xs ${
                          step >= 2
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        2
                      </span>
                    </div>
                    <h1 className="font-bold text-2xl">
                      {step === 1 ? "Create your Team" : "Add your website"}
                    </h1>
                    <p className="text-balance text-muted-foreground">
                      {step === 1
                        ? "Give your team a name"
                        : "Where will your blog be displayed?"}
                    </p>
                  </div>
                </div>

                {step === 1 ? (
                  <Field>
                    <FieldLabel htmlFor="teamName">Team name</FieldLabel>
                    <Input
                      icon={<Buildings className="size-4" />}
                      id="teamName"
                      onChange={(e) => {
                        setTeamName(e.target.value);
                        if (errors.teamName)
                          setErrors((prev) => ({
                            ...prev,
                            teamName: undefined,
                          }));
                      }}
                      placeholder="Better Blog"
                      type="text"
                      value={teamName}
                    />
                    {errors.teamName ? (
                      <p className="text-destructive text-sm">
                        {errors.teamName}
                      </p>
                    ) : teamName ? (
                      <p className="text-muted-foreground text-xs">
                        Slug: {generateSlug(teamName)}
                      </p>
                    ) : null}
                  </Field>
                ) : (
                  <>
                    <Field>
                      <FieldLabel htmlFor="siteName">Site name</FieldLabel>
                      <Input
                        icon={<TextT className="size-4" />}
                        id="siteName"
                        onChange={(e) => {
                          setSiteName(e.target.value);
                          if (errors.siteName)
                            setErrors((prev) => ({
                              ...prev,
                              siteName: undefined,
                            }));
                        }}
                        placeholder="My Blog"
                        type="text"
                        value={siteName}
                      />
                      {errors.siteName && (
                        <p className="text-destructive text-sm">
                          {errors.siteName}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="siteUrl">Website URL</FieldLabel>
                      <Input
                        icon={<Globe className="size-4" />}
                        id="siteUrl"
                        onChange={(e) => {
                          setSiteUrl(e.target.value);
                          if (errors.siteUrl)
                            setErrors((prev) => ({
                              ...prev,
                              siteUrl: undefined,
                            }));
                        }}
                        placeholder="https://example.com"
                        type="url"
                        value={siteUrl}
                      />
                      {errors.siteUrl && (
                        <p className="text-destructive text-sm">
                          {errors.siteUrl}
                        </p>
                      )}
                    </Field>
                  </>
                )}

                <Field>
                  <Button className="w-full" disabled={isLoading} type="submit">
                    {isLoading
                      ? "Loading..."
                      : step === 1
                        ? "Continue"
                        : "Complete setup"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

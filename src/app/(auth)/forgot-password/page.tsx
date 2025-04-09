"use client";

import React from "react";
import { Button, Input, Link, Form, Alert } from "@heroui/react";
import { Icon } from "@iconify/react";
import { createClientSupabaseClient } from "@/lib/auth/supabase-client";

export default function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const supabase = createClientSupabaseClient();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 p-2 sm:p-4 lg:p-8">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-large">
        <div className="flex items-center gap-2">
          <Button
            as={Link}
            className="w-fit p-0"
            href="/login"
            startContent={<Icon icon="lucide:arrow-left" width={16} />}
            variant="light"
          >
            Back to Login
          </Button>
        </div>
        <p className="pb-2 text-xl font-medium">Reset Password</p>
        {error && (
          <Alert className="mb-2" color="danger">
            {error}
          </Alert>
        )}
        {success ? (
          <Alert className="mb-2" color="success">
            Reset link sent! Check your email for further instructions.
          </Alert>
        ) : (
          <Form
            className="flex flex-col gap-3"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              description="We'll send a password reset link to this email"
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              value={email}
              variant="bordered"
              onValueChange={setEmail}
            />
            <Button
              className="w-full"
              color="primary"
              isLoading={isLoading}
              spinner={
                <Icon
                  className="animate-spin"
                  icon="lucide:loader-2"
                  width={24}
                />
              }
              type="submit"
            >
              Send Reset Link
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { Button, Input, Form, Alert } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";

import { createClientSupabaseClient } from "@/lib/auth/supabase-client";

export default function ResetPassword() {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientSupabaseClient();

  // Check if we have the necessary parameters from the reset email
  useEffect(() => {
    if (!searchParams?.get("code")) {
      setError("Invalid password reset link. Please request a new one.");
    }
  }, [searchParams]);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");

      return;
    }

    setIsLoading(true);

    try {
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      // Sign out the user to invalidate all sessions
      await supabase.auth.signOut();

      setSuccess(true);

      // Redirect to login page after a few seconds
      setTimeout(() => {
        router.push("/login?message=password_reset_success");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 p-2 sm:p-4 lg:p-8">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-large">
        <p className="pb-2 text-xl font-medium">Set New Password</p>
        {error && (
          <Alert className="mb-2" color="danger">
            {error}
          </Alert>
        )}
        {success ? (
          <Alert className="mb-2" color="success">
            Password reset successful! You will be redirected to the login page
            to sign in with your new password.
          </Alert>
        ) : (
          <Form
            className="flex flex-col gap-3"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              endContent={
                <Button
                  isIconOnly
                  type="button"
                  variant="light"
                  onPress={toggleVisibility}
                >
                  {isVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="lucide:eye-off"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="lucide:eye"
                    />
                  )}
                </Button>
              }
              label="New Password"
              name="password"
              placeholder="Enter new password"
              type={isVisible ? "text" : "password"}
              value={password}
              variant="bordered"
              onValueChange={setPassword}
            />
            <Input
              isRequired
              endContent={
                <Button
                  isIconOnly
                  type="button"
                  variant="light"
                  onPress={toggleConfirmVisibility}
                >
                  {isConfirmVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="lucide:eye-off"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="lucide:eye"
                    />
                  )}
                </Button>
              }
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm new password"
              type={isConfirmVisible ? "text" : "password"}
              value={confirmPassword}
              variant="bordered"
              onValueChange={setConfirmPassword}
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
              Reset Password
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}

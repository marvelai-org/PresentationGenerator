'use client';

import React, { useState } from 'react';
import { Button, Input, Checkbox, Link, Divider, Alert } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { createClientSupabaseClient } from '@/lib/auth/supabase-client';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Destructure but don't use it directly, to avoid the unused variable warning
  const _auth = useAuth();
  const searchParams = useSearchParams();
  const supabase = createClientSupabaseClient();

  // Check for message query parameter
  React.useEffect(() => {
    const message = searchParams?.get('message');

    if (message === 'password_reset_success') {
      setSuccess('Password has been reset successfully. Please log in with your new password.');
    } else if (message === 'callback_failed') {
      setError('Authentication failed. Please try again.');
    } else if (message === 'missing_code') {
      setError('Missing authentication code. Please try again.');
    }
  }, [searchParams]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 p-2 sm:p-4 lg:p-8">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-large">
        <div className="flex flex-col">
          <p className="pb-2 text-xl font-medium">Login</p>
          <p className="text-sm">Log in to your account</p>
        </div>
        {error && (
          <Alert className="mb-2" color="danger">
            {error}
          </Alert>
        )}
        {success && (
          <Alert className="mb-2" color="success">
            {success}
          </Alert>
        )}
        <form className="flex flex-col gap-3" onSubmit={handleLogin}>
          <Input
            isRequired
            label="Email"
            name="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            variant="bordered"
            onValueChange={setEmail}
          />
          <Input
            isRequired
            label="Password"
            name="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            variant="bordered"
            onValueChange={setPassword}
          />
          <div className="flex items-center justify-between">
            <Checkbox isSelected={rememberMe} onValueChange={setRememberMe}>
              Remember me
            </Checkbox>
            <Link className="cursor-pointer text-primary" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <Button
            className="w-full"
            color="primary"
            isLoading={isLoading}
            spinner={<Icon className="animate-spin" icon="lucide:loader-2" width={24} />}
            type="submit"
          >
            Login
          </Button>
        </form>
        <Divider className="my-2" />
        <div className="flex justify-center gap-2">
          <span className="text-sm text-default-500">Don't have an account?</span>
          <Link className="cursor-pointer text-primary text-sm" href="/signup">
            Sign up
          </Link>
        </div>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
            onPress={() => handleSocialLogin('google')}
          >
            Continue with Google
          </Button>
          <Button
            startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
            variant="bordered"
            onPress={() => handleSocialLogin('github')}
          >
            Continue with Github
          </Button>
        </div>
      </div>
    </div>
  );
}

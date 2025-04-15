'use client';

import React from 'react';
import { Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

export default function ConfirmationPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 p-2 sm:p-4 lg:p-8">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-large bg-content1 px-8 py-10 text-center shadow-small">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
          <Icon className="text-success" height={40} icon="heroui:mail" width={40} />
        </div>

        <h1 className="text-2xl font-bold">Check Your Email</h1>

        <p className="text-default-600">
          We&apos;ve sent a verification link to your email address. Please check your inbox and
          click the link to verify your account.
        </p>

        <div className="mt-4 rounded-md bg-warning-50 p-4 text-left">
          <div className="flex items-start">
            <Icon className="mr-3 mt-0.5 text-warning" icon="heroui:info-circle" width={18} />
            <div>
              <p className="font-medium text-warning-700">Important</p>
              <p className="mt-1 text-sm text-warning-600">
                If you don&apos;t see the email, please check your spam folder. The email should
                arrive within a few minutes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <Button
            className="w-full"
            color="primary"
            variant="flat"
            onPress={() => router.push('/login')}
          >
            Go to Login
          </Button>

          <Link className="text-sm text-default-500" href="/signup">
            Didn&apos;t receive an email? Try signing up again
          </Link>
        </div>
      </div>
    </div>
  );
}

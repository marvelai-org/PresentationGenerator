"use client";

import React from "react";

import LeanPromptInput from "./LeanPromptInput";

export default function Component() {
  return (
    <div className="flex h-screen max-h-[calc(100vh-140px)] w-full">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-2xl flex-col items-center gap-8">
          <h1 className="text-3xl font-semibold leading-9 text-default-foreground">
            What would you like to build today?
          </h1>
          <div className="flex w-full flex-col gap-4">
            <LeanPromptInput />
          </div>
        </div>
      </div>
    </div>
  );
}
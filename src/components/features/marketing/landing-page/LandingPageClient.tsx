"use client";

import React from "react";

import LeanNavbar from "./LeanNavbar";
import LeanPromptContainer from "./LeanPromptContainer";

export default function LandingPageClient() {
  return (
    <main className="flex min-h-screen flex-col">
      <LeanNavbar />

      <div className="flex flex-1 items-center justify-center py-8">
        <div className="w-full max-w-2xl px-4">
          <LeanPromptContainer />
        </div>
      </div>
    </main>
  );
}

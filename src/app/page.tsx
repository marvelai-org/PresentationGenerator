"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import LeanNavbar from "@/components/features/marketing/landing-page/LeanNavbar"; 
import LeanPromptContainer from "@/components/features/marketing/landing-page/LeanPromptContainer";

// Find and edit this file to change the suggestions content
// Look in: /components/features/ai/prompt-containers/variants/PromptContainerFullLineBottomActionsLarge/App.tsx
// Or create a custom version of it in your project

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <LeanNavbar />
      
      <div className="flex flex-1 items-center justify-center py-8">
        <div className="w-full max-w-2xl px-4">
          {/* Removed Avatar and title heading */}
          
          {/* Only using the PromptContainer component */}
            <LeanPromptContainer />
        </div>
      </div>
    </main>
  );
}

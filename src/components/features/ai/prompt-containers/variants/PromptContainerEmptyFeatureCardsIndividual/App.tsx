"use client";

import React from "react";

import FeaturesCardsIndividual from "@/components/features/ai/feature-card/FeaturesCardsIndividual/App";
import PromptInputFullLine from "@/components/features/ai/prompt-inputs/variants/FullLine";

export default function Component() {
  return (
    <div className="flex h-dvh w-full max-w-full flex-col gap-8">
      <div className="flex h-full flex-col justify-center gap-10">
        <div className="flex w-full flex-col justify-start gap-2">
          <h1 className="text-3xl font-semibold leading-9 text-foreground-400">John,</h1>
          <h1 className="text-3xl font-semibold leading-9 text-default-foreground">
            How can I help you today?
          </h1>
        </div>
        <FeaturesCardsIndividual />
      </div>
      <div className="flex flex-col gap-2">
        <PromptInputFullLine />
        <p className="px-2 text-center text-tiny text-foreground-400">
          Acme AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
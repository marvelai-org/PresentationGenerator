import React from "react";

import { assistantMessages } from "../../data/messages";
import MessageCard from "../../components/MessageCard";

export default function Component() {
  return (
    <MessageCard
      showFeedback
      attempts={3}
      avatar="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatar_ai.png"
      currentAttempt={2}
      message={assistantMessages[1]}
    />
  );
}

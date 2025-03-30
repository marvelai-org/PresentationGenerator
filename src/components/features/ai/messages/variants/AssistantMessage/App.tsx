import React from "react";

import {assistantMessages} from "../../data/messages";

import MessageCard from "../../components/MessageCard";

export default function Component() {
  return (
    <MessageCard
      showFeedback
      avatar="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatar_ai.png"
      message={assistantMessages[0]}
    />
  );
}
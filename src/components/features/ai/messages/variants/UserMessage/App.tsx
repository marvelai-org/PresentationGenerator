import React from "react";

import { userMessages } from "../../data/messages";
import MessageCard from "../../components/MessageCard";

export default function Component() {
  return (
    <MessageCard
      avatar="https://d2u8k2ocievbld.cloudfront.net/memojis/male/6.png"
      message={userMessages[0]}
    />
  );
}

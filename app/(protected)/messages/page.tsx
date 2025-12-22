import React from "react";
import SubHeader from "@/app/components/global/SubHeader";
import getCurrentUser from "@/app/utils/getCurrentUser";
import MessagesInbox from "@/app/components/message/MessagesInbox";

export default async function MessagesInboxPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen bg-background font-sans text-text-main flex flex-col overflow-hidden">
      <SubHeader user={user} />
      <MessagesInbox user={user} />
    </div>
  );
}

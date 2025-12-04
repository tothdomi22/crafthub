import React from "react";
import SubHeader from "@/app/components/global/SubHeader";
import getCurrentUser from "@/app/utils/getCurrentUser";
import MessagesInbox from "@/app/components/message/MessagesInbox";

export default async function MessagesInboxPage() {
  const userId = await getCurrentUser();

  return (
    <div className="h-screen bg-[#F8F9FE] font-sans text-slate-800 flex flex-col overflow-hidden">
      <SubHeader />
      <MessagesInbox userId={userId} />
    </div>
  );
}

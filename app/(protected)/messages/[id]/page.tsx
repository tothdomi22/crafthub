import React from "react";
import SubHeader from "@/app/components/global/SubHeader";
import getCurrentUser from "@/app/utils/getCurrentUser";
import ChatRoom from "@/app/components/message/ChatRoom";

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const userId = await getCurrentUser();

  if (!userId) {
    return null;
  }

  return (
    <div className="h-screen bg-[#F8F9FE] font-sans text-slate-800 flex flex-col overflow-hidden">
      <SubHeader />
      <ChatRoom messageId={id} userId={userId} />
    </div>
  );
}

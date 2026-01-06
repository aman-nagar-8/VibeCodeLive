import React from "react";
import type { Metadata } from "next";
import Controles from "@/components/Member/Controles";
import Navigation from "@/components/Member/Navigation";
import Base from "@/components/Member/Base";
import Profile_info_section from "@/components/Member/Profile_info_section";
import Admin_info_section from "@/components/Member/Admin_info_section";

export const metadata: Metadata = {
  title: "Meeting",
  description: "Layout for meeting member pages",
};

export default async function Layout({
  params,
  left,
  right,
}: {
  params: { id: string };
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  const { id } = await params;
  const meetingId = id;

  return (
    <div className="w-screen h-screen flex flex-col p-2 bg-[#0f0f0f] overflow-hidden">
      <div className="w-full h-10 flex justify-between ">
        <Admin_info_section />
        <Navigation />
        <Profile_info_section />
      </div>
      <div className="flex-1 overflow-hidden">
        <Base left={left} right={right} meetingId={meetingId} />
      </div>
      <div className="fixed bottom-3 right-2 rounded-lg border-[0.5px]  border-zinc-600 flex">
        <Controles />
      </div>
    </div>
  );
}

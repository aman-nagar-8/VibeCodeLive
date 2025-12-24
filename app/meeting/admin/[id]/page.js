"use client"
// import { div } from "framer-motion/client";
import SimpleCode from "@/components/admin/SimpleCode.js";

// export default async function MeetingPage({ params, searchParams }) {
//   const meetingId =  params.meeting;
//   const token = searchParams.token;
//   console.log("meetingId:", meetingId, "token:", token);

//   return <div>Hello</div>
//   // return <MeetingClient meetingId={meetingId} token={token} />;
// }

import React from 'react'
import { useSearchParams } from 'next/navigation';
import { div } from "framer-motion/m";

const page = () => {
  const searchParams = useSearchParams();
  const meetingId = searchParams.get('meeting');
  const token = searchParams.get('token');
  return <SimpleCode meetingId={meetingId} token={token} />;
  // return <MeetingClient meetingId={meetingId} token={token} />;
}

export default page


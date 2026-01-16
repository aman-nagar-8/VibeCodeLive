"use client"
import { div } from "framer-motion/client";
import { useSelector } from "react-redux";

const members = () => {
  const participants = useSelector(
  (state) => state.meeting.participants
);
console.log("participants : " , participants)
  return (
    <div className="h-full w-full bg-[#262626] rounded-b-lg border-x-[0.5px] border-b-[0.5px] border-zinc-600">
      {participants.map((member, index)=>(
        <div key={index} className="text-red-500 p-2 " >{member.username}</div>
      ))}
    </div>
  )
}

export default members

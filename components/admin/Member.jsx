"use client";
import { div } from "framer-motion/client";
import { useSelector } from "react-redux";
import UserCard from "./UserCard";
import { RiSearchLine } from "react-icons/ri";

const members = () => {
  //  const participants = useSelector(
  //   (state) => state.meeting.participants
  // );
  const participants = useSelector(
    (state) => state.meeting.participants.allIds,
  );
  console.log("Participants in Members Component:", participants);
  return (
    <div className="h-full w-full  gap-2 p-2 bg-[#262626] rounded-b-lg border-x-[0.5px] border-b-[0.5px] border-zinc-600  overflow-scroll">
      {/* Search Bar */}
      <div className="w-full mb-3 h-11 bg-[#333333] rounded-lg flex items-center px-3 gap-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#5C766D]">
        <RiSearchLine className="text-gray-300 text-lg" />

        <input
          type="text"
          placeholder="Search members..."
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-400"
        />
      </div>
      <div className="h-full w-full flex flex-wrap gap-2 content-start">
        {participants.map((id , index) => (
           <UserCard key={index} userId={id} />
        ))}
      </div>
    </div>
  );
};

export default members;

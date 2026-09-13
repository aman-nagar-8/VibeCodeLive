// "use client";
// import { div } from "framer-motion/client";
// import React from "react";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { RiArrowDownWideLine } from "react-icons/ri";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const UserCard = ({ status }) => {
//   const username = "Aman Nagar";
//   const rollNumber = "0832CS";
//   const statusColors = {
//     success: " via-green-300  to-green-800 ",
//     error: " via-red-300   to-red-800",
//     pending: "via-yellow-300   to-yellow-800",
//     idle: "via-[#C08552]  to-[#8C5A3C]", // Your default project color
//   };

//   function handleCardClick() {
//     setDetailSection((prev) => !prev);
//   }

//   const [detailSection, setDetailSection] = useState(false);
//   return (
//     <div className="w-full flex-1 min-w-60">
//       <div
//         className={`w-full h-10 rounded-t-lg flex items-center px-1 justify-between bg-linear-to-r from-user-card from-20% ${statusColors[status] || statusColors.idle} `}
//       >
//         <div className="h-8 flex gap-2">
//           <div className="h-8 w-8 bg-[#99aaa4] rounded-md"></div>
//           <div className="h-8 gap-2">
//             <div className="text-black font-semibold text-sm">{username}</div>
//             <div className="text-black text-xs">{rollNumber}</div>
//           </div>
//         </div>
//         <div className="flex gap-3 items-center">
//           <div className="font-bold text-lg">{"82%"}</div>
//           <div className="flex items-center flex-col">
//             <div className="text-xs">{"Active"}</div>
//           </div>
//           <BsThreeDotsVertical className="text-white" />
//         </div>
//       </div>
//       <div className="w-full bg-[#5C766D] rounded-b-md">
//         <div
//           onClick={handleCardClick}
//           className=" w-full flex justify-center items-center cursor-pointer"
//         >
//           <RiArrowDownWideLine
//             className={`${detailSection ? " rotate-180 " : ""}`}
//           />
//         </div>
//         <AnimatePresence>
//           {detailSection && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: 80, opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{
//                 height: { duration: 0.2, ease: "easeIn" },
//                 opacity: { duration: 0.15 },
//               }}
//               className="w-full overflow-hidden bg-[#5C766D] rounded-b-md flex flex-col p-2 gap-1 text-xs text-white "
//             >
//               <div>Last active : 10 mins ago</div>
//               <div>Code status : Compiling</div>
//               <div>Current task : Solving question 3</div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default UserCard;

"use client";
import React, { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiArrowDownWideLine, RiCodeSSlashLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { store } from "@/store";
import {
  requestStudentCodeStart,
  receiveStudentCodeError,
} from "@/store/meetingSlice";
import { requestStudentCode } from "@/lib/socketService";

const UserCard = ({ userId }) => {
  const rollNumber = "0832CS";
 // This should ideally come from props or state

  const user = useSelector((state) => state.meeting.participants.byId[userId]);
  
  const meetingIdFromState = useSelector((state) => state.meeting.meetingId);
  const params = useParams();
  const meetingId = meetingIdFromState || params?.id;
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  const handleSeeCode = (e) => {
    e.stopPropagation();
    setMenuOpen(false);

    if (!user?.id || !meetingId) return;

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    dispatch(
      requestStudentCodeStart({
        studentId: user.id,
        studentName: user.username,
      })
    );

    requestStudentCode(meetingId, user.id, requestId);

    // 10-second timeout guard: do not leave the UI permanently loading
    setTimeout(() => {
      const currentLoading =
        store.getState()?.meeting?.studentCodeTabs?.loading?.[user.id];
      if (currentLoading) {
        dispatch(
          receiveStudentCodeError({
            studentId: user.id,
            error: "Student did not respond in time. Please try again.",
          })
        );
      }
    }, 10000);
  };

  if (!user) return null;

  const statusColors = {
    success: "from-[#333333] from-20%  via-green-500/20  to-green-500/35",
    error: "from-[#333333] from-20%  via-red-500/20  to-red-500/35",
    pending: "from-[#333333] from-20%  via-yellow-500/20  to-yellow-500/35",
    idle: "from-[#333333] from-20%  via-[#5C766D]/20  to-[#5C766D]/45",
  };

  const [detailSection, setDetailSection] = useState(false);

  function handleCardClick() {
    setDetailSection((prev) => !prev);
  }
  const snapshot = user.snapshot
  console.log("Snapshot for user", user, ":", snapshot);
  const status = snapshot?.status ||"pending";
  const contextArr = snapshot?.contextLines ? snapshot.contextLines.split("\n") : [];

  return (
    <div className="w-full flex-1 min-w-66">
      {/* 🔝 Header */}
      <div
        className={`w-full h-12 rounded-t-xl flex items-center px-3 justify-between 
        bg-linear-to-r from-[#005461] ${statusColors[status] || statusColors.idle} 
        borde border-whi backdrop-blur-sm relative`}
      >
        <div className="flex gap-3 items-center">
          <div className="h-9 w-9 bg-[#BFC6C4] rounded-lg"></div>

          <div className="flex flex-col leading-tight">
            <span className="text-white text-sm font-medium">
              {user.username}
            </span>
            <span className="text-gray-400 text-xs">{user.id}</span>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="text-white font-semibold text-sm">{snapshot?.score ?? 0}%</div>

          <div className="text-xs text-gray-200">Active</div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              aria-label="More options"
              className="p-1 rounded hover:bg-white/10 text-gray-200 hover:text-white transition flex items-center justify-center"
            >
              <BsThreeDotsVertical />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-[#1e1e1e] border border-zinc-700/80 rounded-lg shadow-2xl py-1 z-50 overflow-hidden">
                <button
                  type="button"
                  onClick={handleSeeCode}
                  className="w-full px-3 py-2 text-left text-xs text-zinc-200 hover:bg-[#333333] hover:text-white flex items-center gap-2 transition cursor-pointer"
                >
                  <RiCodeSSlashLine className="text-emerald-400 text-sm" />
                  <span>See Code</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔽 Body */}
      <div
        className={`w-full bg-linear-to-r from-[#005461] ${statusColors[status] || statusColors.idle} rounded-b-xl  border-b border-white/10`}
      >
        {/* Toggle */}
        <div
          onClick={handleCardClick}
          className="w-full flex justify-center items-center cursor-pointer py-1"
        >
          <RiArrowDownWideLine
            className={`text-gray-400 transition-transform duration-300  ${
              detailSection ? "rotate-180 text-white" : ""
            }`}
          />
        </div>

        {/* Expandable Section */}
        <AnimatePresence>
          {detailSection && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.2, ease: "easeIn" },
                opacity: { duration: 0.15 },
              }}
              className="w-full overflow-hidden flex flex-col px-3 pb-3 gap-1 text-xs text-gray-300"
            >
              {snapshot ? (
                <div className="text-xs space-y-1">
                  <div className="text-green-400">
                    {/* Last Active: {formatTime(snapshot.report.timestamp)} */}
                  </div>


                  {/* 💻 Code Preview */}
                  <div className=" rounded text-[10px] max-h-30 overflow-auto mt-2 flex gap-2 flex-wrap ">
                    {contextArr.length > 0 ? ( contextArr.map((text , i)=>(
                      <div className="bg-black/40 p-1  rounded text-[10px]" key={i}>{text}</div>
                    ))):"No code activity yet..."}
                  </div>

                  {/* 🧾 Output */}
                  <div className="bg-[#2a2a2a] p-2 rounded text-[10px] mt-1">
                    01. {snapshot.summary.whatStudentDid || "..."}<br />
                    02. {snapshot.summary.struggling || "..."}<br />
                    03. {snapshot.summary.doingWell || "..."}<br />
                    04. {snapshot.summary.suspiciousBehavior || "..."}<br />
                    05. {snapshot.summary.adviceForTeacher || "..."}<br />
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-xs">No activity yet...</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserCard;

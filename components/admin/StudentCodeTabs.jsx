"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RiCodeSSlashLine, RiCloseLine } from "react-icons/ri";
import { FaUserGraduate } from "react-icons/fa";
import {
  setActiveStudentTab,
  closeStudentTab,
} from "@/store/meetingSlice";

export default function StudentCodeTabs() {
  const dispatch = useDispatch();
  const openTabs = useSelector(
    (state) => state.meeting.studentCodeTabs?.openTabs || []
  );
  const activeTab = useSelector(
    (state) => state.meeting.studentCodeTabs?.activeTab
  );
  const participants = useSelector(
    (state) => state.meeting.participants?.byId || {}
  );
  const snapshots = useSelector(
    (state) => state.meeting.studentCodeTabs?.snapshots || {}
  );
  const loading = useSelector(
    (state) => state.meeting.studentCodeTabs?.loading || {}
  );
  const errors = useSelector(
    (state) => state.meeting.studentCodeTabs?.errors || {}
  );

  const isHostActive = activeTab === "host" || (openTabs.length === 0 && !activeTab);

  return (
    <div className="w-full h-full flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 px-1">
      {/* 🔹 Host Code Tab (Teacher's own scratchpad editor) */}
      <button
        type="button"
        onClick={() => dispatch(setActiveStudentTab("host"))}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md text-xs font-medium transition shrink-0 cursor-pointer h-full border-b-2 ${
          isHostActive
            ? "bg-[#262626] text-white border-emerald-400"
            : "bg-[#2b2b2b] text-zinc-400 hover:text-zinc-200 hover:bg-[#333333] border-transparent"
        }`}
      >
        <RiCodeSSlashLine className={isHostActive ? "text-emerald-400" : "text-zinc-400"} />
        <span>Host Editor</span>
      </button>

      {/* 🔹 Student Tabs (Max 5, FIFO order) */}
      {openTabs.map((studentId) => {
        const studentName =
          snapshots[studentId]?.studentName ||
          participants[studentId]?.username ||
          "Student";
        const isActive = activeTab === studentId;
        const isLoading = loading[studentId];
        const hasError = !!errors[studentId];

        return (
          <div
            key={studentId}
            onClick={() => dispatch(setActiveStudentTab(studentId))}
            title={`Student: ${studentName}`}
            className={`group flex items-center gap-2 px-3 py-1 rounded-t-md text-xs font-medium transition shrink-0 cursor-pointer h-full border-b-2 max-w-[160px] select-none ${
              isActive
                ? "bg-[#262626] text-white border-emerald-400 shadow-sm"
                : "bg-[#2b2b2b] text-zinc-400 hover:text-zinc-200 hover:bg-[#333333] border-transparent"
            }`}
          >
            {/* Student Icon / Loading Spinner */}
            {isLoading ? (
              <span className="w-2.5 h-2.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0" />
            ) : hasError ? (
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="Offline or error" />
            ) : (
              <FaUserGraduate className={`shrink-0 text-[11px] ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
            )}

            {/* Student Name */}
            <span className="truncate max-w-[90px]">{studentName}</span>

            {/* Close Tab Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(closeStudentTab(studentId));
              }}
              title="Close tab"
              className="p-0.5 rounded hover:bg-zinc-600/70 text-zinc-400 hover:text-white transition shrink-0 ml-0.5 cursor-pointer"
            >
              <RiCloseLine className="text-sm" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

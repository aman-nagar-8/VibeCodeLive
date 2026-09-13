"use client";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { beforeMount } from "@/utils/Editor_Customization";
import {
  RiFileCopyLine,
  RiCheckLine,
  RiRefreshLine,
  RiAlertLine,
  RiLockLine,
} from "react-icons/ri";
import { store } from "@/store";
import {
  requestStudentCodeStart,
  receiveStudentCodeError,
} from "@/store/meetingSlice";
import { requestStudentCode } from "@/lib/socketService";

export default function ReadOnlyCodeViewer({ studentId }) {
  const dispatch = useDispatch();
  const params = useParams();
  const meetingIdFromState = useSelector((state) => state.meeting.meetingId);
  const meetingId = meetingIdFromState || params?.id;

  const participants = useSelector(
    (state) => state.meeting.participants?.byId || {}
  );
  const snapshot = useSelector(
    (state) => state.meeting.studentCodeTabs?.snapshots?.[studentId]
  );
  const isLoading = useSelector(
    (state) => !!state.meeting.studentCodeTabs?.loading?.[studentId]
  );
  const error = useSelector(
    (state) => state.meeting.studentCodeTabs?.errors?.[studentId]
  );

  const studentName =
    snapshot?.studentName ||
    participants[studentId]?.username ||
    "Student";

  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!snapshot?.code) return;
    try {
      await navigator.clipboard.writeText(snapshot.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code to clipboard:", err);
    }
  };

  const handleRefresh = () => {
    if (!studentId || !meetingId) return;

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    dispatch(
      requestStudentCodeStart({
        studentId,
        studentName,
      })
    );

    requestStudentCode(meetingId, studentId, requestId);

    // 10-second timeout guard
    setTimeout(() => {
      const currentLoading =
        store.getState()?.meeting?.studentCodeTabs?.loading?.[studentId];
      if (currentLoading) {
        dispatch(
          receiveStudentCodeError({
            studentId,
            error: "Student did not respond in time. Please try again.",
          })
        );
      }
    }, 10000);
  };

  return (
    <div className="h-full w-full bg-[#262626] rounded-b-lg border-x-[0.5px] border-b-[0.5px] border-zinc-600 flex flex-col overflow-hidden">
      {/* 🔹 Action & Info Header */}
      <div className="w-full h-10 border-b-[0.5px] border-zinc-700 bg-[#2b2b2b] px-3 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            <RiLockLine className="text-amber-400 text-sm" />
            <span>Viewing:</span>
            <span className="text-white font-semibold">{studentName}</span>
            <span className="text-zinc-500 text-[11px]">(Read-Only)</span>
          </div>

          {snapshot?.timestamp && (
            <span className="hidden sm:inline-block text-[11px] text-zinc-400 ml-2">
              Captured at {new Date(snapshot.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Refresh Snapshot */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            title="Fetch latest snapshot"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#363636] hover:bg-[#404040] text-zinc-300 hover:text-white text-xs transition disabled:opacity-50 cursor-pointer"
          >
            <RiRefreshLine className={`text-sm ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>

          {/* Copy Code */}
          <button
            type="button"
            onClick={handleCopyCode}
            disabled={!snapshot?.code || isLoading}
            title="Copy snapshot to clipboard"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
              copied
                ? "bg-emerald-600/90 text-white"
                : "bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 hover:text-white disabled:opacity-40 disabled:pointer-events-none"
            }`}
          >
            {copied ? (
              <>
                <RiCheckLine className="text-sm" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <RiFileCopyLine className="text-sm" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 🔹 Content Body */}
      <div className="flex-1 min-h-0 relative">
        {/* Loading Overlay or Empty Loading State */}
        {isLoading && !snapshot?.code && (
          <div className="absolute inset-0 bg-[#262626]/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3 p-4">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-zinc-300 font-medium animate-pulse">
              Loading code of {studentName}...
            </div>
            <div className="text-xs text-zinc-500">
              Requesting live snapshot via WebSocket
            </div>
          </div>
        )}

        {/* Error / Offline State */}
        {error && (
          <div className="m-4 p-4 rounded-lg bg-red-950/40 border border-red-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-red-200 text-xs">
            <div className="flex items-center gap-2.5">
              <RiAlertLine className="text-red-400 text-lg shrink-0" />
              <div>
                <p className="font-semibold text-red-300">{error}</p>
                <p className="text-[11px] text-red-400/80 mt-0.5">
                  {error.toLowerCase().includes("offline") || error.toLowerCase().includes("respond")
                    ? "The student client is either disconnected or did not respond to the snapshot request."
                    : "Please ensure you have teacher permissions and are connected to this meeting room."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="px-3 py-1.5 rounded bg-red-800/50 hover:bg-red-700/60 text-white font-medium transition cursor-pointer self-start sm:self-auto shrink-0"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Monaco Read-Only Editor */}
        {snapshot?.code !== undefined ? (
          <div className="h-full w-full">
            <Editor
              height="100%"
              language={snapshot.language || "javascript"}
              value={snapshot.code}
              theme="custom-bg"
              beforeMount={beforeMount}
              options={{
                readOnly: true,
                domReadOnly: true,
                fontSize: 14,
                fontFamily: "JetBrains Mono, monospace",
                lineHeight: 22,
                minimap: { enabled: false },
                wordWrap: "on",
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                renderLineHighlight: "all",
                cursorBlinking: "solid",
                padding: { top: 12, bottom: 12 },
                scrollbar: {
                  verticalScrollbarSize: 6,
                  horizontalScrollbarSize: 6,
                },
              }}
            />
          </div>
        ) : !isLoading && !error ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-zinc-500 gap-2 text-xs">
            <p>No snapshot available yet for {studentName}.</p>
            <button
              type="button"
              onClick={handleRefresh}
              className="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition cursor-pointer"
            >
              Request Code Snapshot
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

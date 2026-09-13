import React, { useEffect } from "react";
import Split from "react-split";
import CodeEditor from "./CodeEditor";
import Members from "./Member";
import StudentCodeTabs from "./StudentCodeTabs";
import ReadOnlyCodeViewer from "./ReadOnlyCodeViewer";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, joinMeeting } from "@/lib/socketService";
import { setMeetingId, resetStudentCodeTabs } from "@/store/meetingSlice";

const Base = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const activeTab = useSelector(
    (state) => state.meeting.studentCodeTabs?.activeTab
  );
  const openTabs = useSelector(
    (state) => state.meeting.studentCodeTabs?.openTabs || []
  );

  const isStudentTabActive =
    activeTab && activeTab !== "host" && openTabs.includes(activeTab);

  // connect socket effect
  useEffect(() => {
    const token = sessionStorage.getItem("socketAuth");

    if (!token) {
      router.replace("/meeting/join");
      return;
    }

    connectSocket(token);
    dispatch(setMeetingId(id));
    joinMeeting(id);

    return () => {
      // Clear all student code tabs and snapshots on leaving the meeting
      dispatch(resetStudentCodeTabs());
    };
  }, [id, dispatch, router]);

  return (
    <Split
      className="flex h-full w-full overflow-hidden"
      sizes={[75, 25]}
      minSize={[400, 270]}
      expandToMin={false}
      gutterSize={10}
      gutterAlign="center"
      snapOffset={30}
      dragInterval={1}
      direction="horizontal"
      cursor="col-resize"
    >
      {/* Left Side: Code Workspace with Student Tabs */}
      <div className="h-full rounded-lg flex flex-col overflow-hidden">
        <div className="w-full h-9 bg-[#333333] rounded-t-lg border-x-[0.5px] border-t-[0.5px] border-zinc-600 text-zinc-400 flex items-center overflow-hidden">
          <StudentCodeTabs />
        </div>
        <div className="flex-1 min-h-0">
          {isStudentTabActive ? (
            <ReadOnlyCodeViewer studentId={activeTab} />
          ) : (
            <CodeEditor />
          )}
        </div>
      </div>

      {/* Right Side: Participant Snapshots List */}
      <div className="h-full rounded-lg flex flex-col overflow-hidden">
        <div className="w-full h-9 bg-[#333333] rounded-t-lg p-1 flex items-center border-x-[0.5px] border-t-[0.5px] border-zinc-600 text-zinc-400 gap-1 overflow-x-scroll no-scrollbar">
          <span className="text-xs font-medium text-zinc-300 px-2">
            Classroom Members
          </span>
        </div>
        <div className="flex-1 min-h-0">
          <Members />
        </div>
      </div>
    </Split>
  );
};

export default Base;

import React from "react";
import Split from "react-split";
import CodeEditor from "./CodeEditor";
import Members from "./Member";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { connectSocket, joinMeeting } from "@/lib/socketService";
import { useEffect  } from "react";
import { setMeetingId } from "@/store/meetingSlice";
import { useParams } from "next/navigation";

const base = () => {
  const { id } = useParams();
   

  const dispatch = useDispatch();
  const router = useRouter();

  // connect socket user effect
  useEffect(() => {
    const token = sessionStorage.getItem("socketAuth");

    if (!token) {
      router.replace("/meeting/join");
      return;
    }

    connectSocket(token);
    dispatch(setMeetingId(id));
    joinMeeting(id);
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
        {/* Left Side */}
        <div className="h-full rounded-lg  flex flex-col overflow-hidden">
          <div className="w-full h-9 bg-[#333333] rounded-t-lg p-1 flex items-center border-x-[0.5px] border-t-[0.5px] border-zinc-600 text-zinc-400 gap-1 overflow-x-scroll no-scrollbar">
            {/* {leftNavArray.map((link, index) => (
              <Nav_Link
                key={index}
                title={link.title}
                icon={link.icon}
                className={link.className}
                href={link.href}
              />
            ))} */}
          </div>
          <div className="flex-1 min-h-0">
            <CodeEditor />
          </div>
        </div>

        {/* right side */}
              <div className="h-full rounded-lg  flex flex-col overflow-hidden">
                <div className="w-full h-9 bg-[#333333] rounded-t-lg p-1 flex items-center border-x-[0.5px] border-t-[0.5px] border-zinc-600 text-zinc-400 gap-1 overflow-x-scroll no-scrollbar">
                  {/* {leftNavArray.map((link, index) => (
                    <Nav_Link
                      key={index}
                      title={link.title}
                      icon={link.icon}
                      className={link.className}
                      href={link.href}
                    />
                  ))} */}
                </div>
                <div className="flex-1 min-h-0"><Members /></div>
              </div>
      </Split>

  );
};

export default base;

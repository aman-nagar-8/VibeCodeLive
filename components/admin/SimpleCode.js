"use client";
import React, { use } from "react";
import { IoPeople } from "react-icons/io5";
import Split from "react-split";
import CodeEditor from "./Code_editor";
import { connectSocket } from "@/lib/connectsocket.js";
import { getSocket } from "@/lib/connectsocket.js";
import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { setTimeout } from "timers";
import { FaCommentDots } from "react-icons/fa";
import { div } from "framer-motion/client";

const SimpleCode = ({ meetingId, token }) => {
  const [messages, setMessages] = useState([]);
  const [mess_input, setmess_Input] = useState("");
  const [meeting_info, setmeeting_info] = useState({});
  const [meeting_url_copy, setmeeting_url_copy] = useState(false);
  const [meeting_members, setmeeting_members] = useState([]);
  const [selected_tab, setselected_tab] = useState("members");

  useEffect(() => {
    if (!token) {
      console.log("❌ No token provided");
      return;
    }
    console.log("🔑 Using token:", token);

    const socket = connectSocket(token); // ✔ create only once
    if (socket) {
      console.log("Socket in MeetingClient:", socket);
    }

    socket.on("connect", () => {
      socket.emit("join-meeting", { meetingId }, (ack) => {
        console.log("Join ACK:", ack);
      });
    });

    socket.on("receive-message", ({ text, from }) => {
      console.log("Received message:", text, "from:", from);
      const mes = {text:text, from:from};
      setMessages((prev) => [...prev, mes]);
    });

    return () => socket.disconnect();
  }, [meetingId, token]);

  const sendMsg = () => {
    if (!mess_input.trim()) return;
    console.log("Sending message:", mess_input);
    const socket = getSocket(); // ✔ use existing socket
    if (socket) {
      console.log("❌ socket is", socket);
    }

    socket.emit("send-message", { text: mess_input, meetingId });

    // socket.emit("send-message", { meetingId, text: input });

    // setMessages((prev) => [...prev, { text: input, self: true }]);
    // setInput("");
  };

  const sendCode = () => {
    if (!input.trim()) return;
    console.log("Sending code:", mess_input);
    const socket = getSocket();
    if (!socket) {
      console.log("❌ socket is not connected", socket);
      return;
    }
    socket.emit("send-code", { code: input, meetingId });
  };

  useEffect(() => {
    const getMeeting = async (meetingId) => {
      const res = await fetch(`/api/getmeeting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId }),
      });
      const data = await res.json();
      setmeeting_info(data.meeting);
      setmeeting_members(data.members);
      console.log("Meeting info:", data);
    };
    getMeeting(meetingId);
  }, [meetingId]);

  const copy_meeting_url = () => {
    navigator.clipboard.writeText(meeting_info?.url);
    setmeeting_url_copy(true);
    setTimeout(() => {
      setmeeting_url_copy(false);
    }, 3000);
  };

  return (
    <div className="flex p-3 gap-2 w-screen h-screen">
      <Split
        className="flex h-full w-full"
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
        <CodeEditor meetingId={meetingId} />
        {/* Right Side */}
        <div className="h-full border border-zinc-500 rounded-xl ">
          <div className="w-full h-10 bg-zinc-700 rounded-t-xl flex items-center">
            <div className="flex">
              <IoPeople
                onClick={() => setselected_tab("members")}
                className="w-6 h-6 text-zinc-400 ml-7 hover:text-zinc-100 cursor-pointer "
              />
              <FaCommentDots
                onClick={() => setselected_tab("messages")}
                className="w-6 h-6 text-zinc-400 ml-7 hover:text-zinc-100 cursor-pointer "
              />
            </div>
          </div>

          <div className="bg-[#1e1e1e] w-full rounded-b-xl h-[91vh] p-2">
            {/* tabs area */}
            {/* members area */}
            {selected_tab === "members" && (
              <div>
                <div className=" bg-zinc-800 w-60 rounded-lg hover:border-zinc-400 border-zinc-600 flex items-center">
                  <input
                    className="min-w-50 p-2 text-blue-400 outline-none bg-transparent "
                    value={meeting_info?.url}
                    type="text"
                    readOnly
                  />
                  <div onClick={copy_meeting_url}>
                    {meeting_url_copy ? (
                      <IoCheckmarkDoneSharp className="text-zinc-500 hover:text-zinc-300 " />
                    ) : (
                      <FaCopy className="text-zinc-600 hover:text-zinc-300 cursor-pointer" />
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap h-60 mt-3">
                  {meeting_members?.map((member, index) => (
                    <div
                      key={index}
                      className="w-30 h-30 bg-zinc-500 flex flex-col text-sm items-center justify-center rounded-2xl"
                    >
                      <div> {member.name} </div>
                      <div>{member.email}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* messages area */}
            {selected_tab === "messages" && (
              <div className="flex flex-col gap-2 h-60 mt-3 overflow-y-scroll ">
                <div>
                  {messages.map((msg, index) => (
                    <div key={index} className="p-2 border border-zinc-500 rounded-lg flex gap-2 mb-2" >
                      <p className="bg-green-500 rounded-4xl p-1 flex items-center justify-center " >{msg?.from}</p>
                      <p className="flex items-center" >{msg.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex " >
                  <input value={mess_input} onChange={(e)=>setmess_Input(e.target.value)} className="outpline-none sticky bottom-2 left-5 bg-zinc-500 rounded-2xl px-2 w-full max-w-50 h-10" type="text" />
                  <button type="button" className="w-10  ml-10 h-10 rounded-2xl bg-blue-500" onClick={sendMsg} > S</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Split>
    </div>
  );
};

export default SimpleCode;

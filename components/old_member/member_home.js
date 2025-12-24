"use client";
import React from "react";
import { IoPeople } from "react-icons/io5";
import Split from "react-split";
import Member_code_editor from "./member_code_editor.js";
import Admin_code_editor from "./admin_code_editor.js";
import { connectSocket } from "@/lib/connectsocket.js";
import { getSocket } from "@/lib/connectsocket.js";
import { useEffect, useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import { div } from "framer-motion/m";
import { IoSend } from "react-icons/io5";
import { MdArrowBackIos } from "react-icons/md";
import { RiArrowDownWideLine } from "react-icons/ri";
import { IoCodeSlashSharp } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";

const SimpleCode = ({ meetingId, token }) => {
  const [messages, setMessages] = useState([]);
  const [mess_input, setmess_Input] = useState("");
  const [selected_tab, setselected_tab] = useState("Messages");
  const [nav_slid, setnav_slid] = useState(false)

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
      setMessages((prev) => [...prev, { text, from }]);
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
    console.log("Sending code:", input);
    const socket = getSocket();
    if (!socket) {
      console.log("❌ socket is not connected", socket);
      return;
    }
    socket.emit("send-code", { code: input, meetingId });
  };

  return (
    <div className="flex p-3 gap-2 w-screen h-screen">
      <Split
        className="flex h-full w-full"
        sizes={[75, 25]}
        minSize={[400, 200]}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        {/* Left Side */}
        <Admin_code_editor meetingId={meetingId} />
        {/* Right Side */}

        <div className=" h-full">
          {selected_tab === "Code" && (
            <Member_code_editor meetingId={meetingId} />
          )}

          {selected_tab === "Messages" && (
            <div className="h-full bg-[#1e1e1e] rounded-lg">
              <div className=" h-10 bg-zinc-700 rounded-t-xl flex items-center">
                <div className="flex items-center">
                  <FaCommentDots className="w-6 h-6 text-zinc-400 hover:text-zinc-300 ml-7" />
                  <p className="font-bold ml-1 ">Comments</p>
                </div>
              </div>
              <div className="flex h-[82vh] flex-col gap-2 overflow-y-scroll ">
                <div>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className="p-2 border-b border-zinc-500 rounded-lg flex flex-col gap-2 mb-2"
                    >
                      <div className="flex gap-3 text-[10px] text-zinc-300 items-center ">
                        <p className="bg-blue-400 rounded-4xl w-7 h-7 flex items-center "></p>
                        <div>
                          <p>{msg?.from}</p>
                          <p>{"10:44"}</p>
                        </div>
                      </div>
                      <p className="flex items-center ">{msg?.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex mt-3 ml-2">
                <input
                  value={mess_input}
                  onChange={(e) => setmess_Input(e.target.value)}
                  className="outpline-none  rounded-xl px-2 w-full max-w-80 bg-zinc-700 h-10"
                  type="text"
                  placeholder="Message..."
                />
                <button
                  type="button"
                  className="w-10  ml-3 h-10 rounded-2xl bg-blue-500 flex justify-center items-center"
                  onClick={sendMsg}
                >
                  <IoSend className="" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Split>
      <div className={` ${nav_slid?"":"hidden opacity-0"} border-zinc-300 z-10 fixed bottom-17 border right-7 flex flex-col justify-center items-center w-12 h-45 rounded-t-lg bg-zinc-800`} >
          <div>
            <div
          onClick={() => setselected_tab("Messages")}
          className="w-10 h-10 rounded-lg border cursor-pointer border-zinc-400 mt-2 flex justify-center items-center "
        >
          <BiMessageDetail className="w-5 h-5" />
        </div>
        <div>
           <div
          onClick={() => setselected_tab("Code")}
          className="w-10 h-10 rounded-lg border cursor-pointer border-zinc-400 mt-2 flex justify-center items-center "
        >
          <IoCodeSlashSharp className="w-5 h-5" />
        </div>
        </div>
          </div>
      </div>
      <div onClick={()=>setnav_slid(!nav_slid)} className={` ${nav_slid ? "border-t-0 rounded-t-none":""} fixed bottom-7 cursor-pointer z-20 border right-7 flex justify-center items-center w-12 h-12 rounded-xl bg-zinc-800`}>
        <RiArrowDownWideLine 
  className={` ${nav_slid ? "rotate-180":""}  w-6 h-6 `} />
        {/* <div
          onClick={() => setselected_tab("Messages")}
          className="w-8 h-8 rounded-2xl flex justify-center items-center bg-red-300 "
        >
          M
        </div>
        <div
          onClick={() => setselected_tab("Code")}
          className="w-8 h-8 rounded-2xl bg-red-300 flex justify-center items-center "
        >
          C
        </div> */}
      </div>
    </div>
  );
};

export default SimpleCode;

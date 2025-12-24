"use client";
import React from "react";
import Editor from "@monaco-editor/react";
import { FaCode } from "react-icons/fa";
import Split from "react-split";
import { TbTriangleFilled } from "react-icons/tb";
import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { getSocket } from "@/lib/connectsocket.js";

export default function CodeEditor({meetingId}) {
  const [Code, setCode] = useState("");
  const [Input, setInput] = useState("");
  const [Output, setOutput] = useState("");
  const [language, setlanguage] = useState("javascript");
  const [language_code, setlanguage_code] = useState();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  async function runCode() {
    setOutput("Compiling...");
    const res = await fetch("/api/run", {
      method: "POST",
      body: JSON.stringify({
        code: Code,
        language_id: 63, // JavaScript
        input: "",
      }),
    });

    const result = await res.json();
    setOutput(
      result.stdout || result.stderr || result.compile_output || "No output"
    );
    console.log("Output:", result);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sendCode = () => {
      if (!Code.trim()) return;
      console.log("Sending code:", Code);
      const socket = getSocket();
      if (!socket) {
        console.log("❌ socket is not connected", socket);
        return;
      }
      socket.emit("send-code", { code: Code, meetingId });
    }
useEffect(() => {
  const socket = getSocket();
  if (!socket) {
    console.log("❌ No socket yet — waiting for connection");
    return;
  }

  console.log("🟡 CodeEditor mounted — waiting for socket connect...");

  const handler = ({ code, from }) => {
    console.log("🔥 Received code:", code, "from:", from);
    setOutput(code);
  };

  const onConnect = () => {
    console.log("🟢 Socket connected — joining room + attaching listeners");

    // join room AFTER connection
    socket.emit("join-room", meetingId);

    // listen for code updates
    socket.on("receive-code", handler);
  };

  socket.on("connect", onConnect);

  // If socket is already connected (reload case)
  if (socket.connected) {
    onConnect();
  }

  return () => {
    socket.off("connect", onConnect);
    socket.off("receive-code", handler);
  };
}, []);


  return (
    <div className="h-full ">
      <Split
        className="flex flex-col h-full w-full"
        sizes={[75, 25]}
        minSize={[200, 55]}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="vertical"
        cursor="row-resize"
      >
        {/* Code Section */}
        <div className="flex flex-col h-full border border-zinc-500 rounded-xl">
          <div className=" h-10 bg-zinc-700 rounded-t-xl flex items-center">
            <div className="flex items-center">
              <FaCode className="w-6 h-6 text-green-600 ml-7" />
              <p className="font-bold ml-1 ">Code</p>
            </div>
          </div>

          <div
            style={{ backgroundColor: "#1e1e1e" }}
            className="h-10 border-b border-zinc-600 flex items-center relative justify-end"
          >
            <div className="relative inline-block" ref={dropdownRef}>
              {/* Button */}
              <button
                onClick={() => setOpen(!open)}
                className="hover:bg-zinc-800 text-zinc-400 px-4 items-center min-w-35 justify-center mr-3 flex gap-2 py-1 rounded"
              >
                {language}
                <IoIosArrowDown />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute mt-2 w-48 bg-zinc-700 z-10 shadow-lg rounded p-2 
        transition-all duration-200 ease-out
        ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }
      `}
              >
                <p
                  value={"Java"}
                  onClick={() => setlanguage("Java")}
                  className="p-2 hover:bg-zinc-600 rounded"
                >
                  {"Java"}
                </p>
                <p
                  value={"Java"}
                  onClick={() => setlanguage("C++")}
                  className="p-2 hover:bg-zinc-600 rounded"
                >
                  {"C++"}
                </p>
                <p
                  value={"Java"}
                  onClick={() => setlanguage("JavaScript")}
                  className="p-2 hover:bg-zinc-600 rounded"
                >
                  {"JavaScript"}
                </p>
                <p
                  value={"Java"}
                  onClick={() => setlanguage("Python")}
                  className="p-2 hover:bg-zinc-600 rounded"
                >
                  {"Python"}
                </p>
              </div>
            </div>

            <div
              onClick={() => runCode()}
              className="h-8 w-8 rounded-2xl hover:bg-zinc-700 mr-5 flex items-center justify-center rotate-90 text-zinc-400 hover:text-zinc-300 cursor-pointer "
            >
              <TbTriangleFilled />
            </div>
          </div>
          <div className="flex-1 min-h-10">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              defaultValue="// write code there"
              theme="vs-dark"
              value={Code}
              onChange={(value) => {
                setCode(value);
                // sendCode();
              }}
            />
          </div>
          <div
            style={{ backgroundColor: "#1e1e1e" }}
            className="rounded-b-xl h-10 bg-red-800"
          >
            hhhh
          </div>
        </div>
        {/* Output SEction */}
        <div className="flex bg-[#1e1e1e] flex-col h-full border border-zinc-500 rounded-xl ">
          <div className="min-h-10 bg-zinc-700 rounded-t-xl flex items-center">
            <FaCode className="w-6 h-6 text-green-600 ml-7" />
            <p className="font-bold ml-1 ">Output</p>
          </div>
          <pre className="p-3 overflow-scroll">{Output}</pre>
        </div>
      </Split>
    </div>
  );
}
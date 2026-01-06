"use client";
import Split from "react-split";
import { BsFileCode } from "react-icons/bs";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { beforeMount } from "@/utils/Editor_Customization";
import { LuTriangle } from "react-icons/lu";
import { AiOutlineAlignLeft } from "react-icons/ai";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoReload } from "react-icons/io5";
import { useEffect, useRef } from "react";

const HeckClass = () => {
  const [Code, setCode] = useState("");
  const [Output, setOutput] = useState([]);
  const [CodeCompiling, setCodeCompiling] = useState(false);
  const [errorCount, seterrorCount] = useState(0);
  const [errorType, setErrorType] = useState({});
  const [lastRun, setLastRun] = useState(Date);

  const [isStartedCoding, setIsStartedCoding] = useState(false);
  const [priviousCode, setPriviousCode] = useState("");

  const outputRef = useRef(null);
  const savedPriviousCode = useRef("");

  useEffect(() => {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [CodeCompiling]);

  function classifyResult(stderr) {
    // 1️⃣ Syntax / Compile Error
    if (
      stderr &&
      (stderr.includes("SyntaxError") ||
        stderr.includes("Unexpected token") ||
        stderr.includes("missing") ||
        stderr.includes("expected"))
    ) {
      return {
        type: "SYNTAX_ERROR",
        reason: "Code failed before execution",
      };
    }

    // 2️⃣ Runtime Error
    if (
      stderr &&
      (stderr.includes("TypeError") ||
        stderr.includes("ReferenceError") ||
        stderr.includes("RangeError") ||
        stderr.includes("at ")) // stack trace
    ) {
      return {
        type: "RUNTIME_ERROR",
        reason: "Code crashed during execution",
      };
    }

    // 3️⃣ Timeout (infinite loop)
    // if (signal === "SIGTERM") {
    //   return {
    //     type: "TIMEOUT_ERROR",
    //     reason: "Possible infinite loop",
    //   };
    // }

    // 4️⃣ Logic Error
    // if (exitCode === 0 && stdout) {
    //   return {
    //     type: "SUCCESS_OR_LOGIC_ERROR",
    //     reason: "Execution successful, validate output",
    //   };
    // }

    // Fallback
    return {
      type: "SUCCESS",
      reason: "Unclassified behavior",
    };
  }

  async function runCode() {
    setCodeCompiling(true);
    setLastRun(Date.now());
    const res = await fetch("/api/run", {
      method: "POST",
      body: JSON.stringify({
        code: Code,
        language_id: 63, // JavaScript
        input: "",
      }),
    });

    const result = await res.json();
    setCodeCompiling(false);

    setErrorType(classifyResult(result.stderr));
    console.log("Error type : ", errorType);

    setOutput((prev) => [
      ...prev,
      {
        Data: result.stdout || result.stderr || "No output",
        time: new Date().toLocaleTimeString(),
        type: result.stderr || result.compile_output ? "error" : "success",
        outtype: errorType.type,
      },
    ]);

    // if (result.stdout) {
    // } else {
    //   seterrorCount(errorCount + 1);
    //   console.log("Error count:", errorCount + 1);
    //   console.log("error: ", result.status);
    //   setOutput((prev) => [
    //     ...prev,
    //     {
    //       Data: result.stderr || "No output",
    //       time: new Date().toLocaleTimeString(),
    //       type: result.stderr || result.compile_output ? "error" : "success",
    //     },
    //   ]);
    // }
  }
  //   function priviousCodeFun(){
  //     savedPriviousCode.current();
  //     // getPriviousCode()
  //   }

  //   const priviousCodeIntervalId = setInterval(priviousCodeFun , 12000)

  //   return () => clearInterval(priviousCodeIntervalId);
  // }, []);

  const prevCodeRef = useRef("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (Code.length - prevCodeRef.current.length > 50) {
        setIsStartedCoding(true);
      } else {
        setIsStartedCoding(false);
      }

      prevCodeRef.current = Code;
    }, 120000);

    return () => clearInterval(interval);
  }, [Code]);

  function isRepeatedError(lastOutputs) {
    if (lastOutputs.length < 3) return false;

    const firstType = lastOutputs[0].type;
    return lastOutputs.every(
      (o) => o.type === firstType && o.type !== "success"
    );
  }

  function hasNoSuccess(lastOutputs) {
    return lastOutputs.every((o) => o.type !== "success");
  }
  function isImproving(lastOutputs) {
    if (lastOutputs.length < 4) return false;

    const last = lastOutputs[lastOutputs.length - 1];
    return last.type === "success";
  }
  function isConfused(lastOutputs) {
    const types = lastOutputs.map((o) => o.type);
    return new Set(types).size > 2;
  }

  function evaluateUserState() {
    const recent = Output.slice(-4);
    if (isRepeatedError(recent)) return "STUCK";
    if (isConfused(recent)) return "CONFUSED";
    if (isImproving(recent)) return "IMPROVING";
    if (hasNoSuccess(recent)) return "STRUGGLING";

    return "NORMAL";
  }

  useEffect(() => {
  const state = evaluateUserState(Output);
  console.log("📊 User state:", state);
}, [Output]);


  return (
    <Split
      className="h-screen w-screen p-2 overflow-hidden"
      sizes={[75, 25]}
      minSize={[200, 38]}
      expandToMin={false}
      gutterSize={10}
      gutterAlign="center"
      snapOffset={30}
      dragInterval={1}
      direction="vertical"
      cursor="row-resize"
    >
      {/* Code section */}
      <div className="bg-[#262626] h-full rounded-b-lg border-x-[0.5px] border-b-[0.5px] border-zinc-600 flex flex-col">
        <div className="border-b-[0.5px] border-zinc-600 w-full h-8 flex items-center justify-end p-1 gap-1">
          <div
            onClick={runCode}
            className="group relative p-1.5 rounded-sm hover:bg-[#333333] cursor-pointer"
          >
            <LuTriangle className="text-zinc-300 rotate-90 text-sm " />
            <span className="absolute top-full right-0 mb-2 bg-zinc-900 z-10 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
              Run
            </span>
          </div>
          <div className="group relative p-1.5 rounded-sm hover:bg-[#333333] cursor-pointer">
            <AiOutlineAlignLeft className="text-zinc-300  " />
            <span className="absolute top-full right-0 mb-2 z-10 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
              Formate Code
            </span>
          </div>
          <div className="group relative p-1.5 rounded-sm hover:bg-[#333333] cursor-pointer">
            <IoBookmarkOutline className="text-zinc-300  " />
            <span className="absolute top-full right-0 mb-2 z-10 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
              Save
            </span>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue="// write code there"
            theme="custom-bg"
            beforeMount={beforeMount}
            value={Code}
            options={{
              fontSize: 14,
              fontFamily: "JetBrains Mono, monospace",
              lineHeight: 22,

              minimap: { enabled: false },
              wordWrap: "on",

              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",

              scrollBeyondLastLine: false,
              smoothScrolling: true,

              padding: { top: 12, bottom: 12 },

              renderLineHighlight: "all",
              scrollbar: {
                verticalScrollbarSize: 6,
                horizontalScrollbarSize: 6,
              },
            }}
            onChange={(value) => {
              setCode(value);
              // sendCode();
            }}
          />
        </div>
      </div>
      {/* Output section */}
      <div className="bg-[#262626] rounded-lg border-[0.5px] border-zinc-600 flex flex-col h-full min-h-10">
        <div className="w-full h-9 shrink-0 bg-[#333333] justify-between rounded-t-lg p-1 flex items-center gap-1 overflow-x-scroll no-scrollbar text-zinc-400">
          <div
            className={`flex gap-2 items-center text-sm hover:bg-zinc-700 px-3 h-full rounded-sm cursor-pointer`}
          >
            <BsFileCode className="text-blue-500" />
            Output
          </div>
          <div className="flex gap-3">
            {errorCount > 2 && (
              <div className="group relative p-1.5 rounded-sm hover:bg-[#333333] cursor-pointer">
                <AiOutlineAlignLeft className="text-red-600  " />
                <span className="absolute bottom-0 mr-2 z-10 right-full bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
                  To many Errors
                </span>
              </div>
            )}
            {!isStartedCoding && (
              <div className="group relative p-1.5 rounded-sm hover:bg-[#333333] cursor-pointer">
                <AiOutlineAlignLeft className="text-red-600  " />
                <span className="absolute bottom-0 mr-2 z-10 right-full bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
                  You are not writing
                </span>
              </div>
            )}
            {errorType && (
              <div className="group relative p-1.5 rounded-sm hover:bg-[#333333] cursor-pointer">
                {/* <AiOutlineAlignLeft className="text-green-600  " /> */}
                <span className="text-xs">{errorType.type}</span>
                <span className="absolute bottom-0 mr-2 z-10 right-full bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
                  You are coding
                </span>
              </div>
            )}
            <div
              onClick={() => {
                setOutput([]);
              }}
              className="flex justify-center  items-center group relative mr-2 rounded-md cursor-pointer"
            >
              <IoReload className="group-hover:text-zinc-300" />
              <span className="absolute bottom--[5px] mr-2 z-10 right-full bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
                Clear output
              </span>
            </div>
          </div>
        </div>
        <div
          ref={outputRef}
          className="flex-1 min-h-0 overflow-y-auto px-4 py-3 text-sm leading-relaxed font-mono text-zinc-200 selection:bg-blue-500/30 whitespace-pre-wrap"
        >
          {Output.map((output, index) => (
            <div key={index} className="py-2 border-b-[0.5px] border-zinc-700">
              <pre
                className={` ${
                  output.type == "error" ? " text-red-500 " : " text-zinc-200 "
                }  whitespace-pre-wrap`}
              >
                {output.Data}
              </pre>
              {/* <div className="text-[10px] text-zinc-500" >{output.time}</div> */}
            </div>
          ))}
          <div className="h-3/4">
            {CodeCompiling && (
              <div className="flex items-center gap-1 mt-3">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Split>
  );
};

export default HeckClass;

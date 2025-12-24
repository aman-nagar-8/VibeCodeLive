"use client";
import Split from "react-split";
import { BsFileCode } from "react-icons/bs";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import {beforeMount} from "@/utils/Editor_Customization"


const Code = () => {
  const [Code, setCode] = useState("");
  return (
      <Split
        className="flex flex-col h-full w-full"
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
        <div className="bg-[#262626] rounded-b-lg border-x-[0.5px] border-b-[0.5px] border-zinc-600 flex flex-col">
          <div className="border-b-[0.5px] border-zinc-600 w-full h-7"></div>
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
         <div className="bg-[#262626] rounded-lg border-[0.5px] border-zinc-600 flex flex-col h-full min-h-10"
        >
          <div className="w-full h-9 shrink-0 bg-[#333333] rounded-t-lg p-1 flex items-center gap-1 overflow-x-scroll no-scrollbar text-zinc-400">
            <div className={`flex gap-2 items-center text-sm hover:bg-zinc-700 px-3 h-full rounded-sm cursor-pointer`} >
              <BsFileCode className="text-blue-500" />
              Output
            </div>
          </div>
          <pre className="flex-1 min-h-0 overflow-y-auto px-4 py-3 text-sm leading-relaxed font-mono text-zinc-200 selection:bg-blue-500/30">
            Output
          </pre>
        </div>
      </Split>
  );
};

export default Code;

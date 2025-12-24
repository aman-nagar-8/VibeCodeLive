"use client"
import Split from "react-split";
const page = () => {
  return (
    <Split
            className="flex h-full w-full"
            sizes={[50, 50]}
            minSize={[400, 200]}
            expandToMin={false}
            gutterSize={10}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="horizontal"
            cursor="col-resize"
          >
            {/* left part */}
            <div className="h-full bg-[#262626] rounded-xl border-[0.5px] border-zinc-600"></div>
            {/* right part */}
            <div className="h-full bg-[#262626] rounded-xl border-[0.5px] border-zinc-600"></div>
          </Split>
  )
}

export default page
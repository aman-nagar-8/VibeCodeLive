import React from "react";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import Forms from "./Forms";

const page = () => {
   
  return (
    <div className="w-screen h-screen flex md:flex-row   bg-[#4b8f89]">
      {/* bg-[#4b8f89] */}

      {/* left */}
      <section className="w-53 h-full"></section>
      {/* mid */}
      <section className="flex-1 flex flex-col justify-end items-center">
        <div className="w-full h-28 flex justify-center items-end">
          <div className="w-2 h-1.5 bg-zinc-700 [clip-path:polygon(100%_0%,0%_100%,100%_100%)]"></div>
          <div className="w-80 h-2 bg-zinc-700 border-t-[0.5px] border-slate-300 rounded-t"></div>
          <div className="w-2 h-1.5 bg-zinc-700 [clip-path:polygon(0%_0%,0%_100%,100%_100%)]"></div>
        </div>
        {/* bottom */}
        <div className="flex-1 w-full flex flex-col border-[0px_18px_0px_18px] rounded-t-2xl border-zinc-700">
          <div className="w-full bg-zinc-700 h-5.5 flex justify-center">
            <div className="w-3 h-3 bg-zinc-600 rounded-full flex justify-center items-center">
              <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
            </div>
          </div>
          <div className="flex-1 bg-white text-black flex flex-col justify-between">
            {/* screen */}
            <div className="flex-1 flex justify-center relative">
              <Image
                src="/laptop-bg-1.jpg"
                alt="Logo"
                fill
                className="object-cover z-0"
              />
              <div className="z-10 h-full flex items-end">
                <div className="w-100 h-112 bg-zinc-800/98 rounded-2xl mb-5 text-zinc-200 p-3">
                  <h3 className="text-lg font-bold">Forget Password</h3>
                  <Forms />
                </div>
              </div>
              <div></div>
              <div></div>
            </div>
            {/* navbar */}
            <div className="w-full h-10 red-black-gradient flex justify-between">
              <div></div>
              <div className="flex items-center gap-2.5">
                <Image
                  src="/windows-11.png"
                  alt="Logo"
                  width={28}
                  height={28}
                />
                <div className="flex ">
                  <IoSearch className="text-zinc-400 relative -right-6 top-1" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-zinc-600/60 border-t focus:outline-none text-zinc-300 border-zinc-500 rounded-full text-[10px] pl-7 p-1 placeholder:text-zinc-400"
                  />
                </div>
                <Image
                  src="/microsoft-copilot.png"
                  alt="Logo"
                  width={28}
                  height={28}
                />
                <Image
                  src="/file-explorer.png"
                  alt="Logo"
                  width={28}
                  height={28}
                />
                <Image src="/edge.png" alt="Logo" width={28} height={28} />
                <Image src="/chrome.png" alt="Logo" width={28} height={28} />
                <Image src="/vs-code.png" alt="Logo" width={28} height={28} />
                <Image src="/settings.png" alt="Logo" width={28} height={28} />
              </div>
              <div className="text-[10px] text-zinc-300 font-bold pr-3 flex flex-col justify-center items-end">
                <p>22:07</p>
                <p>05-07-2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* right */}
      <section className="w-53 h-full"></section>
    </div>
  );
};

export default page;

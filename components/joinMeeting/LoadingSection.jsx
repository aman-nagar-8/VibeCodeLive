import React from "react";
import Image from "next/image";
import { div } from "framer-motion/client";

const LoadingSection = ({ error, success }) => {
  return (
    <div className="p-6">
      <div className=" rounded-xl p-4 mb-4  flex items-center justify-center text-gray-500 flex-col gap-5">
        <div className="relative w-[360px] h-[200px] shrink-0 rounded-2xl overflow-hidden bg-white shadow-sm">
          <Image
            src="/joinMeeting03.png"
            fill
            alt="How meetings work"
            className="object-cover"
          />

          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/35 backdrop-blur-[2px]">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-3 border-zinc-300 border-t-[#4b8f89]" />
              <p className="text-sm text-zinc-600">Joining…</p>
            </div>
          </div>
        </div>
        Asking the host to let you in...
        {error && <div className="text-red-500" >{error}</div>}
        {success && (<div className="text-green-500" >{success}</div>)}
      </div>
    </div>
  );
};

export default LoadingSection;

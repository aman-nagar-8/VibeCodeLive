"use client"
import React from "react";


const Navigation = ({ className }:{className?:String}) => {
  return (
      <div className={`w-60 h-7 border-[0.5px] border-zinc-500 rounded-md flex ${className} `}>
        <div className="border-r rounded-l-md w-20 border-zinc-500 hover:bg-[#2a2b2b] cursor-pointer"></div>
        <div className="border-r w-20 border-zinc-500 text-sm flex justify-center items-center hover:bg-[#2a2b2b] cursor-pointer">
          Both
        </div>
        <div className=" rounded-r-md w-20 border-zinc-500 hover:bg-[#2a2b2b] cursor-pointer"></div>
      </div>
  );
};

export default Navigation;

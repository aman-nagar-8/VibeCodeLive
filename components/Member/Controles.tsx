"use client";
import React from "react";
import { MdOutlineLogout } from "react-icons/md";
import { IoMdMic } from "react-icons/io";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { useState } from "react";
import { motion } from "framer-motion";

const Controles = ({ className }: { className?: String }) => {
  const [navigation_on, setnavigation_on] = useState(true);
  const [navigation_animation, setnavigation_animation] = useState(true)

  return (
    <>
      {navigation_on && (
        <motion.div
          animate={
            navigation_animation ? { x: "-10px", opacity: 1 } : { x: 20, opacity: 0.1  }
          }
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className={`w-40 pl-3 h-10 flex py-0.5 px-0.5 gap-1 opacity-0  ${className} `}
        >
          <div className="flex justify-center items-center relative group px-3 rounded-md hover:bg-[#3c3c3c] cursor-pointer text-red-500 ">
            <MdOutlineLogout />
            <span className="absolute bottom-full mb-2 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
              Exit
            </span>
          </div>
          <div className="flex group relative justify-center items-center hover:bg-[#3c3c3c] px-3 rounded-md cursor-pointer">
            <IoMdMic />
            <span className="absolute bottom-full mb-2 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
              Mic
            </span>
          </div>
          <div className="flex justify-center items-center group relative hover:bg-[#3c3c3c] px-3 rounded-md cursor-pointer">
            <IoIosInformationCircleOutline />
            <span className="absolute bottom-full mb-2 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
              info
            </span>
          </div>
        </motion.div>
      )}
      <div
        onClick={() =>{
          setnavigation_animation(!navigation_on)
          setTimeout(() => {
            setnavigation_on(!navigation_on)
          }, 150);
        }
        }
        className="w-11 h-10 flex py-0.5 px-0.5"
      >
        <div className="flex justify-center items-center hover:bg-[#3c3c3c] px-3 rounded-md cursor-pointer">
          <IoIosArrowBack className={`${navigation_on ? "transition-all duration-200 rotate-180" : "transition-all duration-200 rotate-0"}`} />
        </div>
      </div>
    </>
  );
};

export default Controles;

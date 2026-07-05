"use client";
import React from "react";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { PiSignOutFill } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/userSlice";

const Profile = ({ user }) => {
    const dispatch = useDispatch();
  const [profileWindow, setProfileWindow] = useState(false);
  const handleSignOut = async (e) => {
    e.preventDefault();
    await fetch("/api/login/logout",{
      method:"POST",
       headers: {
          "Content-Type": "application/json",
        },
    });
    dispatch(clearUser());
  };

  return (
    <div className="relative">
      <div
        onClick={() => {
          setProfileWindow(!profileWindow);
        }}
        className=" cursor-pointer  rounded-full flex justify-center items-center"
      >
        <img
          src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
          alt=""
          className="w-10 h-10 rounded-full"
        />
      </div>
      {profileWindow && (
        <div className="absolute right-0 text-black gap-2 border-zinc-300 flex flex-col  items-center z-10 rounded-xl w-80 h-50 border mt-5 bg-white">
          <p className="text-lg font-bold mt-10" >
            {" "}
            {"👋 Hii "}
            {user?.name.split(" ")[0]}
          </p>
          <p className="flex gap-2 justify-center items-center text-sm" ><MdOutlineMail />{user.email}</p>
          <button 
            onClick={handleSignOut}
            className="flex gap-1 text-sm items-center mt-8 cursor-pointer" 
          >
            <PiSignOutFill /> Sign Out
          </button>
          
        </div>
      )}
    </div>
  );
};

export default Profile;

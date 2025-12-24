import React from 'react'
import { IoSettingsOutline } from "react-icons/io5";
import { RiShareBoxLine } from "react-icons/ri";
import { AiOutlineFullscreen } from "react-icons/ai";


const Profile_info_section = () => {
  return (
    <div className='w-60 h-7 flex items-center gap-5 pr-4 justify-end text-zinc-300' >
        <div className='cursor-pointer' >
            <AiOutlineFullscreen />
        </div>
        <div className='cursor-pointer' >
            <RiShareBoxLine />
        </div>
        <div className='cursor-pointer' >
         <IoSettingsOutline />
      </div>
      <div className='w-6 h-6 rounded-full bg-white cursor-pointer' >

      </div>
    </div>
  )
}

export default Profile_info_section

import React from 'react'
import { LuUserPen } from "react-icons/lu";
import { MdOutlineVolumeUp } from "react-icons/md";


const Admin_info_section = () => {
  return (
    <div className='w-60 h-8 flex gap-2' >
      <div className='w-10 h-full' >
      </div>
      <div className='flex h-full gap-2 items-center text-sm px-2 rounded-md bg-zinc-800 text-zinc-300 ' >
        <LuUserPen className='text-base text-yellow-500' />
        <p className='overflow-x-scroll max-w-35 no-scrollbar whitespace-nowrap font-semibold ' >
           Aman Nagar
        </p>
        <div className='px-1.5 rounded-sm cursor-pointer py-1.5 hover:bg-zinc-700' >
        <MdOutlineVolumeUp className='' />
        </div>
      </div>
    </div>
  )
}

export default Admin_info_section

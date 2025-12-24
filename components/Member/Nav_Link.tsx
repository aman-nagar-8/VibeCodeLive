"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav_Link = ({icon , title , href , className}:{title:string , className:string , href:string , icon:any}) => {
  const path = usePathname();
  const isActive = path.startsWith(href)
  return (
    <Link
      href={href}
      className={`flex gap-2 items-center text-sm hover:bg-zinc-700 px-3 h-full rounded-sm cursor-pointer ${className}  ${isActive?"font-bold text-zinc-200":""}`}
    >
     {icon}
      <p>{title}</p>
    </Link>
  );
};

export default Nav_Link;

"use client";
import Split from "react-split";
import { io, Socket } from "socket.io-client";
import { RiCodeSSlashLine } from "react-icons/ri";
import { BsClipboard2 } from "react-icons/bs";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { FiUser } from "react-icons/fi";
import { VscComment } from "react-icons/vsc";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { TbNotes } from "react-icons/tb";
import { GoQuestion } from "react-icons/go";
import Nav_Link from "@/components/Member/Nav_Link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { connectSocket, joinMeeting } from "@/lib/socketService";
import { setMeetingId } from "@/store/meetingSlice";
import { useDispatch } from "react-redux";

let socket: Socket | null = null;

const Base = ({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) => {
  const leftNavArray = [
    {
      title: "Code",
      icon: <RiCodeSSlashLine className="text-green-500" />,
      className: "",
      href: "/meeting/member/11/code",
    },
    {
      title: "WhiteBoard",
      icon: <BsClipboard2 className="text-zinc-300 " />,
      className: "",
      href: "/meeting/member/11/whiteboard",
    },
    {
      title: "Resourses",
      icon: <HiOutlineBookOpen className="text-blue-500" />,
      className: "",
      href: "/meeting/member/11/resourses",
    },
    {
      title: "Problems",
      icon: <GoQuestion className="text-red-500" />,
      className: "",
      href: "/meeting/member/11/problems",
    },
  ];

  const rightNavArray = [
    {
      title: "Code",
      icon: <RiCodeSSlashLine className="text-green-500" />,
      className: "",
      href: "/meeting/member/11/user-code",
    },
    {
      title: "Members",
      icon: <FiUser className="text-yellow-500" />,
      className: "",
      href: "/meeting/member/11/members",
    },
    {
      title: "Comments",
      icon: <VscComment className="text-blue-500" />,
      className: "",
      href: "/meeting/member/11/comments",
    },
    {
      title: "Notes",
      icon: <TbNotes className="text-red-500" />,
      className: "",
      href: "/meeting/member/11/notes",
    },
    {
      title: "About",
      icon: <IoIosInformationCircleOutline className="text-[#08b5a6]" />,
      className: "",
      href: "/meeting/member/11/about",
    },
  ];

  // const router = useRouter();
  // const { id } = useParams<{ id: string }>();

  // useEffect(() => {
  //   const token = sessionStorage.getItem("socketAuth");

  //   if (!token) {
  //     router.replace("/meeting/join");
  //     return;
  //   }
  //   console.log(token);
  //   socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  //     transports: ["websocket"],
  //     auth: {
  //       token,
  //     },
  //   });
  //   console.log("socket :", socket);
  //   socket.on("connect", () => {
  //     console.log("🟢 Socket.IO connected");
  //     socket?.emit("join-meeting", { meetingId: id });
  //   });
  //   socket.on("disconnect", () => {
  //     console.log("⚫ Socket.IO disconnected");
  //   });

  //   socket.on("connect_error", (err) => {
  //     console.error("🔴 Socket.IO error:", err.message);
  //   });

  //   return () => {
  //     socket?.disconnect();
  //   };
  // }, [router]);

  // useEffect(() => {
  //   socket?.on("user-joined", (data) => {
  //     console.log("✅ User joined meeting:", data.user);
  //   });
  // }, [socket]);

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("socketAuth");

    if (!token) {
      router.replace("/meeting/join");
      return;
    }

    connectSocket(token);
    dispatch(setMeetingId(id));
    joinMeeting(id);
  }, [id, dispatch, router]);

  return (
    <Split
      className="flex h-full w-full overflow-hidden"
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
      <div className="h-full rounded-lg  flex flex-col overflow-hidden">
        <div className="w-full h-9 bg-[#333333] rounded-t-lg p-1 flex items-center border-x-[0.5px] border-t-[0.5px] border-zinc-600 text-zinc-400 gap-1 overflow-x-scroll no-scrollbar">
          {leftNavArray.map((link, index) => (
            <Nav_Link
              key={index}
              title={link.title}
              icon={link.icon}
              className={link.className}
              href={link.href}
            />
          ))}
        </div>
        <div className="flex-1 min-h-0">{left}</div>
      </div>
      {/* right part */}
      <div className="rounded-lg flex flex-col overflow-hidden h-full">
        <div className="w-full h-9 shrink-0 bg-[#333333] rounded-t-lg p-1 flex items-center border-x-[0.5px] border-t-[0.5px] border-zinc-600 gap-1 overflow-x-scroll no-scrollbar text-zinc-400">
          {rightNavArray.map((link, index) => (
            <Nav_Link
              key={index}
              title={link.title}
              icon={link.icon}
              className={link.className}
              href={link.href}
            />
          ))}
        </div>
        <div className="flex-1 min-h-0">{right}</div>
      </div>
    </Split>
  );
};

export default Base;

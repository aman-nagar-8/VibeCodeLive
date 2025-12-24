import Link from "next/link";
import { useSelector } from "react-redux";
import Profile from "./Profile";

export default function Navbar() {
  const user = useSelector((state) => state.user.user);
  return (
    <nav className="w-full bg-[#eef2e6]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold text-black">
          TechLive
        </Link>
        <div className="flex items-center gap-3 md:gap-8">
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-black text-[16px]">
            <Link className="hover:text-[#1C7262] font-medium" href="/">
              Home
            </Link>
            {!user && (
              <Link className="hover:text-[#1C7262] font-medium" href="/login">
                Login
              </Link>
            )}

            <Link className="hover:text-[#1C7262] font-medium" href="/about">
              About
            </Link>
            <Link className="hover:text-[#1C7262] font-medium" href="/contact">
              Contact
            </Link>
          </div>

          {/* Join Now Button */}
          <Link
            href="/meeting/join"
            className="
            bg-[#1C7262] 
            text-white 
            px-6 
            py-2.5 
            rounded-full 
            font-medium 
            cursor-pointer 
            transition 
            duration-200 
            hover:bg-[#186658]
            active:scale-95
          "
          >
            Join Now
          </Link>
          <Link
            href="/meeting/create"
            className="
            bg-[#1C7262] 
            text-white 
            px-6 
            py-2.5 
            rounded-full 
            font-medium 
            cursor-pointer 
            transition 
            duration-200 
            hover:bg-[#186658]
            active:scale-95
          "
          >
            Start Now
          </Link>
          {user && <Profile user={user} />}
        </div>
      </div>
    </nav>
  );
}

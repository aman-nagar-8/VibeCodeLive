import { SearchArea } from "@/components/joinMeeting/SearchArea";
import { MeetingSection } from "@/components/joinMeeting/MeetingSection";
import Link from "next/link";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-aut px-6 py-2">
        <div className="mb-4 flex ">
          <Link href={"/"} className="text-zinc-700 text-lg font-bold mb-2">VibeCodeLive</Link>
          <div className="flex-1 flex justify-center" >

          <p className="text-zinc-700">Join a Meeting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[33%_67%] gap-8">
          <SearchArea />
          <MeetingSection/>
        </div>
      </div>
    </div>
  );
}

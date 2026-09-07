import { SearchArea } from "@/components/joinMeeting/SearchArea";
import { MeetingSection } from "@/components/joinMeeting/MeetingSection";
import Link from "next/link";
import Footer from "@/components/Footer.jsx"
import Navbar from "@/components/Navbar.jsx"

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-aut px-6 pt-2 pb-15">

        <div className="grid grid-cols-1 lg:grid-cols-[33%_67%] gap-8">
          <SearchArea />
          <MeetingSection/>
        </div>
      </div>
      <Footer />
    </div>
  );
}

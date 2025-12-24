"use client";
import { Search } from "lucide-react";
import { MeetingSuggestions } from "./MeetingSuggestions";
import { EmptyState } from "@/components/joinMeeting/EmptyState";
import { Activity } from "react";
import { useState } from "react";

export function SearchArea() {
  const [searchQuery, setSearchQuery] = useState("");
  const [resultMeeting, setresultMeeting] = useState([]);

  const searchMeeting = async () => {
    if (!searchQuery.trim()) {
      return;
    }
    try {
      const res = await fetch("/api/meeting/getCurrentMeeting", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();

      if (!data.success) {
        return;
      }
      setresultMeeting(data.result);
    } catch (error) {
      console.log("error : ", error);
      return;
    }
  };

  const showSuggestions = searchQuery.trim() && resultMeeting.length > 0;
  const showNoResults = searchQuery.trim() && resultMeeting.length === 0;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative">
          <Search
            onClick={() => {
              searchMeeting();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a meeting..."
            className="w-full pl-12 pr-4 py-4 bg-white border text-gray-700 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
          />
        </div>

        {showSuggestions && <MeetingSuggestions meetings={resultMeeting} />}

        {showNoResults && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-gray-200 rounded-xl shadow-lg">
            <p className="text-gray-500 text-center">No meetings found</p>
          </div>
        )}
      </div>

      {/* {!selectedMeeting && <EmptyState />} */}
      <EmptyState />
    </div>
  );
}

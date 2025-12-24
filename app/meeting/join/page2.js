"use client";
import { div } from "framer-motion/m";
import React from "react";
import { useState, useEffect } from "react";

const Join = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const searchQuery = async () => {
    if (!query.trim()) {
      return;
    }
    try {
      const res = await fetch("/api/meeting/getCurrentMeeting", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({query}),
      });

      const data = await res.json();
      
    //   if (!data.success) {
    //     return;
    //   }
      setSuggestions(data.result);
      console.log("data.result" , data.result[0] )
      console.log("suggestion : ", suggestions)
    } catch (error) {
        console.log("error : " , error)
        return;
    }

};
const [selectedMeeting , setSelectedMeeting] = useState({});
  return (
    <div className="w-screen h-screen bg-[#4b8f89] flex">
      {/* left  */}
      <div className=" pt-20 pl-20 w-1/2 h-full ">
        <div className=" flex gap-2 mb-10">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className="w-100 h-10 px-4 rounded-2xl bg-white text-black "
          />
          <button
            onClick={searchQuery}
            className="bg-blue-600 rounded-lg px-3 py-1 cursor-pointer "
          >
            Search
          </button>
        </div>

        <div className="w-100 py-5 flex flex-col gap-3 bg-white text-black rounded-2xl px-3">
          {suggestions.map((sugg , index)=>(
            <div key={index} onClick={()=>{setSelectedMeeting(sugg)}} className="py-1 hover:bg-zinc-300 cursor-pointer pl-2 rounded-lg" >
             {sugg.name}
            </div>
          ))}
        </div>
      </div>
      {/* right */}
      <div className="flex-1 flex justify-center h-full border">
        <div className="mt-20 w-100 h-50 text-white bg-zinc-200" >
            <p>{selectedMeeting?.name}</p>
            <p>{selectedMeeting?.url}</p>

        </div>
      </div>
    </div>
  );
};

export default Join;

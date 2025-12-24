"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Api from "@/lib/apiClient";

export default function CreateMeetingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    url: "",
    duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // const res = await fetch("/api/createmeeting", {
    //   method: "POST",
    //   credentials: "include",
    //   body: JSON.stringify(form),
    // });

    const res =  await Api.post("/createMeeting" , form);

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      setMessage(data.error);
    } 

   if(data.success){
      setMessage("Meeting created successfully!");
      console.log("Created meeting data:", data);
      router.push(
        `/meeting/admin/${data.meeting._id}?token=${data.socketAuth}&meeting=${data.meeting._id}`
      );
   }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-8 shadow-xl backdrop-blur">
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            Create Meeting
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Meeting Name */}
            <div>
              <label className="block text-sm text-zinc-300 mb-1">
                Meeting Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter meeting name"
                className="w-full bg-zinc-800 text-white rounded-lg border border-zinc-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Temporary URL */}
            <div>
              <label className="block text-sm text-zinc-300 mb-1">
                Meeting URL
              </label>
              <input
                type="text"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="Enter temporary URL"
                className="w-full bg-zinc-800 text-white rounded-lg border border-zinc-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 transition text-white rounded-lg py-2.5 mt-3 font-medium"
            >
              {loading ? "Creating..." : "Create Meeting"}
            </button>
          </form>

          {message && (
            <p className="text-center text-sm text-blue-400 mt-4">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
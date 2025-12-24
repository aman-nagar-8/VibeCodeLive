// File: pages/meetings/join/[id].tsx
// Next.js (Pages router) React component for joining a meeting.
// Usage: /meetings/join/<meetingId>?url=<meetingUrl>

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";


export default function JoinMeetingPage() {
  const router = useRouter();
  // const { id } = router.query; // meeting id from URL
  // const queryUrl = (typeof router.query.url === 'string') ? router.query.url : '';

  const [meetingUrl, setMeetingUrl] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [info, setInfo] = useState();

  async function handleJoin(e) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!meetingUrl) {
      setError("Please provide the meeting URL.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/joinmeeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingUrl, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to join meeting");
        setLoading(false);
        return;
      }

      setInfo(data?.message || "Successfully joined the meeting");
      console.log("data", data);
      

      // const socket = connectSocket(data.socketAuth);
      // socket.on("connect", () => {
      //   console.log("🔥 Socket Connected:", socket.id);

      //   console.log("meetingId to join:", data.meetingId);
      //   socket.emit("join-meeting", data.meetingId , (ack) => {
      //     console.log("Join meeting ack:", ack);
      //   });
      // });

      // socket.on("connect_error", (err) => {
      //   console.log("❌ Socket error:", err.message);
      // });

      router.push(
        `/meeting/member/${data.meetingId}?token=${data.socketAuth}&meeting=${data.meetingId}`
      );


      //  router.push(
      //   `/meeting?token=${data.socketAuth}&meeting=${data.meetingId}`
      // );




      // API returns whether password verification was possible/required.
      // if (data.passwordVerified === true) {
      //   // Proceed to meeting room (you can change this route to your meeting room page)
      //   router.push(`/meetings/room/${encodeURIComponent(data.sessionId || id)}`);
      // } else {
      //   // Password is not stored/verified on server yet — show informative message.
      //   setInfo('Password verification is not implemented on the server yet. You provided the password; the backend will verify it later.');
      //   // Optionally redirect to meeting room anyway if your downstream service uses the provided password
      //   // router.push(`/meetings/room/${encodeURIComponent(data.sessionId || id)}?pw=${encodeURIComponent(password)}`)
      // }
    } catch (err) {
      setError(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Join Meeting</h1>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Meeting URL</label>
            <input
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="https://your-meeting-host/room/abcd"
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-700 text-gray-100 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Meeting password (if any)"
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-700 text-gray-100 px-3 py-2"
            />
            <p className="text-xs mt-1 text-gray-400">
              We do not store the password in the database right now.
            </p>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          {info && <div className="text-green-700 text-sm">{info}</div>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join"}
            </button>

            <button
              type="button"
              onClick={() => {
                setPassword("");
                setError(null);
                setInfo(null);
              }}
              className="text-sm text-gray-300"
            >
              Clear
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-400">
          Tip: You can pass the meeting URL as a query param:{" "}
          <code>?url=https://example.com/room/abc</code>
        </div>
      </div>
    </div>
  );
}
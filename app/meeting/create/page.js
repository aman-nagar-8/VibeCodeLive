"use client";
import { useState } from "react";
import Api from "@/lib/apiClient";
import { ca } from "zod/v4/locales";

export default function CreateMeeting() {
  const [meetingName, setMeetingName] = useState("");
  const [meetingURL, setMeetingURL] = useState("");
  const [joinPolicy, setJoinPolicy] = useState("both");
  const [status, setStatus] = useState("scheduled");
  const [requiredField, setRequiredField] = useState("");
  const [requiredFields, setRequiredFields] = useState([]);
  const [message, setmessage] = useState("")

  const addField = () => {
    if (
      requiredField.trim() &&
      !requiredFields.includes(requiredField.trim())
    ) {
      setRequiredFields([...requiredFields, requiredField.trim()]);
      setRequiredField("");
    }
  };

  const removeField = (field) => {
    setRequiredFields(requiredFields.filter((f) => f !== field));
  };

  const handleCreateMeeting = () => {
    if (!meetingName.trim() || !meetingURL.trim()) {
      return;
    }
    try {
      const res = Api.post("/createmeeting", {
        name: meetingName,
        url: meetingURL,
        joinPolicy:
          joinPolicy === "auth"
            ? "AUTH_ONLY"
            : joinPolicy === "guest"
            ? "GUEST_ONLY"
            : "BOTH",
        status: status,
        requiredFields: requiredFields,
      });
        const data = res.data;
        setmessage("Meeting created successfully! Redirecting...");

    } catch (error) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl shadow-xl p-8 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-white">
            Create a New Meeting
          </h2>
          <p className="text-sm text-zinc-400">
            Configure how users can join and what information is required.
          </p>
        </div>

        {/* Meeting Name */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Meeting Name</label>
          <input
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            placeholder="Team Standup / DSA Session"
            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Meeting URL */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Meeting URL</label>
          <input
            value={meetingURL}
            onChange={(e) => setMeetingURL(e.target.value)}
            placeholder="team-standup-2025"
            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Join Policy */}
        <div className="space-y-3">
          <label className="text-sm text-zinc-300">Join Policy</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "auth", label: "Authenticated" },
              { id: "guest", label: "Guest" },
              { id: "both", label: "Both" },
            ].map((policy) => (
              <button
                key={policy.id}
                onClick={() => setJoinPolicy(policy.id)}
                className={`rounded-xl px-4 py-3 text-sm border transition-all
                  ${
                    joinPolicy === policy.id
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
              >
                {policy.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="space-y-3">
          <label className="text-sm text-zinc-300">Meeting Status</label>
          <div className="flex gap-3">
            {["scheduled", "live"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-5 py-2 rounded-full text-sm border transition-all
                  ${
                    status === s
                      ? "bg-blue-500/10 border-blue-500 text-blue-400"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
              >
                {s === "scheduled" ? "Scheduled" : "Live"}
              </button>
            ))}
          </div>
        </div>

        {/* Required Fields */}
        <div className="space-y-3">
          <label className="text-sm text-zinc-300">Required Fields</label>

          <div className="flex gap-2">
            <input
              value={requiredField}
              onChange={(e) => setRequiredField(e.target.value)}
              placeholder="Roll Number / Email ID"
              className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => e.key === "Enter" && addField()}
            />
            <button
              onClick={addField}
              className="rounded-xl px-4 py-3 bg-purple-500/10 border border-purple-500 text-purple-400 hover:bg-purple-500/20 transition"
            >
              Add
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {requiredFields.map((field) => (
              <span
                key={field}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-200 text-xs"
              >
                {field}
                <button
                  onClick={() => removeField(field)}
                  className="text-zinc-400 hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => handleCreateMeeting()}
          className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-medium text-black hover:bg-emerald-400 transition"
        >
          Create Meeting
        </button>
      </div>
    </div>
  );
}

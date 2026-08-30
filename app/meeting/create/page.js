"use client";

import { useState } from "react";
import Api from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";

export default function CreateMeeting() {
  const [meetingName, setMeetingName] = useState("");
  const [meetingURL, setMeetingURL] = useState("");
  const [joinPolicy, setJoinPolicy] = useState("both");
  const [status, setStatus] = useState("scheduled");
  const [requiredField, setRequiredField] = useState("");
  const [requiredFields, setRequiredFields] = useState([]);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const addField = () => {
    const field = requiredField.trim();

    if (field && !requiredFields.includes(field)) {
      setRequiredFields([...requiredFields, field]);
      setRequiredField("");
    }
  };

  const removeField = (field) => {
    setRequiredFields(requiredFields.filter((f) => f !== field));
  };

  const handleCreateMeeting = async () => {
    if (!meetingName.trim()) {
      setMessage("Please enter a meeting name.");
      return;
    }

    try {
      const res = await Api.post("/createmeeting", {
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

      console.log("Create Meeting Response:", data);

      if (data.success) {
        setMessage(data.message || "Meeting created successfully.");

        sessionStorage.setItem("socketAuth", data.socketAuth);

        setTimeout(() => {
          router.push(`/meeting/admin/${data.meeting.url}`);
        }, 2000);
      } else {
        setMessage(data.message || "Unable to create meeting.");
      }
    } catch (error) {
      setMessage("An error occurred while creating the meeting.");

      console.error("Create Meeting Error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef2e6] text-[#1C7262] ">
      {/* Navbar  */}
      <Navbar />
      {/* Page Container */}
      <div className="mx-auto mt-10 mb-20 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#1C7262]/60">
              Meeting Manager
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Create a meeting
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#1C7262]/65">
              Set up your meeting, choose who can join, and collect the
              information you need from participants.
            </p>
          </div>

          <div className="hidden rounded-full border border-[#1C7262]/15 bg-white/50 px-4 py-2 text-xs font-medium md:block">
            New Meeting
          </div>
        </div>

        {/* Main Card */}
        <div className="grid overflow-hidden rounded-[32px] border border-[#1C7262]/10 bg-white/45 shadow-[0_20px_60px_rgba(28,114,98,0.08)] backdrop-blur-xl lg:grid-cols-[0.8fr_1.2fr]">
          {/* =========================================
              LEFT INFORMATION PANEL
          ========================================= */}
          <section className="relative overflow-hidden bg-[#1C7262] p-8 text-[#eef2e6] md:p-10 lg:p-12">
            {/* Decorative Circle */}
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[40px] border-[#eef2e6]/5" />

            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#eef2e6]/5" />

            <div className="relative z-10 flex h-full flex-col">
              {/* Icon */}
              <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef2e6]/10 text-2xl">
                +
              </div>

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#eef2e6]/55">
                Setup
              </p>

              <h2 className="max-w-sm text-3xl font-bold leading-tight md:text-4xl">
                Everything you need for a smooth meeting.
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-[#eef2e6]/65">
                Configure access, meeting details and participant requirements
                before you start.
              </p>

              {/* Features */}
              <div className="mt-12 space-y-5">
                <Feature
                  number="01"
                  title="Choose access"
                  description="Control who can join your meeting."
                />

                <Feature
                  number="02"
                  title="Set requirements"
                  description="Collect information from participants."
                />

                <Feature
                  number="03"
                  title="Start your room"
                  description="Create the meeting and enter instantly."
                />
              </div>

              {/* Bottom */}
              <div className="mt-auto hidden pt-12 lg:block">
                <div className="border-t border-[#eef2e6]/10 pt-6">
                  <p className="text-xs text-[#eef2e6]/45">
                    Your meeting settings can be configured before participants
                    join.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================
              RIGHT FORM
          ========================================= */}
          <section className="p-7 md:p-10 lg:p-12">
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#1C7262]/50">
                Meeting details
              </p>

              <h2 className="text-2xl font-bold text-[#1C7262]">
                Configure your meeting
              </h2>
            </div>

            {/* Meeting Name */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-[#1C7262]">
                Meeting Name
              </label>

              <input
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                placeholder="Team Standup / DSA Session"
                className="w-full rounded-2xl border border-[#1C7262]/15 bg-[#eef2e6]/60 px-4 py-3.5 text-sm text-[#1C7262] outline-none transition placeholder:text-[#1C7262]/30 focus:border-[#1C7262] focus:bg-white"
              />
            </div>

            {/* Meeting URL */}
            <div className="mb-7">
              <label className="mb-2 block text-sm font-semibold text-[#1C7262]">
                Meeting URL
              </label>

              <div className="flex overflow-hidden rounded-2xl border border-[#1C7262]/15 bg-[#eef2e6]/60 focus-within:border-[#1C7262] focus-within:bg-white">
                <div className="flex items-center border-r border-[#1C7262]/10 px-4 text-sm text-[#1C7262]/40">
                  /meeting/
                </div>

                <input
                  value={meetingURL}
                  onChange={(e) => setMeetingURL(e.target.value)}
                  placeholder="team-standup"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-[#1C7262] outline-none placeholder:text-[#1C7262]/30"
                />
              </div>

              <p className="mt-2 text-xs text-[#1C7262]/40">
                Use a short and memorable URL.
              </p>
            </div>

            {/* Join Policy */}
            <div className="mb-7">
              <label className="mb-3 block text-sm font-semibold text-[#1C7262]">
                Who can join?
              </label>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  {
                    id: "auth",
                    label: "Authenticated",
                    description: "Signed-in users",
                  },
                  {
                    id: "guest",
                    label: "Guest",
                    description: "Anyone with link",
                  },
                  {
                    id: "both",
                    label: "Everyone",
                    description: "Both options",
                  },
                ].map((policy) => (
                  <button
                    key={policy.id}
                    type="button"
                    onClick={() => setJoinPolicy(policy.id)}
                    className={`
                      rounded-2xl border p-4 text-left transition-all
                      ${
                        joinPolicy === policy.id
                          ? "border-[#1C7262] bg-[#1C7262] text-[#eef2e6] shadow-lg shadow-[#1C7262]/10"
                          : "border-[#1C7262]/10 bg-[#eef2e6]/40 text-[#1C7262] hover:border-[#1C7262]/30 hover:bg-[#eef2e6]"
                      }
                    `}
                  >
                    <div className="mb-1 text-sm font-semibold">
                      {policy.label}
                    </div>

                    <div
                      className={
                        joinPolicy === policy.id
                          ? "text-xs text-[#eef2e6]/60"
                          : "text-xs text-[#1C7262]/45"
                      }
                    >
                      {policy.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="mb-7">
              <label className="mb-3 block text-sm font-semibold text-[#1C7262]">
                Meeting Status
              </label>

              <div className="inline-flex rounded-full border border-[#1C7262]/10 bg-[#eef2e6]/60 p-1">
                {[
                  {
                    id: "scheduled",
                    label: "Scheduled",
                  },
                  {
                    id: "live",
                    label: "Live",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStatus(item.id)}
                    className={`
                      rounded-full px-5 py-2 text-sm font-medium transition
                      ${
                        status === item.id
                          ? "bg-[#1C7262] text-[#eef2e6] shadow-sm"
                          : "text-[#1C7262]/50 hover:text-[#1C7262]"
                      }
                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Required Fields */}
            <div className="mb-7">
              <div className="mb-3">
                <label className="block text-sm font-semibold text-[#1C7262]">
                  Required Fields
                </label>

                <p className="mt-1 text-xs text-[#1C7262]/40">
                  Ask participants for additional information.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  value={requiredField}
                  onChange={(e) => setRequiredField(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addField();
                    }
                  }}
                  placeholder="Roll Number / Email ID"
                  className="min-w-0 flex-1 rounded-2xl border border-[#1C7262]/15 bg-[#eef2e6]/60 px-4 py-3.5 text-sm text-[#1C7262] outline-none placeholder:text-[#1C7262]/30 focus:border-[#1C7262] focus:bg-white"
                />

                <button
                  type="button"
                  onClick={addField}
                  className="rounded-2xl bg-[#1C7262] px-5 text-sm font-semibold text-[#eef2e6] transition hover:bg-[#155d50]"
                >
                  Add
                </button>
              </div>

              {/* Tags */}
              {requiredFields.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {requiredFields.map((field) => (
                    <div
                      key={field}
                      className="flex items-center gap-2 rounded-full border border-[#1C7262]/10 bg-[#eef2e6] px-3.5 py-2 text-xs font-medium text-[#1C7262]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1C7262]" />

                      {field}

                      <button
                        type="button"
                        onClick={() => removeField(field)}
                        className="ml-1 text-[#1C7262]/40 transition hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div
                className={`
                  mb-5 rounded-2xl px-4 py-3 text-sm
                  ${
                    message.includes("successfully")
                      ? "bg-[#1C7262]/10 text-[#1C7262]"
                      : "bg-red-50 text-red-600"
                  }
                `}
              >
                {message}
              </div>
            )}

            {/* Divider */}
            <div className="mb-5 border-t border-[#1C7262]/10" />

            {/* Create Button */}
            <button
              type="button"
              onClick={handleCreateMeeting}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1C7262] py-4 text-sm font-semibold text-[#eef2e6] shadow-lg shadow-[#1C7262]/15 transition-all hover:-translate-y-0.5 hover:bg-[#155d50] hover:shadow-xl"
            >
              Create Meeting
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>

            <p className="mt-3 text-center text-xs text-[#1C7262]/35">
              You can manage your meeting after creation.
            </p>
          </section>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </main>
  );
}

/* =========================================
   Feature Component
========================================= */

function Feature({ number, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#eef2e6]/15 text-[10px] font-bold text-[#eef2e6]/50">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-semibold">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-[#eef2e6]/50">
          {description}
        </p>
      </div>
    </div>
  );
}

"use client";

import { io } from "socket.io-client";
import { buildSessionSummary } from "@/lib/sessionSummary"; // adjust path

// ─────────────────────────────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────────────────────────────
const SOCKET_URL = "http://localhost:3001"; // 👈 your socket server URL
const USE_DEMO_MODE = true;                 // 👈 flip to false when ready for real AI + socket

// ─────────────────────────────────────────────────────────────────
//  Socket singleton — one connection shared across calls
// ─────────────────────────────────────────────────────────────────
let socket = null;

function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () =>
      console.log("[Socket] Connected:", socket.id)
    );
    socket.on("connect_error", (err) =>
      console.warn("[Socket] Connection error:", err.message)
    );
  }
  return socket;
}

// ─────────────────────────────────────────────────────────────────
//  DEMO: mock AI response based on flags
//  Produces realistic-looking output without hitting Claude API
// ─────────────────────────────────────────────────────────────────
function mockAIResponse(summary) {
  const flagTypes = summary.flags.map((f) => f.type);
  const score = Math.max(10, summary.engagementScore);

  // pick label based on dominant flags
  let label = "On track";
  if (
    flagTypes.includes("MATCHES_REFERENCE_SOLUTION") ||
    flagTypes.includes("ZERO_KEYSTROKE_RATIO") ||
    flagTypes.includes("LARGE_PASTE_DETECTED")
  ) {
    label = "Suspected copy-paste";
  } else if (
    flagTypes.includes("NOT_STARTED") ||
    flagTypes.includes("IDLE_TOO_LONG")
  ) {
    label = "Needs attention";
  } else if (
    flagTypes.includes("SAME_ERROR_REPEATED") ||
    flagTypes.includes("HIGH_ERROR_RATE") ||
    flagTypes.includes("STUCK_ON_LINE")
  ) {
    label = "Struggling";
  }

  // build flag explanations
  const flagsExplained = summary.flags.map((f) => ({
    flag: f.type,
    insight: demoInsight(f.type, f.detail),
  }));

  // build summary text
  const summaryText = buildDemoSummary(label, summary);

  // suggested action
  const suggestedAction = demoAction(label, flagTypes);

  return { score, label, summary: summaryText, flags_explained: flagsExplained, suggested_action: suggestedAction };
}

function demoInsight(type, detail) {
  const map = {
    NOT_STARTED: "Student has not written any code yet — may need a prompt to begin.",
    IDLE_TOO_LONG: `Student was idle for ${detail?.idleMinutes ?? 3}+ minutes — possibly stuck or distracted.`,
    STUCK_ON_LINE: `Cursor stayed on line ${detail?.line ?? "?"} through many edits — student may not understand the syntax here.`,
    CODE_NOT_GROWING: "Line count hasn't increased in a while — no meaningful progress being made.",
    LARGE_PASTE_DETECTED: `${detail?.charCount ?? 50}+ characters pasted at once — check if this is self-written code.`,
    ZERO_KEYSTROKE_RATIO: "Code appeared with very few keystrokes — strong indicator of copy-paste.",
    SAME_ERROR_REPEATED: `Same error seen ${detail?.times ?? 3} times in a row — student is not understanding how to fix it.`,
    HIGH_ERROR_RATE: `${detail?.totalErrors ?? 5} errors this session — student is struggling with syntax or logic.`,
    HIGH_BACKSPACE_RATIO: `${Math.round((detail?.ratio ?? 0.4) * 100)}% of keystrokes were backspaces — lots of typo corrections.`,
    FREQUENT_TAB_SWITCHES: `Switched away from editor ${detail?.count ?? 3} times — may be looking up answers externally.`,
    MATCHES_REFERENCE_SOLUTION: `Code is ${Math.round((detail?.similarityScore ?? 0.85) * 100)}% similar to the model answer.`,
  };
  return map[type] ?? "Unusual behaviour detected.";
}

function buildDemoSummary(label, summary) {
  const { sessionDurationMinutes } = summary.meta;
  const { runAttempts, totalErrors, pasteCount } = summary.behavior;

  if (label === "Suspected copy-paste") {
    return `Student submitted code after ${sessionDurationMinutes} minutes with very few keystrokes and ${pasteCount} paste event(s). The final code closely matches the reference solution. Independent effort is questionable — review with the student directly.`;
  }
  if (label === "Needs attention") {
    return `Student has been in the session for ${sessionDurationMinutes} minutes but shows little active engagement. They may be stuck on where to start or have lost focus. A quick check-in is recommended.`;
  }
  if (label === "Struggling") {
    return `Student ran the code ${runAttempts} time(s) and hit ${totalErrors} error(s) this session. They appear to be stuck on the same issue repeatedly. Consider nudging them toward the relevant concept or offering a hint.`;
  }
  return `Student is actively working — ${runAttempts} run(s), ${totalErrors} error(s) over ${sessionDurationMinutes} minutes. No major concerns flagged. Keep monitoring.`;
}

function demoAction(label, flagTypes) {
  if (label === "Suspected copy-paste") return "Open a 1-on-1 conversation and ask the student to explain their code line by line.";
  if (label === "Needs attention") return "Send a soft nudge message: 'Have you started yet? Let me know if you need help getting going.'";
  if (label === "Struggling") {
    if (flagTypes.includes("SAME_ERROR_REPEATED")) return "Share a hint pointing to the specific error type they keep hitting.";
    return "Break the problem into smaller steps and guide the student through the first one.";
  }
  return "No action needed — continue monitoring.";
}

// ─────────────────────────────────────────────────────────────────
//  MAIN: sendSnapshot
//
//  Call this from your editor page after runCode(), on tab switch,
//  or on a 5-minute timer.
//
//  Usage:
//    import { sendSnapshot } from "@/lib/snapshotSender";
//    await sendSnapshot({ getReport, code: Code, output: Output, studentName: "Riya" });
// ─────────────────────────────────────────────────────────────────
export async function sendSnapshot({ getReport, code, output, studentName = "Student", assignmentId }) {
  try {
    const report = getReport();
    const summary = buildSessionSummary({
      report,
      code,
      output,
      studentName,
    });

    let aiResult;

    if (USE_DEMO_MODE) {
      // ── DEMO: generate mock AI response locally ─────────────────
      console.log("[Demo] Session summary built:", summary);
      aiResult = mockAIResponse(summary);
      console.log("[Demo] Mock AI response:", aiResult);
    } else {
      // ── REAL: call your backend which calls Claude ───────────────
      const res = await fetch("/api/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report,
          code,
          output,
          studentName,
        }),
      });
      const data = await res.json();
      aiResult = data.snapshot; // backend already emits via server socket
      return data;              // backend handles socket emit — we're done
    }

    // ── Build the teacher snapshot object ─────────────────────────
    const teacherSnapshot = {
      studentId: summary.meta.studentId,
      studentName: summary.meta.studentName,
      assignmentId: summary.meta.assignmentId ?? assignmentId,
      generatedAt: summary.meta.generatedAt,

      score: aiResult.score,
      label: aiResult.label,
      summary: aiResult.summary,
      flagsExplained: aiResult.flags_explained ?? [],
      suggestedAction: aiResult.suggested_action ?? "",

      behavior: summary.behavior,
      engagementScore: summary.engagementScore,
      flagCount: summary.flags.length,

      finalCode: summary.code.final,
      lastOutput: summary.code.outputOnLastRun,
    };

    // ── Emit directly from browser to your socket server ─────────
    if (USE_DEMO_MODE) {
      const sock = getSocket();

      // join the student room so server can track who is online
      sock.emit("join_student_room", {
        studentId: summary.meta.studentId,
        assignmentId: summary.meta.assignmentId ?? assignmentId,
      });

      // emit the snapshot — your socket server forwards this to the teacher room
      sock.emit("student_snapshot", teacherSnapshot);

      console.log("[Demo] Snapshot emitted to socket server:", teacherSnapshot);
    }

    return { ok: true, snapshot: teacherSnapshot };
  } catch (err) {
    console.error("[sendSnapshot] Error:", err);
    return { ok: false, error: err.message };
  }
}
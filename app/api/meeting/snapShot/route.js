// app/api/snapshot/route.js  (Next.js App Router)
// ─────────────────────────────────────────────────────────────────
// POST /api/snapshot
// Body: { report, code, output, studentName }
//
// 1. Builds structured session summary
// 2. Calls Claude AI → gets scored snapshot
// 3. Emits snapshot to teacher room via Socket.IO
// ─────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { buildSessionSummary, buildAIPrompt } from "@/utils/sessionSummary"; // adjust path
// import { getSocketServer } from "@/lib/socket"; // have to be updated cause it is not in same folder                            // adjust path

export async function POST(req) {
  try {
    const body = await req.json();
    const { report, code, output, studentName } = body;

    if (!report || !code) {
      return NextResponse.json({ error: "Missing report or code" }, { status: 400 });
    }

    // ── Step 1: Build the structured summary ─────────────────────
    // const summary = buildSessionSummary({ report, code, output, studentName });

    // ── Step 2: Call Claude API ───────────────────────────────────
    // const aiPrompt = buildAIPrompt(summary);

    // const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "x-api-key": process.env.ANTHROPIC_API_KEY,
    //     "anthropic-version": "2023-06-01",
    //   },
    //   body: JSON.stringify({
    //     model: "claude-sonnet-4-20250514",
    //     max_tokens: 1000,
    //     messages: [{ role: "user", content: aiPrompt }],
    //   }),
    // });

    // if (!aiResponse.ok) {
    //   const err = await aiResponse.text();
    //   throw new Error(`Claude API error: ${err}`);
    // }

    // const aiData = await aiResponse.json();
    // const rawText = aiData.content?.[0]?.text ?? "{}";

    // ── Step 3: Parse AI JSON safely ─────────────────────────────
    // let aiResult;
    // try {
    //   aiResult = JSON.parse(rawText);
    // } catch {
    //   // AI returned text outside JSON — extract JSON block
    //   const match = rawText.match(/\{[\s\S]*\}/);
    //   aiResult = match ? JSON.parse(match[0]) : { score: 0, label: "Error", summary: rawText };
    // }

    // ── Step 4: Build the final teacher snapshot ──────────────────
    // const teacherSnapshot = {
    //   // identity
    //   studentId: summary.meta.studentId,
    //   studentName: summary.meta.studentName,
    //   assignmentId: summary.meta.assignmentId,
    //   generatedAt: summary.meta.generatedAt,

    //   // AI output
    //   score: aiResult.score,
    //   label: aiResult.label,
    //   summary: aiResult.summary,
    //   flagsExplained: aiResult.flags_explained ?? [],
    //   suggestedAction: aiResult.suggested_action ?? "",

    //   // raw signals (so teacher dashboard can show charts)
    //   behavior: summary.behavior,
    //   engagementScore: summary.engagementScore,
    //   flagCount: summary.flags.length,

    //   // code (optional — remove if you don't want to send full code)
    //   finalCode: summary.code.final,
    //   lastOutput: summary.code.outputOnLastRun,
    // };

   const demoTeacherSnapshot = {
  // identity
  studentId: "stu_1023",
  studentName: "Aman Verma",
  assignmentId: "assign_js_01",
  generatedAt: "2026-04-18T18:20:00Z",

  // AI output
  score: 72,
  label: "Moderate Risk",
  summary:
    "The student submitted a correct solution using built-in methods but shows signs of copy-pasting and limited problem-solving depth.",
  flagsExplained: [
    "Copy-paste detected during early coding phase",
    "Low typing activity compared to solution complexity",
    "Solution executed successfully with correct output",
    "No syntax errors found",
    "Minimal iteration before submission"
  ],
  suggestedAction:
    "Ask the student to explain the logic step-by-step or rewrite without using built-in reverse method.",

  // raw signals (so teacher dashboard can show charts)
  behavior: {
    typingSpeed: 12, // chars/sec
    pasteCount: 2,
    backspaceCount: 5,
    idleTime: 18, // seconds
    activeTime: 42, // seconds
    runCount: 1,
    errorCount: 0
  },
  engagementScore: 65,
  flagCount: 2,

  // code (optional — remove if you don't want to send full code)
  finalCode: "function reverseString(str){ return str.split('').reverse().join(''); }",
  lastOutput: "olleh"
};


    // ── Step 5: Emit to teacher via Socket.IO ─────────────────────
    // const io = getSocketServer();
    // if (io) {
    //   // Teacher joins room: `teacher_<assignmentId>`
    //   io.to(`teacher_${summary.meta.assignmentId}`).emit(
    //     "student_snapshot",
    //     teacherSnapshot
    //   );
    // }

    return NextResponse.json({ ok: true, snapshot: demoTeacherSnapshot });
  } catch (err) {
    console.error("[/api/snapshot]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
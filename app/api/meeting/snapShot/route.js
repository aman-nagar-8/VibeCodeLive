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
import { buildBehaviorContext , analyzeWithClaude } from "./util"; // adjust path
// import { getSocketServer } from "@/lib/socket"; // have to be updated cause it is not in same folder                            // adjust path

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Extract data from request body

    const {
      studentId,
      studentName,
      assignmentId,
      sessionDurationMs,
      keystrokes,
      backspaces,
      backspaceRatio,
      pasteEvents,
      runAttempts,
      totalErrors,
      flags,
      codeSnapshots,
      outputHistory,
      latestOutput,
      code,
    } = body;


      // Step 2  Build the summary point from flags, behavior, code, output, and student info
  const { status, label, contextLines } = buildBehaviorContext(body);

  // Step 3 analyze code , output for given assignment using claude API and get a score and label
  // const aiResult = await analyzeWithClaude(
  //   studentName, assignmentId, contextLines, code, latestOutput
  // );


  const aiResult = [{
  "score": 68,
  "summary": {
    "whatStudentDid": "The student wrote a partial solution, tested the program multiple times, and made incremental progress on the assignment.",
    "struggling": "The student appears to be struggling with debugging logic errors and maintaining focus due to several tab switches.",
    "doingWell": "The student is actively coding and attempting to validate their solution through repeated execution.",
    "suspiciousBehavior": null,
    "adviceForTeacher": "Check whether the student understands the core algorithm and encourage them to debug step-by-step."
  }
},{
  "score": 24,
  "summary": {
    "whatStudentDid": "The student opened the assignment but wrote very little original code and remained mostly inactive.",
    "struggling": "The student does not appear to understand how to begin the assignment.",
    "doingWell": null,
    "suspiciousBehavior": "Frequent tab switching and sudden pasted code suggest possible copying from external sources.",
    "adviceForTeacher": "Consider checking in directly with the student to assess understanding and verify authorship of the code."
  }
},{
  "score": 91,
  "summary": {
    "whatStudentDid": "The student completed the assignment with clean code and successful program output after consistent development activity.",
    "struggling": null,
    "doingWell": "The student demonstrated strong problem-solving habits by iteratively testing and refining the solution.",
    "suspiciousBehavior": null,
    "adviceForTeacher": "The student appears confident and engaged, so a quick review of code quality and optimization may be beneficial."
  }
}]

  // Step 4 Build the final snapshot object to be sent to teacher dashboard
  const snapshot = {
    studentId,
    studentName: studentName ?? 'Unknown',
    assignmentId,
    status,
    label,
    contextLines,
    score: aiResult.score,
    summary: aiResult.summary,
    generatedAt: new Date().toISOString()
  };

    // 5. Emit the snapshot to teacher dashboard via Socket.IO

    // Snapshot structure expected by teacher dashboard (example):

    // status : activity status of student at the time of snapshot like "coding", "idle", "debugging" etc
    // studentId: unique identifier for the student
    // studentName: name of the student
    // score : a score from 0-100 indicating how well the student is doing based on AI analysis
    // label : label based on the flags and behavior like "copy-pasting", "struggling", "tab-switching", "idle for long" etc
    // summary : five points summary :
    // - what the student did
    // - what the student is struggling with (if applicable)
    // - what the student is doing well (if applicable)
    // - any suspicious behavior detected (if applicable)
    // - advice for the teacher on how to help the student (if applicable);

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
        "Minimal iteration before submission",
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
        errorCount: 0,
      },
      engagementScore: 65,
      flagCount: 2,

      // code (optional — remove if you don't want to send full code)
      finalCode:
        "function reverseString(str){ return str.split('').reverse().join(''); }",
      lastOutput: "olleh",
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

    return NextResponse.json({ ok: true, snapshot: snapshot });
  } catch (err) {
    console.error("[/api/snapshot]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// ─────────────────────────────────────────────────────────────────
//  FLAG_META
//  One-line context string for each flag type — used by the AI
//  to understand what each flag means without extra explanation.
// ─────────────────────────────────────────────────────────────────
export const FLAG_META = {
  NOT_STARTED:
    "Student opened the assignment but wrote zero code for 5+ minutes.",
  IDLE_TOO_LONG:
    "Student stopped typing for 3+ minutes mid-session — possibly stuck or distracted.",
  STUCK_ON_LINE:
    "Student's cursor stayed on the same line through 5+ consecutive edits — likely confused at that point.",
  CODE_NOT_GROWING:
    "Total line count did not increase for 5+ minutes — no forward progress being made.",
  LARGE_PASTE_DETECTED:
    "Student pasted 50+ characters at once — code may not be self-written.",
  ZERO_KEYSTROKE_RATIO:
    "Final code is long but very few keystrokes were recorded — strong sign of copy-paste.",
  SAME_ERROR_REPEATED:
    "The exact same error appeared 3+ runs in a row — student is not understanding the fix needed.",
  HIGH_ERROR_RATE:
    "Student hit 5+ distinct errors in this session — struggling with syntax or logic.",
  HIGH_BACKSPACE_RATIO:
    "Over 40% of keystrokes were backspaces — student is making and correcting many typos.",
  FREQUENT_TAB_SWITCHES:
    "Student switched away from the editor tab 3+ times — possibly looking up answers externally.",
  MATCHES_REFERENCE_SOLUTION:
    "Student's code is 85%+ similar to the model answer — possible copy from solution.",
};

// ─────────────────────────────────────────────────────────────────
//  buildSessionSummary
//
//  Call this before sending data to AI.
//  Takes the raw output of getReport() + current code/output,
//  returns a clean object the AI can reason about directly.
// ─────────────────────────────────────────────────────────────────
export function buildSessionSummary({ report, code, output, studentName = "Unknown" }) {
  const {
    studentId,
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
    latestOutput = "",   // ← pulled from getReport(), already the last string
  } = report;

  // If caller passes raw output array directly (e.g. from state), handle that too
  const resolvedOutput = latestOutput ||
    (Array.isArray(output) ? (output.at(-1) ?? "") : (output ?? ""));

  // ── Deduplicate flags: keep one entry per type with a count ──
  const flagMap = {};
  for (const f of flags) {
    if (!flagMap[f.type]) {
      flagMap[f.type] = {
        type: f.type,
        context: FLAG_META[f.type] ?? "Unknown flag.",
        count: 1,
        firstSeenAt: f.timestamp,
        detail: f,                   // keep first occurrence's detail
      };
    } else {
      flagMap[f.type].count++;
    }
  }
  const dedupedFlags = Object.values(flagMap);

  // ── Code growth: diff first and last snapshot ────────────────
  const firstSnapshot = codeSnapshots[0]?.code ?? "";
  const lastSnapshot = codeSnapshots.at(-1)?.code ?? code;
  const linesStart = (firstSnapshot.match(/\n/g) ?? []).length + 1;
  const linesEnd = (lastSnapshot.match(/\n/g) ?? []).length + 1;

  // ── Severity score (0–100, lower = more concern) ─────────────
  // Each flag type carries a severity weight
  const SEVERITY_WEIGHTS = {
    NOT_STARTED: 30,
    IDLE_TOO_LONG: 10,
    STUCK_ON_LINE: 10,
    CODE_NOT_GROWING: 15,
    LARGE_PASTE_DETECTED: 20,
    ZERO_KEYSTROKE_RATIO: 30,
    SAME_ERROR_REPEATED: 10,
    HIGH_ERROR_RATE: 10,
    HIGH_BACKSPACE_RATIO: 5,
    FREQUENT_TAB_SWITCHES: 15,
    MATCHES_REFERENCE_SOLUTION: 35,
  };

  const totalPenalty = dedupedFlags.reduce((sum, f) => {
    const w = SEVERITY_WEIGHTS[f.type] ?? 10;
    // repeated flags add half weight each extra time
    return sum + w + (f.count - 1) * (w * 0.5);
  }, 0);

  const engagementScore = Math.max(0, Math.round(100 - totalPenalty));

  // ── Final structured object ───────────────────────────────────
  return {
    meta: {
      studentId,
      studentName,
      assignmentId,
      generatedAt: new Date().toISOString(),
      sessionDurationMinutes: Math.round(sessionDurationMs / 60000),
    },

    behavior: {
      totalKeystrokes: keystrokes,
      backspaceRatio: parseFloat(backspaceRatio),
      pasteCount: pasteEvents.length,
      largePastes: pasteEvents.filter((p) => p.charCount >= 50).length,
      runAttempts,
      totalErrors,
      codeGrowth: {
        linesAtStart: linesStart,
        linesAtEnd: linesEnd,
        linesAdded: Math.max(0, linesEnd - linesStart),
      },
    },

    flags: dedupedFlags.map((f) => ({
      type: f.type,
      context: f.context,       // ← this is what AI reads to understand the flag
      count: f.count,           // how many times it fired
      detail: f.detail,         // raw data (line number, error text, similarity score, etc.)
    })),

    code: {
      final: code,
      outputOnLastRun: resolvedOutput,
    },

    engagementScore,            // 0–100 pre-computed hint for AI
  };
}

// ─────────────────────────────────────────────────────────────────
//  buildAIPrompt
//
//  Turns the session summary into a ready-to-send AI prompt.
//  Pass the returned string as the user message to your AI call.
// ─────────────────────────────────────────────────────────────────
export function buildAIPrompt(summary) {
  const flagLines = summary.flags.length
    ? summary.flags
        .map((f) => `  - [${f.type}] (x${f.count}): ${f.context}`)
        .join("\n")
    : "  - No flags raised. Student appears to have worked independently.";

  return `
You are an AI teaching assistant. Analyse this student's coding session and return a JSON object only — no markdown, no explanation outside the JSON.

SESSION SUMMARY
───────────────
Student      : ${summary.meta.studentName} (${summary.meta.studentId})
Assignment   : ${summary.meta.assignmentId}
Duration     : ${summary.meta.sessionDurationMinutes} minutes
Keystrokes   : ${summary.behavior.totalKeystrokes}
Backspace %  : ${(summary.behavior.backspaceRatio * 100).toFixed(0)}%
Paste events : ${summary.behavior.pasteCount} (${summary.behavior.largePastes} large)
Run attempts : ${summary.behavior.runAttempts}
Errors hit   : ${summary.behavior.totalErrors}
Code growth  : ${summary.behavior.codeGrowth.linesAtStart} → ${summary.behavior.codeGrowth.linesAtEnd} lines
Pre-score    : ${summary.engagementScore}/100

BEHAVIOUR FLAGS
───────────────
${flagLines}

STUDENT'S FINAL CODE
────────────────────
${summary.code.final}

LAST OUTPUT
───────────
${summary.code.outputOnLastRun || "(no output)"}

Return ONLY this JSON structure:
{
  "score": <number 0-100>,
  "label": <"On track" | "Needs attention" | "Struggling" | "Suspected copy-paste">,
  "summary": <2-3 sentence plain-English summary for the teacher>,
  "flags_explained": [{ "flag": "<FLAG_TYPE>", "insight": "<teacher-friendly one line>" }],
  "suggested_action": <one concrete thing the teacher should do>
}
`.trim();
}
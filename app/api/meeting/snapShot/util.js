// Utility functions for processing student labels and ai context
export function buildBehaviorContext(data) {
  const {
    flags, keystrokes, backspaces, pasteEvents,
    runAttempts, totalErrors, sessionDurationMs,
    code, latestOutput, codeSnapshots
  } = data;

  // --- Derived metrics ---
  const sessionMinutes = Math.round(sessionDurationMs / 60000);
  const tabSwitchCount = flags.filter(f => f.type === 'TAB_SWITCH').length;
  const frequentSwitchEvents = flags.filter(f => f.type === 'FREQUENT_TAB_SWITCHES').length;
  const idleEvents = flags.filter(f => f.type === 'IDLE_TOO_LONG');
  const notStartedEvents = flags.filter(f => f.type === 'NOT_STARTED');
  const lastNotStarted = notStartedEvents.at(-1);
  const totalPastes = pasteEvents?.length ?? 0;
  const hasCode = code && code.trim().length > 0;
  const hasOutput = latestOutput && latestOutput.length > 0;

  // --- Determine activity status ---
  let status = 'unknown';
  if (!hasCode && notStartedEvents.length > 0) status = 'not_started';
  else if (idleEvents.length > 0 && !hasCode) status = 'idle';
  else if (totalErrors > 0) status = 'debugging';
  else if (hasCode && runAttempts > 0) status = 'coding';
  else if (hasCode) status = 'coding';
  else status = 'idle';

  // --- Determine label (priority order) ---
  let label = 'on-track';
  if (!hasCode && sessionMinutes > 10) label = 'not-started';
  if (idleEvents.length >= 2) label = 'idle-too-long';
  if (frequentSwitchEvents >= 2) label = 'tab-switching';
  if (totalPastes > 2) label = 'copy-pasting';
  if (totalErrors > 5) label = 'struggling';
  // Labels can stack — you may want an array instead (see improvements)

  // --- Build context string for AI ---
  const contextLines = [
    `Session duration: ${sessionMinutes} minutes`,
    `Keystrokes: ${keystrokes}, Backspaces: ${backspaces} `,
    `Paste events: ${totalPastes}`,
    `Tab switches: ${tabSwitchCount}, Frequent switch bursts: ${frequentSwitchEvents}`,
    `Run attempts: ${runAttempts}, Total errors: ${totalErrors}`,
    `Idle events: ${idleEvents.length}`,
    lastNotStarted
      ? `Student had NOT started coding even at ${lastNotStarted.minutesElapsed} minutes`
      : null,
    hasCode
      ? `Code written (${code.trim().split('\n').length} lines)`
      : `No code written yet`,
    hasOutput ? `Latest output: ${latestOutput}` : `No output yet`,
  ].filter(Boolean).join('\n');

  return { status, label, contextLines, sessionMinutes, tabSwitchCount, hasCode };
}

// api call to ai to analyze student behavior and get a score + summary
export async function analyzeWithClaude(studentName, assignmentId, contextLines, code, output) {
  const prompt = `
You are an assistant helping a teacher monitor student coding progress in real time.

Student: ${studentName ?? 'Unknown'}
Assignment: ${assignmentId}

Behavioral data:
${contextLines}

${code ? `Current code:\n\`\`\`\n${code}\n\`\`\`` : 'No code written yet.'}
${output ? `Latest output:\n\`\`\`\n${output}\n\`\`\`` : 'No output yet.'}

Based on this, respond ONLY with a valid JSON object (no markdown, no explanation):
{
  "score": <integer 0-100>,
  "summary": {
    "whatStudentDid": "<one sentence>",
    "struggling": "<one sentence or null>",
    "doingWell": "<one sentence or null>",
    "suspiciousBehavior": "<one sentence or null>",
    "adviceForTeacher": "<one sentence>"
  }
}

Scoring guide:
- 0–20: No effort, not started, highly suspicious
- 21–40: Minimal effort, lots of tab switching or idling
- 41–60: Some progress but struggling or distracted
- 61–80: Good progress, minor issues
- 81–100: Strong effort, clean code, good output
`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const raw = data.content?.[0]?.text ?? '';

  // Safe parse — strip any accidental markdown fences
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}
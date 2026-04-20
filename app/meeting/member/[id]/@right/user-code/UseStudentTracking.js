"use client";

import { useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
//  CONFIG — tweak these thresholds as needed
// ─────────────────────────────────────────────
const CONFIG = {
  IDLE_THRESHOLD_MS: 3 * 60 * 1000, // 3 min no keystrokes → stuck
  NOT_STARTED_CHECK_MS: 5 * 60 * 1000, // 5 min with zero keystrokes → not started
  PASTE_CHAR_THRESHOLD: 50, // chars pasted at once → copy-paste flag
  BACKSPACE_RATIO_THRESHOLD: 0.4, // 40%+ backspaces → typo-heavy
  SAME_LINE_REPEAT_THRESHOLD: 5, // same line edited 5+ times → stuck on line
  SAME_ERROR_REPEAT_THRESHOLD: 3, // same error 3+ times → stuck on error
  HIGH_ERROR_RATE_THRESHOLD: 5, // 5+ errors per session → struggling
  SNAPSHOT_INTERVAL_MS: 2 * 60 * 1000, // code snapshot every 2 min
  LINE_FLAT_DURATION_MS: 5 * 60 * 1000, // 5 min no line-count growth → stuck
  SIMILARITY_THRESHOLD: 0.85, // 85% match to reference → copied
};

/**
 * useStudentTracking
 *
 * Drop this into any page that has a Monaco editor + run function.
 *
 * @param {object} options
 * @param {string}   options.studentId       - unique student identifier
 * @param {string}   options.assignmentId    - which assignment is open
 * @param {string}   options.code            - current code state (your `Code` state variable)
 * @param {Array}    options.output          - current output state (your `Output` state variable — array of run result strings)
 * @param {string}   [options.referenceCode] - optional model answer for similarity check
 * @param {function} [options.onFlag]        - callback(flagEvent) when something is flagged
 * @param {function} [options.onSnapshot]    - callback(snapshot) for periodic saves
 *
 * @returns {{ getReport, attachMonacoListeners }}
 *   - getReport()              → full session stats object
 *   - attachMonacoListeners(editor) → call this in Monaco's onMount
 */
export function useStudentTracking({
  studentId,
  assignmentId,
  code,
  output,
  referenceCode = "",
  onFlag = () => {},
  onSnapshot = () => {},
}) {
  // ── Internal session state (never causes re-renders) ──────────────────────
  const session = useRef({
    startTime: Date.now(),
    keystrokes: 0,
    backspaces: 0,
    pasteEvents: [],
    runAttempts: [],
    errorHistory: [],
    lineHistory: [], // [{ line, timestamp }]
    codeSnapshots: [], // periodic snapshots
    flags: [], // all flagged events
    lastKeystrokeTime: null,
    lastLineCounts: [], // [{ count, timestamp }]
    idleTimer: null,
    notStartedTimer: null,
    snapshotTimer: null,
    monacoDisposables: [],
  });

  const codeRef = useRef(code);
  const outputRef = useRef(output);

  // keep refs in sync with props
  useEffect(() => {
    codeRef.current = code;
  }, [code]);
  useEffect(() => {
    outputRef.current = output;
  }, [output]);

  // ── Helper: safely get latest output string from the array ───────────────
  // Output is an array of all previous run results — always analyse the last one.
  const getLatestOutput = useCallback(() => {
    const out = outputRef.current;
    if (!out) return "";
    if (Array.isArray(out)) return out.at(-1) ?? "";
    return String(out); // graceful fallback if a plain string is passed
  }, []);

  // ── Utility: emit a flag ──────────────────────────────────────────────────
  const flag = useCallback(
    (type, detail = {}) => {
      const event = {
        type,
        studentId,
        assignmentId,
        timestamp: Date.now(),
        codeSnapshot: codeRef.current,
        ...detail,
      };
      session.current.flags.push(event);
      console.warn(`[Tracking] FLAG: ${type}`, event);
      onFlag(event);
    },
    [studentId, assignmentId, onFlag],
  );

  // ── Utility: similarity score (Jaccard on trigrams) ──────────────────────
  function similarity(a, b) {
    if (!a || !b) return 0;
    const trigrams = (s) => {
      const set = new Set();
      for (let i = 0; i < s.length - 2; i++) set.add(s.slice(i, i + 3));
      return set;
    };
    const ta = trigrams(a.replace(/\s+/g, ""));
    const tb = trigrams(b.replace(/\s+/g, ""));
    const intersection = [...ta].filter((t) => tb.has(t)).length;
    const union = new Set([...ta, ...tb]).size;
    return union === 0 ? 0 : intersection / union;
  }

  // ── Check: is the student NOT started? ───────────────────────────────────
  function checkNotStarted() {
    const s = session.current;
    if (s.keystrokes === 0 && codeRef.current.trim().length === 0) {
      flag("NOT_STARTED", {
        minutesElapsed: Math.round((Date.now() - s.startTime) / 60000),
      });
    }
  }

  // ── Check: idle (no keystrokes for IDLE_THRESHOLD_MS) ────────────────────
  function resetIdleTimer() {
    const s = session.current;
    if (s.idleTimer) clearTimeout(s.idleTimer);
    s.idleTimer = setTimeout(() => {
      flag("IDLE_TOO_LONG", {
        idleMinutes: CONFIG.IDLE_THRESHOLD_MS / 60000,
        lastLine: s.lineHistory.at(-1)?.line ?? null,
      });
    }, CONFIG.IDLE_THRESHOLD_MS);
  }

  // ── Check: same line repeated ─────────────────────────────────────────────
  function checkSameLineRepeat(currentLine) {
    const s = session.current;
    s.lineHistory.push({ line: currentLine, timestamp: Date.now() });

    // keep last 20 entries
    if (s.lineHistory.length > 20) s.lineHistory.shift();

    const recent = s.lineHistory.slice(-CONFIG.SAME_LINE_REPEAT_THRESHOLD);
    if (
      recent.length === CONFIG.SAME_LINE_REPEAT_THRESHOLD &&
      recent.every((e) => e.line === currentLine)
    ) {
      flag("STUCK_ON_LINE", { line: currentLine });
    }
  }

  // ── Check: line-count not growing ────────────────────────────────────────
  function checkLineFlatness() {
    const s = session.current;
    const lineCount = (codeRef.current.match(/\n/g) || []).length + 1;
    const now = Date.now();
    s.lastLineCounts.push({ count: lineCount, timestamp: now });

    // keep last 10 min of data
    s.lastLineCounts = s.lastLineCounts.filter(
      (e) => now - e.timestamp < CONFIG.LINE_FLAT_DURATION_MS,
    );

    if (s.lastLineCounts.length > 3) {
      const oldest = s.lastLineCounts[0];
      const newest = s.lastLineCounts.at(-1);
      if (
        newest.count === oldest.count &&
        now - oldest.timestamp >= CONFIG.LINE_FLAT_DURATION_MS
      ) {
        flag("CODE_NOT_GROWING", { lineCount, durationMinutes: 5 });
      }
    }
  }

  // ── Check: backspace heavy typing ────────────────────────────────────────
  function checkBackspaceRatio() {
    const s = session.current;
    if (s.keystrokes < 30) return; // too few to judge
    const ratio = s.backspaces / s.keystrokes;
    if (ratio > CONFIG.BACKSPACE_RATIO_THRESHOLD) {
      flag("HIGH_BACKSPACE_RATIO", {
        ratio: ratio.toFixed(2),
        keystrokes: s.keystrokes,
        backspaces: s.backspaces,
      });
    }
  }

  // ── Check: zero-keystroke ratio (typed nothing but code appeared) ─────────
  function checkZeroKeystrokeRatio() {
    const s = session.current;
    const codeLen = codeRef.current.replace(/\s/g, "").length;
    if (codeLen > 80 && s.keystrokes < 10) {
      flag("ZERO_KEYSTROKE_RATIO", {
        codeLength: codeLen,
        keystrokes: s.keystrokes,
      });
    }
  }

  // ── Tab-switch tracking (visibilitychange) ───────────────────────────────
  useEffect(() => {
    let tabSwitchCount = 0;
    const handler = () => {
      if (document.hidden) {
        tabSwitchCount++;
        session.current.flags.push({
          type: "TAB_SWITCH",
          studentId,
          assignmentId,
          timestamp: Date.now(),
          count: tabSwitchCount,
        });
        if (tabSwitchCount % 3 === 0) {
          flag("FREQUENT_TAB_SWITCHES", { count: tabSwitchCount });
        }
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // ── Periodic snapshot every 30s ───────────────────────────────────────────
  useEffect(() => {
    const s = session.current;
    s.snapshotTimer = setInterval(() => {
      const snapshot = {
        report: {
          studentId,
          assignmentId,
          timestamp: Date.now(),
          totalOutputRuns: Array.isArray(outputRef.current)
            ? outputRef.current.length
            : 0,
          keystrokes: s.keystrokes,
          backspaces: s.backspaces,
          runAttempts: s.runAttempts.length,
        }, // full session report at this moment
        code: codeRef.current,
        output: getLatestOutput(), // latest string from the Output array
      };
      s.codeSnapshots.push(snapshot);
      checkLineFlatness();
      checkBackspaceRatio();
      checkZeroKeystrokeRatio();
      onSnapshot(snapshot);
    }, CONFIG.SNAPSHOT_INTERVAL_MS);

    return () => clearInterval(s.snapshotTimer);
  }, []);

  // ── "Not started" timer — runs once after 5 min ───────────────────────────
  useEffect(() => {
    const s = session.current;
    s.notStartedTimer = setTimeout(
      checkNotStarted,
      CONFIG.NOT_STARTED_CHECK_MS,
    );
    return () => clearTimeout(s.notStartedTimer);
  }, []);

  // ── Watch Output array changes → analyse the latest run result ───────────
  useEffect(() => {
    // output is an array — skip if empty
    if (!Array.isArray(output) || output.length === 0) return;

    const latestOutput = output.at(-1) ?? ""; // always the newest run
    if (!latestOutput) return;

    const s = session.current;
    const lowerOutput = latestOutput;

    // const isError =
    //   lowerOutput.includes("error") ||
    //   lowerOutput.includes("traceback") ||
    //   lowerOutput.includes("exception");

    const isError = lowerOutput?.type == "error" ? true : false;

    const attempt = {
      timestamp: Date.now(),
      runIndex: output.length, // which run number this is
      output: latestOutput,
      isError,
    };
    s.runAttempts.push(attempt);

    if (isError) {
      s.errorHistory.push(latestOutput);

      // same error 3+ times in a row
      const recent = s.errorHistory.slice(-CONFIG.SAME_ERROR_REPEAT_THRESHOLD);
      if (
        recent.length === CONFIG.SAME_ERROR_REPEAT_THRESHOLD &&
        recent.every((e) => e === recent[0])
      ) {
        flag("SAME_ERROR_REPEATED", {
          error: recent[0],
          times: CONFIG.SAME_ERROR_REPEAT_THRESHOLD,
        });
      }

      // total error count too high
      if (s.errorHistory.length >= CONFIG.HIGH_ERROR_RATE_THRESHOLD) {
        flag("HIGH_ERROR_RATE", { totalErrors: s.errorHistory.length });
      }
    }

    // similarity check against reference solution (only on successful runs)
    if (referenceCode && !isError) {
      const score = similarity(codeRef.current, referenceCode);
      if (score >= CONFIG.SIMILARITY_THRESHOLD) {
        flag("MATCHES_REFERENCE_SOLUTION", {
          similarityScore: score.toFixed(2),
        });
      }
    }
  }, [output]); // fires every time a new item is pushed to the Output array

  // ── attachMonacoListeners — call inside editor's onMount ─────────────────
  const attachMonacoListeners = useCallback((editor) => {
    const s = session.current;

    // 1. Keystroke tracking
    const keyDisposable = editor.onKeyDown((e) => {
      s.keystrokes++;
      s.lastKeystrokeTime = Date.now();

      if (e.keyCode === 1) s.backspaces++; // Monaco KeyCode.Backspace = 1

      // cancel "not started" timer once first keystroke happens
      if (s.keystrokes === 1 && s.notStartedTimer) {
        clearTimeout(s.notStartedTimer);
      }

      resetIdleTimer();

      // track which line cursor is on
      const position = editor.getPosition();
      if (position) checkSameLineRepeat(position.lineNumber);
    });

    // 2. Paste detection
    const pasteDisposable = editor.onDidPaste((e) => {
      const model = editor.getModel();
      if (!model) return;

      const pastedText = model.getValueInRange(e.range);
      const charCount = pastedText.length;

      const pasteEvent = {
        timestamp: Date.now(),
        charCount,
        preview: pastedText.slice(0, 100),
      };
      s.pasteEvents.push(pasteEvent);

      if (charCount >= CONFIG.PASTE_CHAR_THRESHOLD) {
        flag("LARGE_PASTE_DETECTED", {
          charCount,
          preview: pastedText.slice(0, 100),
        });
      }
    });

    // store disposables for cleanup
    s.monacoDisposables.push(keyDisposable, pasteDisposable);

    // start idle timer now that editor is ready
    resetIdleTimer();
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      const s = session.current;
      if (s.idleTimer) clearTimeout(s.idleTimer);
      if (s.notStartedTimer) clearTimeout(s.notStartedTimer);
      if (s.snapshotTimer) clearInterval(s.snapshotTimer);
      s.monacoDisposables.forEach((d) => d?.dispose?.());
    };
  }, []);

  // ── Public API ────────────────────────────────────────────────────────────
  const getReport = useCallback(() => {
    const s = session.current;
    const now = Date.now();
    const outputArray = Array.isArray(outputRef.current)
      ? outputRef.current
      : [];
    return {
      studentId,
      assignmentId,
      sessionDurationMs: now - s.startTime,
      keystrokes: s.keystrokes,
      backspaces: s.backspaces,
      backspaceRatio: s.keystrokes
        ? (s.backspaces / s.keystrokes).toFixed(2)
        : "0.00",
      pasteEvents: s.pasteEvents,
      runAttempts: s.runAttempts.length,
      totalErrors: s.errorHistory.length,
      flags: s.flags,
      codeSnapshots: s.codeSnapshots,
      // output: give consumer both the full history and the latest string
      outputHistory: outputArray,
      latestOutput: outputArray.at(-1) ?? "",
    };
  }, [studentId, assignmentId]);

  return { getReport, attachMonacoListeners };
}

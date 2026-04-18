"use client";

import { useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useStudentTracking } from "@/hooks/useStudentTracking"; // adjust path

// ─── Example: your existing runCode function ──────────────────────────────────
async function executeCode(code) {
  // Replace this with your actual execution API call
  // e.g. Judge0, Piston, your own backend, etc.
  const res = await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  return data.output ?? data.error ?? "No output";
}

// ─── Optional: reference / model answer for similarity check ─────────────────
const REFERENCE_CODE = `
def add(a, b):
    return a + b

print(add(2, 3))
`.trim();

// ─────────────────────────────────────────────────────────────────────────────
export default function CodeEditorPage() {
  // ── Your existing state variables ─────────────────────────────────────────
  const [Code, setCode] = useState("# Write your solution here\n");
  const [Output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // ── Hook: initialise student tracking ────────────────────────────────────
  const { getReport, attachMonacoListeners } = useStudentTracking({
    studentId: "student_42",        // 👈 replace with real auth session user id
    assignmentId: "assignment_07",  // 👈 replace with current assignment id
    code: Code,
    output: Output,
    referenceCode: REFERENCE_CODE,  // optional — remove if not needed

    // Called every time a flag is raised
    onFlag: (flagEvent) => {
      console.log("FLAG RAISED:", flagEvent);

      // Send to your backend / analytics
      fetch("/api/tracking/flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flagEvent),
      }).catch(() => {});

      // Optional: show a soft hint to the student for certain flags
      if (flagEvent.type === "STUCK_ON_LINE") {
        console.info("💡 Hint: student stuck on line", flagEvent.line);
      }
      if (flagEvent.type === "IDLE_TOO_LONG") {
        console.info("💡 Hint: student has been idle for 3+ minutes");
      }
    },

    // Called every 30 seconds with a code snapshot
    // onSnapshot: (snapshot) => {
    //   fetch("/api/tracking/snapshot", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(snapshot),
    //   }).catch(() => {});
    // },
  });

  // ── Monaco onMount: attach all listeners ─────────────────────────────────
  const handleEditorMount = useCallback((editor) => {
    attachMonacoListeners(editor);
  }, [attachMonacoListeners]);

  // ── Your existing runCode function ────────────────────────────────────────
  const runCode = useCallback(async () => {
    setIsRunning(true);
    try {
      const result = await executeCode(Code);
      setOutput(result);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  }, [Code]);

  // ── Dev helper: log the full session report ───────────────────────────────
  const handleShowReport = () => {
    console.table(getReport());
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "1rem", gap: "1rem" }}>

      {/* Monaco Editor */}
      <div style={{ flex: 1, border: "1px solid #ccc", borderRadius: 8, overflow: "hidden" }}>
        <Editor
          height="100%"
          defaultLanguage="python"   // change to your language
          value={Code}
          onChange={(value) => setCode(value ?? "")}
          onMount={handleEditorMount}  // ← this is the only integration line needed
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
          }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={runCode} disabled={isRunning}>
          {isRunning ? "Running..." : "Run Code"}
        </button>
        {/* Dev only — remove in production */}
        <button onClick={handleShowReport} style={{ opacity: 0.5 }}>
          [Dev] Show Report
        </button>
      </div>

      {/* Output */}
      <pre style={{
        background: "#1e1e1e",
        color: "#d4d4d4",
        padding: "1rem",
        borderRadius: 8,
        minHeight: 120,
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
      }}>
        {Output || "Output will appear here..."}
      </pre>

    </div>
  );
}
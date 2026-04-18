"use client";

import { useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useStudentTracking } from "@/hooks/useStudentTracking";
import { sendSnapshot } from "@/lib/snapshotSender"; // 👈 new

async function executeCode(code) {
  // your existing run logic
  const res = await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  return data.output ?? data.error ?? "No output";
}

export default function CodeEditorPage() {
  const [Code, setCode] = useState("# Write your solution here\n");
  const [Output, setOutput] = useState([]); // array of run results
  const [isRunning, setIsRunning] = useState(false);

  const { getReport, attachMonacoListeners } = useStudentTracking({
    studentId: "student_42",
    assignmentId: "assignment_07",
    code: Code,
    output: Output,
    onFlag: (flag) => console.log("FLAG:", flag),
  });

  const handleEditorMount = useCallback((editor) => {
    attachMonacoListeners(editor);
  }, [attachMonacoListeners]);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    try {
      const result = await executeCode(Code);
      const newOutput = [...Output, result]; // append to array
      setOutput(newOutput);

      // ── Send snapshot after every run ──────────────────────────
      await sendSnapshot({
        getReport,
        code: Code,
        output: newOutput,
        studentName: "Riya",          // 👈 replace with real student name from auth
        assignmentId: "assignment_07",
      });
    } catch (err) {
      setOutput((prev) => [...prev, `Error: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  }, [Code, Output, getReport]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "1rem", gap: "1rem" }}>
      <div style={{ flex: 1, border: "1px solid #ccc", borderRadius: 8, overflow: "hidden" }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          value={Code}
          onChange={(value) => setCode(value ?? "")}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
      </div>

      <button onClick={runCode} disabled={isRunning}>
        {isRunning ? "Running..." : "Run Code"}
      </button>

      <pre style={{
        background: "#1e1e1e", color: "#d4d4d4",
        padding: "1rem", borderRadius: 8,
        minHeight: 120, fontFamily: "monospace", whiteSpace: "pre-wrap",
      }}>
        {Output.length > 0 ? Output.at(-1) : "Output will appear here..."}
      </pre>
    </div>
  );
}
// types.ts

export interface Snapshot {
  report: {
    studentId: string;
    assignmentId: string;
    lastOutput: string;
    score: number;
    summery: string;
    suggestedAction: string;
    runAttempts: number;
  };
  code: string;
  output: string;
}

export interface Participant {
  id: string;
  username: string;
  snapshot?: Snapshot;
}

export interface MeetingState {
  meetingId: string | null;
  connectionStatus: "connected" | "disconnected" | "connecting";

  participants: {
    byId: Record<string, Participant>;
    allIds: string[];
  };
}
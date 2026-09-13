import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  MeetingState,
  Participant,
  Snapshot,
  StudentCodeSnapshot,
  StudentCodeTabsState,
  MAX_STUDENT_TABS,
} from "./types";

const initialStudentCodeTabs: StudentCodeTabsState = {
  openTabs: [],
  activeTab: null,
  snapshots: {},
  loading: {},
  errors: {},
};

const initialState: MeetingState = {
  meetingId: null,
  connectionStatus: "disconnected",
  participants: {
    byId: {},
    allIds: [],
  },
  studentCodeTabs: initialStudentCodeTabs,
};

const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    // 🎯 Set meeting ID
    setMeetingId(state, action: PayloadAction<string>) {
      state.meetingId = action.payload;
    },

    // ➕ User joined
    userJoined(
      state,
      action: PayloadAction<{ id: string; username: string }>
    ) {
      const user = action.payload;

      if (!state.participants.byId[user.id]) {
        state.participants.byId[user.id] = {
          ...user,
          snapshot: undefined,
        };
        state.participants.allIds.push(user.id);
      }
    },

    // ❌ User left
    userLeft(state, action: PayloadAction<string>) {
      const id = action.payload;

      delete state.participants.byId[id];
      state.participants.allIds = state.participants.allIds.filter(
        (participantId) => participantId !== id
      );
    },

    // 🔄 Set participants (bulk)
    setParticipants(
      state,
      action: PayloadAction<{ id: string; username: string }[]>
    ) {
      state.participants.byId = {};
      state.participants.allIds = [];

      action.payload.forEach((user) => {
        state.participants.byId[user.id] = {
          ...user,
          snapshot: undefined,
        };
        state.participants.allIds.push(user.id);
      });
    },

    // ⚡ Update snapshot (REAL-TIME CORE)
    updateSnapshot(
      state,
      action: PayloadAction<{
        userId: string;
        snapshot: any;
      }>
    ) {
      const { userId, snapshot } = action.payload;

      if (state.participants.byId[userId]) {
        state.participants.byId[userId].snapshot = snapshot;
      }
    },

    // 🔌 Connection status
    setConnectionStatus(
      state,
      action: PayloadAction<MeetingState["connectionStatus"]>
    ) {
      state.connectionStatus = action.payload;
    },

    // 📝 Student Code Tabs (Teacher "See Code" feature)
    requestStudentCodeStart(
      state,
      action: PayloadAction<{ studentId: string; studentName?: string }>
    ) {
      const { studentId } = action.payload;
      if (!state.studentCodeTabs) {
        state.studentCodeTabs = {
          openTabs: [],
          activeTab: null,
          snapshots: {},
          loading: {},
          errors: {},
        };
      }

      const tabs = state.studentCodeTabs.openTabs;
      const isAlreadyOpen = tabs.includes(studentId);

      if (!isAlreadyOpen) {
        // Enforce maximum 5 tabs with deterministic FIFO removal
        if (tabs.length >= MAX_STUDENT_TABS) {
          const oldestTabId = tabs.shift();
          if (oldestTabId) {
            delete state.studentCodeTabs.snapshots[oldestTabId];
            delete state.studentCodeTabs.loading[oldestTabId];
            delete state.studentCodeTabs.errors[oldestTabId];
          }
        }
        tabs.push(studentId);
      }

      state.studentCodeTabs.activeTab = studentId;
      state.studentCodeTabs.loading[studentId] = true;
      state.studentCodeTabs.errors[studentId] = null;
    },

    receiveStudentCodeSuccess(
      state,
      action: PayloadAction<{
        studentId: string;
        studentName?: string;
        code: string;
        language?: string;
        timestamp?: number;
      }>
    ) {
      const { studentId, studentName, code, language, timestamp } = action.payload;
      if (state.studentCodeTabs) {
        state.studentCodeTabs.loading[studentId] = false;
        state.studentCodeTabs.errors[studentId] = null;

        const resolvedName =
          studentName ||
          state.participants.byId[studentId]?.username ||
          "Student";

        state.studentCodeTabs.snapshots[studentId] = {
          code,
          language: language || "javascript",
          studentName: resolvedName,
          timestamp: timestamp || Date.now(),
        };
      }
    },

    receiveStudentCodeError(
      state,
      action: PayloadAction<{ studentId: string; error: string }>
    ) {
      const { studentId, error } = action.payload;
      if (state.studentCodeTabs) {
        state.studentCodeTabs.loading[studentId] = false;
        state.studentCodeTabs.errors[studentId] = error;
      }
    },

    closeStudentTab(state, action: PayloadAction<string>) {
      const studentId = action.payload;
      if (!state.studentCodeTabs) return;

      const tabs = state.studentCodeTabs.openTabs;
      const index = tabs.indexOf(studentId);
      if (index !== -1) {
        tabs.splice(index, 1);
      }

      delete state.studentCodeTabs.snapshots[studentId];
      delete state.studentCodeTabs.loading[studentId];
      delete state.studentCodeTabs.errors[studentId];

      // If closed tab was the active tab, switch to adjacent or fallback to 'host'
      if (state.studentCodeTabs.activeTab === studentId) {
        if (tabs.length > 0) {
          const nextIndex = Math.min(index, tabs.length - 1);
          state.studentCodeTabs.activeTab = tabs[nextIndex];
        } else {
          state.studentCodeTabs.activeTab = "host";
        }
      }
    },

    setActiveStudentTab(state, action: PayloadAction<string>) {
      if (state.studentCodeTabs) {
        state.studentCodeTabs.activeTab = action.payload;
      }
    },

    resetStudentCodeTabs(state) {
      state.studentCodeTabs = {
        openTabs: [],
        activeTab: null,
        snapshots: {},
        loading: {},
        errors: {},
      };
    },

    // 🧹 Reset meeting (clears all participant and code tab state)
    resetMeeting(state) {
      state.meetingId = null;
      state.participants = { byId: {}, allIds: [] };
      state.connectionStatus = "disconnected";
      state.studentCodeTabs = {
        openTabs: [],
        activeTab: null,
        snapshots: {},
        loading: {},
        errors: {},
      };
    },
  },
});

export const {
  setMeetingId,
  userJoined,
  userLeft,
  setConnectionStatus,
  setParticipants,
  updateSnapshot,
  requestStudentCodeStart,
  receiveStudentCodeSuccess,
  receiveStudentCodeError,
  closeStudentTab,
  setActiveStudentTab,
  resetStudentCodeTabs,
  resetMeeting,
} = meetingSlice.actions;

export default meetingSlice.reducer;

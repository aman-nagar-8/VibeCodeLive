import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MeetingState, Participant, Snapshot } from "./types";

// interface MeetingState {
//   meetingId: string | null;
//   participants: any[];
//   connectionStatus: "idle" | "connected" | "disconnected";
// }

interface participants {

  byId: {
    "user1": {
      userId: "user1",
      username: "Aman",
      snapshot: {},
    },
    "user2": {
      userId: string,
      username: string,
      snapshot: {},
    }
  },
  allIds: ["user1", "user2"]

}

const initialState: MeetingState = {
  meetingId: null,
  connectionStatus: "disconnected",
  participants: {
    byId: {},
    allIds: [],
  },
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
      action: PayloadAction<{ userId: string; username: string }>
    ) {
      const user = action.payload;

      if (!state.participants.byId[user.userId]) {
        state.participants.byId[user.userId] = {
          ...user,
          snapshot: undefined,
        };
        state.participants.allIds.push(user.userId);
      }
    },

    // ❌ User left
    userLeft(state, action: PayloadAction<string>) {
      const userId = action.payload;

      delete state.participants.byId[userId];
      state.participants.allIds = state.participants.allIds.filter(
        (id) => id !== userId
      );
    },

    // 🔄 Set participants (bulk)
    setParticipants(
      state,
      action: PayloadAction<{ userId: string; username: string }[]>
    ) {
      state.participants.byId = {};
      state.participants.allIds = [];

      action.payload.forEach((user) => {
        state.participants.byId[user.userId] = {
          ...user,
          snapshot: undefined,
        };
        state.participants.allIds.push(user.userId);
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

    // 🧹 Reset meeting (optional but useful)
    resetMeeting(state) {
      state.meetingId = null;
      state.participants = { byId: {}, allIds: [] };
      state.connectionStatus = "disconnected";
    },
  },
});

export const { setMeetingId, userJoined, userLeft, setConnectionStatus , setParticipants, updateSnapshot, resetMeeting } =
  meetingSlice.actions;

export default meetingSlice.reducer;

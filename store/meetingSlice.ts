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
        (id) => id !== id
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

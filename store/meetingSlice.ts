import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MeetingState {
  meetingId: string | null;
  participants: any[];
  connectionStatus: "idle" | "connected" | "disconnected";
}

const initialState: MeetingState = {
  meetingId: null,
  participants: [],
  connectionStatus: "idle",
};

const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    setMeetingId(state, action: PayloadAction<string>) {
      state.meetingId = action.payload;
    },
    userJoined(state, action: PayloadAction<any>) {
      state.participants.push(action.payload);
    },
    userLeft(state, action: PayloadAction<string>) {
      state.participants = state.participants.filter(
        (u) => u.userId !== action.payload
      );
    },
    setConnectionStatus(
      state,
      action: PayloadAction<MeetingState["connectionStatus"]>
    ) {
      state.connectionStatus = action.payload;
    },
  },
});

export const {
  setMeetingId,
  userJoined,
  userLeft,
  setConnectionStatus,
} = meetingSlice.actions;

export default meetingSlice.reducer;

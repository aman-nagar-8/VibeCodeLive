import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import joinMeetingReducer from "./joinMeetingSlice";
import meetingReducer from "./meetingSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    joinMeeting: joinMeetingReducer,
    meeting: meetingReducer,
  },
});

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import joinMeetingReducer from "./joinMeetingSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    joinMeeting: joinMeetingReducer,
  },

});

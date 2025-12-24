import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface FormField {
//   fieldId: string;
//   label: string;
//   type: string;
//   required: boolean;
// }

// interface JoinMeetingState {
//   meeting: any | null;
//   joinForm: FormField[];
//   responses: Record<string, string>;
//   loading: boolean;
//   error: string | null;
//   joined: boolean;
// }

const initialState = {
  meeting: null,
  formData: [],
  currentStep: -1
};

const joinMeetingSlice = createSlice({
  name: "joinMeeting",
  initialState,
  reducers: {
    setMeeting(state, action) {
      state.meeting = action.payload;
    },

    setFormDate(state, action) {
      state.formData = action.payload;
    },

    setCurrentStep(state, action) {
      state.currentStep = action.payload;
    },
  },
});

export const {
  setMeeting,
  setCurrentStep,
  setFormDate
} = joinMeetingSlice.actions;

export default joinMeetingSlice.reducer;

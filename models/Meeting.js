import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    adminName: {
      type: String,
    },

    url: {
      type: String,
      required: true,
      unique: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.Mixed,
        // example: { user: userId, text: "Hello", timestamp: Date }
      },
    ],

    duration: {
      type: String,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdAt: {
      type: Date, // or Date
    },

    endedAt: {
      type: Date, // or Date
    },

    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],

    requiresPassword: {
      type: Boolean,
      default: false,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    
    joinPolicy: {
      type: String,
      enum: ["AUTH_ONLY", "GUEST_ONLY", "BOTH"],
    },

    status: {
      type: String,
      enum: ["scheduled", "live", "ended"],
    },

    requiredFields: [
      {
        type: String,
      },
    ],
  },

  { timestamps: true } // adds createdAt + updatedAt automatically
);

export default mongoose.models.Meeting ||
  mongoose.model("Meeting", MeetingSchema);

import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    verificationToken: {
      type: String,
      required: true,
      unique: true,
    },

    tokenExpiry: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.EmailVerification ||
  mongoose.model("EmailVerification", emailVerificationSchema);

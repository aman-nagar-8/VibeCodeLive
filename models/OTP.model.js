import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otpHash: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  resetToken:{
    type:String,
    default:"0"
  }
});

export default mongoose.models.OTP ||
  mongoose.model("OTP", OTPSchema);
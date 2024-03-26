import { Schema, model } from "mongoose";

const OTPSchema = Schema(
  {
    userId: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Date,
      expires: 0,
    },
  },
  { timestamps: true }
);

const OTPModel = model("Otp", OTPSchema);

export default OTPModel;

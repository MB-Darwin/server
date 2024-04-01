import { Schema, model } from "mongoose";

const applicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    jobSeekerId: {
      type: Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    coverLetter: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
    additionalDocumentsUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const ApplicationModel = model("Application", applicationSchema);

export default ApplicationModel;

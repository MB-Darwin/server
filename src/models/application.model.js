import { Schema, model } from "mongoose";

const applicationSchema = new Schema({
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
  appliedDate: {
    type: Date,
    default: Date.now,
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
});

const ApplicationModel = model("Application", applicationSchema);

export default ApplicationModel;

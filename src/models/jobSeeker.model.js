import { Schema, model } from "mongoose";

const JobSeekerSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    professions: [
      {
        type: String,
      },
    ],
    interests: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    coverLetterUrl: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
    additionalDocUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const JobSeekerModel = model("JobSeeker", JobSeekerSchema);

export default JobSeekerModel;

import { Schema, model } from "mongoose";

const JobSeekerSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    profession: {
      type: Array,
    },
    interests: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

const JobSeekerModel = model("JobSeeker", JobSeekerSchema);

export default JobSeekerModel;

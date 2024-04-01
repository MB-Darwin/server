import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    locations: [
      {
        type: String,
        required: true,
      },
    ],
    expDate: {
      type: Date,
      required: true,
      expires: 0,
    },
    content: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    schedules: [
      {
        type: String,
        required: true,
      },
    ],
    benefits: [
      {
        type: String,
        required: true,
      },
    ],
    salary: {
      type: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
    empType: [
      {
        type: String,
        required: true,
        enum: ["Full-Time", "Part-Time", "Remote", "Contract", "FreeLance"],
      },
    ],
    badge: {
      type: String,
      // enum: ["Urgent"],
    },
    XP: {
      type: String,
      required: true,
    },
    lang: [
      {
        type: String,
        required: true,
      },
    ],
    employerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Employer",
    },
  },
  { timestamps: true }
);

const JobModel = model("Job", jobSchema);

export default JobModel;

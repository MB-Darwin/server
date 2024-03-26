import { Schema, model } from "mongoose";

const EmployerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
    },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: "JobSeeker",
      },
    ],
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    headquarter: {
      type: String,
    },
    link: {
      type: String,
    },
    founded: {
      type: Date,
    },
    industry: {
      type: String,
    },
  },
  { timestamps: true }
);

const EmployerModel = model("Employer", EmployerSchema);

export default EmployerModel;

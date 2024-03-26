import { Schema, model } from "mongoose";

const RoleSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["JobSeeker", "Employer"],
    },
  },
  { timestamps: true }
);

const RoleModel = model("Role", RoleSchema);

export default RoleModel;

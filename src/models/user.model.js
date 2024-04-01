import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: Schema.ObjectId,
      ref: "Role",
      required: true,
    },

    pwd: {
      type: String,
      required: true,
    },

    phoneNum: {
      type: String,
    },

    address: {
      type: String,
    },

    location: {
      type: String,
    },

    region: {
      type: String,
    },

    city: {
      type: String,
    },

    zipCode: {
      type: String,
    },

    avatarUrl: {
      type: String,
    },

    coverUrl: {
      type: String,
      default: "/src/assets/img/cover/cover_4.jpg",
    },

    socialLinks: {
      facebook: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
    },

    about: {
      type: String,
    },

    validated: {
      type: Boolean,
      default: false,
    },

    refreshToken: String,
  },
  { timestamps: true }
);

const UserModel = model("User", userSchema);

export default UserModel;

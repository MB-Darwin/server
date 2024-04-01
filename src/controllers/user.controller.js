import { Types } from "mongoose";
import logEvent from "../configs/LogEvent.js";
import { EmployerModel, JobSeekerModel, UserModel } from "../models/index.js";
import roleList from "../constants/role.js";
import bcrypt from "bcrypt";

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user ID", status: 400 });
    }

    const user = await UserModel.findById(id).populate("role", "name").lean();

    if (!user) {
      return res.status(404).json({ msg: "User Not Found!", status: 404 });
    }

    const { role, pwd, validated, ...userData } = user;

    let formattedData;

    if (user.role?.name === roleList.Employer) {
      const employer = await EmployerModel.findOne({ userId: user._id }).lean();

      if (employer) {
        const { _id, userId, ...employerData } = employer;
        formattedData = { ...userData, ...employerData };
      }
    } else {
      const jobSeeker = await JobSeekerModel.findOne({
        userId: user._id,
      }).lean();

      if (jobSeeker) {
        const { _id, ...jobSeekerData } = jobSeeker;

        formattedData = {
          ...userData,
          ...jobSeekerData,
        };
      }
    }

    if (!formattedData) {
      return res.status(404).json({ msg: "User Not Found!", status: 404 });
    }

    res.status(200).json(formattedData);
  } catch (err) {
    logEvent(err, "error.log");
    next(err);
  }
};

export const editUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      link,
      type,
      industry,
      founded,
      headquarter,
      categories,
      professions,
      resumeUrl,
      coverLetterUrl,
      additionalDocUrl,
      interests,
      oldPwd,
      newPwd,
      ...userData
    } = req.body;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user ID", status: 400 });
    }

    // Find the user by ID
    const user = await UserModel.findById(id);
    if (!user)
      return res.status(404).json({ msg: "User Not Found!", status: 404 });

    // If both old and new passwords are provided, update password
    if (oldPwd && newPwd) {
      // Compare old password with the stored hashed password
      const match = await bcrypt.compare(oldPwd, user.pwd);
      if (!match)
        return res.status(401).json({ msg: "Invalid Password!", status: 401 });

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedNewPwd = await bcrypt.hash(newPwd, salt);

      // Update user's password
      user.pwd = hashedNewPwd;
    }

    // Update user data except for password
    Object.assign(user, userData);

    // Save updated user
    await user.save();

    // Update specific fields based on user role
    if (req.user.role === roleList.Employer) {
      await EmployerModel.findOneAndUpdate(
        { userId: id },
        { link, type, industry, founded, headquarter, categories },
        { new: true }
      );
    } else {
      await JobSeekerModel.findOneAndUpdate(
        { userId: id },
        { professions, resumeUrl, coverLetterUrl, additionalDocUrl, interests },
        { new: true }
      );
    }

    res.status(200).json({ msg: "Edited!" });
  } catch (err) {
    next(err);
  }
};

import mongoose from "mongoose";
import roleList from "../data/role.js";
import {
  ApplicationModel,
  CategoriesModel,
  EmployerModel,
  JobModel,
  UserModel,
} from "../models/index.js";
import * as validation from "../utils/validation.js";
import formatDate from "../utils/formatDate.js";
import getNumberOfApplicants from "../utils/getNumApplicants.js";

export const create = async (req, res) => {
  try {
    const { error } = validation.job(req.body);
    if (error)
      return res
        .status(400)
        .json({ msg: error.details[0].message, status: 400 });

    const {
      title,
      content,
      empType,
      XP,
      badge,
      lang,
      category,
      skills,
      schedules,
      locations,
      expDate,
      salary,
      benefits,
    } = req.body;

    const price = parseInt(salary.price);

    await CategoriesModel.findOne({
      value: category,
    }).exec();

    const employer = await EmployerModel.findOne({
      userId: req.user.id,
    }).exec();
    if (!employer)
      return res.status(403).json({ msg: "Unauthorized access", status: 403 });

    const job = new JobModel({
      title,
      content,
      empType,
      XP,
      badge,
      lang,
      category,
      skills,
      schedules,
      locations,
      expDate,
      salary: { type: salary.type, price },
      benefits,
      employerId: employer._id,
    });

    await job.save();

    res.status(201).json({ msg: "Job Created", status: 201 });
  } catch (err) {
    res.status(500).json({ msg: err.message, status: 500 });
  }
};

export const getJobs = async (req, res) => {
  try {
    if (req.user.role === roleList.Employer) {
      const employer = await EmployerModel.findOne({
        userId: req.user.id,
      })
        .populate("userId")
        .exec();

      if (!employer) {
        return res
          .status(403)
          .json({ msg: "Unauthorized access", status: 403 });
      }

      const jobs = await JobModel.find({ employerId: employer._id }).exec();

      if (!jobs || jobs.length === 0) {
        return res.status(404).json({ msg: "No jobs found", status: 404 });
      }

      const formattedJobs = await Promise.all(
        jobs.map(async (job) => {
          const numberOfApplicants = await getNumberOfApplicants(job._id);

          return {
            avatarUrl: employer.userId.avatarUrl,
            title: job.title,
            badge: job.badge,
            id: job._id,
            postedDay: formatDate(job.createdAt),
            applicantsNo: numberOfApplicants,
            XP: job.XP,
            empType: job.empType,
            price: job.salary.price,
          };
        })
      );

      return res.status(200).json(formattedJobs);
    }
  } catch (err) {
    res.status(500).json({ msg: "Internal server error", status: 500 });
  }
};

export const getJob = async (req, res) => {
  try {
    const { id } = req.params;

    const jobObject = await JobModel.findById(id).exec();
    if (!jobObject)
      return res
        .status(404)
        .json({ msg: "Job no more available", status: 404 });

    const employer = await EmployerModel.findOne(jobObject.employerId).populate(
      "userId"
    );

    const job = {
      title: jobObject.title,
      category: jobObject.category,
      locations: jobObject.locations,
      content: jobObject.content,
      skills: jobObject.skills,
      benefits: jobObject.benefits,
      schedules: jobObject.schedules,
      posDate: formatDate(jobObject.createdAt),
      expDate: formatDate(jobObject.expDate),
      salary: jobObject.salary,
      XP: jobObject.XP,
      lang: jobObject.lang,
      employerName: employer.userId.name,
      avatarUrl: employer.userId.avatarUrl,
    };

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ msg: "Internal server error", status: 500 });
  }
};

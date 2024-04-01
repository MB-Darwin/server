import mongoose from "mongoose";
import roleList from "../constants/role.js";
import {
  ApplicationModel,
  CategoriesModel,
  EmployerModel,
  JobModel,
  UserModel,
} from "../models/index.js";
import * as validation from "../utils/validation.js";
import getNumberOfApplicants from "../utils/getNumApplicants.js";

export const create = async (req, res, next) => {
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

    res.status(201).json({ msg: "Create Success!", status: 201 });
  } catch (err) {
    next(err);
  }
};

export const getJobsByEmployerId = async (req, res, next) => {
  try {
    const employer = await EmployerModel.findOne({
      userId: req.user.id,
    })
      .populate("userId")
      .exec();

    if (!employer) {
      return res.status(403).json({ msg: "Unauthorized access", status: 403 });
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
          postedDay: job.createdAt,
          applicantsNo: numberOfApplicants,
          XP: job.XP,
          empType: job.empType,
          price: job.salary.price,
        };
      })
    );

    return res.status(200).json(formattedJobs);
  } catch (err) {
    next(err);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const jobs = await JobModel.find().exec();
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ msg: "No jobs found", status: 404 });
    }

    const formattedJobs = await Promise.all(
      jobs.map(async (job) => {
        const employer = await EmployerModel.findById(job.employerId)
          .populate("userId")
          .exec();

        return {
          avatarUrl: employer.userId.avatarUrl,
          title: job.title,
          badge: job.badge,
          id: job._id,
          locations: job.locations,
          postedDay: job.createdAt,
          XP: job.XP,
          empType: job.empType,
          price: job.salary.price,
          employerName: employer.userId.name,
        };
      })
    );

    return res.status(200).json(formattedJobs);
  } catch (err) {
    next(err);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const jobObject = await JobModel.findById(id).exec();
    if (!jobObject)
      return res
        .status(404)
        .json({ msg: "Job no more available", status: 404 });

    const employer = await EmployerModel.findById(
      jobObject.employerId
    ).populate("userId");

    const job = {
      title: jobObject.title,
      category: jobObject.category,
      empType: jobObject.empType,
      locations: jobObject.locations,
      content: jobObject.content,
      skills: jobObject.skills,
      benefits: jobObject.benefits,
      schedules: jobObject.schedules,
      posDate: jobObject.createdAt,
      expDate: jobObject.expDate,
      salary: jobObject.salary,
      XP: jobObject.XP,
      lang: jobObject.lang,
      employerName: employer.userId.name,
      avatarUrl: employer.userId.avatarUrl,
    };

    res.status(200).json(job);
  } catch (err) {
    next(err);
  }
};

export const editJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = validation.job(req.body);
    if (error)
      return res
        .status(400)
        .json({ msg: error.details[0].message, status: 400 });

    const updatedJob = await JobModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }).exec();

    if (!updatedJob) {
      return res.status(404).json({ msg: "Job not found", status: 404 });
    }

    res.status(200).json({ msg: "Update Succes!", status: 200 });
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Missing job ID", status: 400 });
    }

    const deletedJob = await JobModel.findByIdAndDelete(id).exec();

    if (!deletedJob) {
      return res.status(404).json({ msg: "Job not found", status: 404 });
    }

    res.status(200).json({ msg: "Delete Success!", status: 200 });
  } catch (err) {
    next(err);
  }
};

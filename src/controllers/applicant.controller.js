import { ApplicationModel, JobModel, JobSeekerModel } from "../models/index.js";

export const applyJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jobSeeker = await JobSeekerModel.findOne({
      userId: req.user.id,
    }).exec();
    if (!jobSeeker)
      return res.status(404).json({ msg: "JobSeeker Not Found!" });

    const applicantExist = await ApplicationModel.findOne({
      jobSeekerId: jobSeeker._id,
    });

    if (applicantExist) {
      const { status, ...rest } = applicantExist;
      return res.json({ status, msg: "Applied Already!" });
    }

    const job = await JobModel.findById(id).exec();
    if (!job)
      return res.status(404).json({ msg: "Job not available", status: 404 });

    const candidate = new ApplicationModel({
      jobId: job._id,
      jobSeekerId: jobSeeker._id,
      coverLetter: jobSeeker.coverLetter,
      resumeUrl: jobSeeker.resumeUrl,
      additionalDocumentsUrl: jobSeeker.additionalDocumentsUrl,
    });

    await candidate.save();

    return res.status(201).json({ candidate, msg: "Applied!" });
  } catch (err) {
    next(err);
  }
};

export const getStatus = async (req, res, next) => {
  try {
    const { id: jobId } = req.params;

    const jobSeeker = await JobSeekerModel.findOne({
      userId: req.user.id,
    }).exec();
    if (!jobSeeker)
      return res.status(404).json({ msg: "JobSeeker Not Found!" });

    const application = await ApplicationModel.findOne({
      jobId: jobId,
      jobSeekerId: jobSeeker._id,
    }).exec();

    if (!application)
      return res.status(404).json({ msg: "Application Not Found!" });

    const { status, ...rest } = application;
    return res.json({ status });
  } catch (err) {
    next(err);
  }
};

export const getApplicantsByJobId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const applicants = await ApplicationModel.find({ jobId: id }).exec();
    if (applicants.length === 0)
      return res.status(404).json({ msg: "No candidates found", status: 404 });

    const formattedApllicants = await Promise.all(
      applicants.map(async (applicant) => {
        const jobSeeker = await JobSeekerModel.findById(applicant.jobSeekerId)
          .populate("userId")
          .exec();

        return {
          avatarUrl: jobSeeker.userId.avatarUrl,
          name: jobSeeker.userId.name,
          proffesions: jobSeeker.proffesions,
          phoneNum: jobSeeker.userId.phoneNum,
          id: applicant.id,
          status: applicant.status,
          email: jobSeeker.userId.email,
          doc: [
            applicant.coverLetter,
            applicant.resumeUrl,
            applicant.additionalDocumentsUrl,
          ],
        };
      })
    );

    return res.status(200).json(formattedApllicants);
  } catch (err) {
    next(err);
  }
};

export const editStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const applicant = await ApplicationModel.findByIdAndUpdate(id, {
      status: req.body.status,
    }).exec();
    if (!applicant)
      return res.status(404).json({ msg: "Applicant Not Found!", status: 404 });

    res.status(200).json({ msg: "Done!" });
  } catch (err) {
    next(err);
  }
};

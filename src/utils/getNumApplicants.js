import { ApplicationModel } from "../models/index.js";

const getNumberOfApplicants = (jobId) => {
  const applicantsCount = ApplicationModel.aggregate([
    { $match: { jobId } },
    { $group: { _id: "$jobId", count: { $sum: 1 } } },
  ]);
  return applicantsCount.length > 0 ? applicantsCount[0].count : 0;
};

export default getNumberOfApplicants;

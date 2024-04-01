import logEvent from "../configs/LogEvent.js";
import { ApplicationModel } from "../models/index.js";

const getNumberOfApplicants = async (jobId) => {
  try {
    // Perform aggregation
    const applicantsCount = await ApplicationModel.aggregate([
      { $match: { jobId } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
    ]);

    if (applicantsCount.length > 0) {
      return applicantsCount[0].count;
    } else {
      return 0;
    }
  } catch (err) {
    logEvent(err, "error.log");
    return 0;
  }
};

export default getNumberOfApplicants;

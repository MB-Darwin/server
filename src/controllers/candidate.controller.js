import { ApplicationModel } from "../models/index.js";

export const getCandidatesByJobId = async (req, res) => {
  try {
    const { id } = req.params;

    const candidates = await ApplicationModel.find({ jobId: id }).exec();

    if (candidates.length === 0) {
      return res.status(404).json({ msg: "No candidates found", status: 404 });
    }

    return res.status(200).json(candidates);
  } catch (err) {
    return res.status(500).json({ msg: err.message, status: 500 });
  }
};

import { RoleModel, UserModel } from "../models/index.js";

const create = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name } = req.body;
    const exist = await RoleModel.findOne({ name }).exec();

    if (exist) return res.status(409).json({ msg: "Role already exists" });

    await RoleModel.create({ name });

    res.status(201).json({ msg: "Role created successfully." });
  } catch (err) {
    next(err);
  }
};

const updateRole = async (req, res, next) => {
  try {
    await UserModel.findOneAndUpdate({
      id: req.params.id,
      role: req.body.role,
    });

    res.json({ msg: "Role updated successfully." });
  } catch (err) {
    next(err);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    await UserModel.findOneAndDelete({
      id: req.params.id,
    });

    res.json({ msg: "Role deleted successfully." });
  } catch (err) {
    next(err);
  }
};

export { create as createRole, updateRole, deleteRole };

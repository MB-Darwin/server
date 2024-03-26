import { UserModel } from "../models";

const verifyRole = (...allowedRoles) => {
  return async (req, res, next) => {
    console.log(req);
    if (!req?.id) return res.sendStatus(401);
    const roleArray = [...allowedRoles];
    console.log(roleArray);
    console.log(req.id);

    const user = await UserModel.findOne({ id: req.id });
    if (!user) return res.sendStatus(404);

    console.log(user);
    const result = roleArray.includes(user.role);

    if (result === false) return res.sendStatus(401);

    next();
  };
};

export default verifyRole;

import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader.startsWith("Bearer ")) return res.sendStatus(401);

    const doubleQuoteToken = authHeader.split(" ")[1];
    const token = JSON.parse(doubleQuoteToken);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = { id: decoded.user.id, role: decoded.user.role };
    next();
  } catch (err) {
    res.status(401).json({ msg: "Unauthorized!", status: 401 });
  }
};

export default verifyJWT;

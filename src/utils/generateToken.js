import jwt from "jsonwebtoken";

export const accessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
};

// export const refreshToken = (payload, expiresIn = "1d") => {
//   return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
//     expiresIn: expiresIn,
//   });
// };

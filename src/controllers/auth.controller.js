import roleList from "../data/role.js";
import {
  CategoriesModel,
  EmployerModel,
  JobSeekerModel,
  OTPModel,
  RoleModel,
  UserModel,
} from "../models/index.js";
import createMail from "../utils/mailer.js";
import * as validation from "../utils/validation.js";
import * as generate from "../utils/generateToken.js";

import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";

export const signUp = async (req, res) => {
  try {
    const { error } = validation.signUp(req.body);
    if (error)
      return res
        .status(400)
        .json({ msg: error.details[0].message, status: 400 });

    const { name, phoneNum, email, pwd, role, interests } = req.body;

    const userExist = await UserModel.findOne({
      email,
    }).exec();
    if (userExist)
      return res.status(409).json({ msg: "Email already exist.", status: 409 });

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(pwd, salt);

    const roleObject = await RoleModel.findOne({ name: role }).exec();
    if (!roleObject)
      return res
        .status(400)
        .json({ msg: "Invalid role specified", status: 400 });

    const user = new UserModel({
      name,
      phoneNum,
      email,
      pwd: hashedPwd,
      role: roleObject._id,
    });

    await user.save();

    if (role === roleList.JobSeeker) {
      const interestObjects = await Promise.all(
        interests.map(async (interest) => {
          return await CategoriesModel.findOne({ value: interest }).exec();
        })
      );

      const jobSeeker = new JobSeekerModel({
        userId: user._id,
        interests: interestObjects,
      });
      await jobSeeker.save();
    } else if (role === roleList.Employer) {
      const employer = new EmployerModel({
        userId: user._id,
      });
      await employer.save();
    }

    const digits = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    console.log(digits);

    const otp = new OTPModel({
      userId: user._id,
      otp: digits,
      expiresAt: Date.now() + 1800000,
    });

    await otp.save();

    createMail({
      email: user.email,
      subject: "[JobHub] Authentication Digits",
      html: `
  <main stlye="width: 100vw; height: 100vh; align-items: center;">
    <section style="margin-top: 3rem; border: 1px solid #E2E8F0; border-radius: 0.25rem; padding: 0.75rem 0.5rem; font-size: 14px;">
      <header>Hey ${user.name}!</header>

      <body>
        <p>Please use this code in JobHub to verify your email:</p>
        <strong>${digits}</strong>
        <p>Don't share this code with anyone and use it only in JobHub.</p>
        <p>If you didn't request this code, someone may have accidentally entered your email address. We recommend you to verify your contact information.</p>
        <p>Thanks for your understanding,</p>
      </body>

      <footer>Team JobHub</footer>
   </section>
  </main>
  `,
    });

    res.status(201).json({ msg: "User signed up successfully", status: 201 });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", status: 500 });
  }
};

// export const emailVerification = async (req, res) => {
//   try {
//     const otp = req.body.otp;

//     if (!otp) return res.status(400).json({ msg: "invalid OTP" });

//     const OTP = await OTPModel.findOne({ otp: req.body.otp });
//     if (!OTP) return res.status(404).json({ msg: "OTP Not Found" });

//     await UserModel.findOneAndUpdate({ _id: OTP.userId, validated: true });

//     await OTPModel.findOneAndDelete(OTP._id);
//     res.status(200).json({ msg: "Email verified successfully" });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

export const signIn = async (req, res) => {
  try {
    const { error } = validation.signIn(req.body);
    if (error)
      return res
        .status(400)
        .json({ msg: error.details[0].message, status: 400 });

    const { email, pwd } = req.body;

    const user = await UserModel.findOne({ email }).populate("role").exec();

    if (!user)
      return res.status(404).json({ msg: "Invalid Credentials", status: 404 });

    if (user.validated) {
      const match = await bcrypt.compare(pwd, user.pwd);

      if (match) {
        const accessToken = generate.accessToken({
          user: { id: user.id, role: user.role.name },
        });

        const { pwd, ...userData } = user._doc;
        res.json({
          jwt: accessToken,
          data: userData,
          msg: "sign in successful",
        });
      } else {
        res.status(401).json({ msg: "Invalid password", status: 401 });
      }
    } else {
      res
        .status(401)
        .json({ msg: "Unauthorized verify your email", status: 401 });
    }
  } catch (err) {
    res.status(500).json({ msg: "Internal server error", status: 500 });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const user = await UserModel.findOne({ refreshToken }).exec();
    if (!user) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || user.id === decoded.user.id) return res.sendStatus(403);

        const accessToken = generate.accessToken({
          user: { id: user.id, role: user.role },
        });

        res.json({ accessToken });
      }
    );
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// export const forgotPassword = async (req, res) => {
//   try {
//     const { error } = validation.forgotPassword(req.body);
//     if (error) return res.status(400).json({ msg: error.details[0].message });

//     const user = await UserModel.findOne({
//       email: req.body.email,
//     }).exec();

//     if (!user) return res.status(404).json({ msg: "Email not found" });

//     const token = generate.accessToken({
//       user: { id: user.id, role: user.role },
//     });

//     createMail({
//       email: user.email,
//       subject: "[JobHub] Password Reset",
//       html: `
//       <main stlye="width: 100vw; height: 100vh; align-items: center;">
//         <section style="margin-top: 3rem; border: 1px solid #E2E8F0; border-radius: 0.25rem; padding: 0.75rem 0.5rem; font-size: 14px;">
//           <header>Hey ${user.fullName}!</header>

//           <body>
//             <p>To reset your password for JobHub, please click the following link:</p>
//             <p>${process.env.FRONT_END_URL}auth/reset-password/${token}</p>
//             <p>If you don't want to reset your password, you can ingnore this message - someone probably typed in your email address by mistake.</p>
//             <p>Thanks for your understanding,</p>
//           </body>

//           <footer>Team JobHub</footer>
//        </section>
//       </main>
//       `,
//     });

//     res.json({ msg: "Email send successfully" });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// export const resetPassword = async (req, res) => {
//   try {
//     const { error } = validation.resetPassword(req.body);
//     if (error) return res.status(400).json({ msg: error.details[0].message });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.pwd, salt);

//     await UserModel.findByIdAndUpdate(
//       { _id: req.user.id },
//       { password: hashedPassword }
//     );

//     res.status(201).json({ msg: "Password Updated Successfully." });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

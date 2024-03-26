import nodemailer from "nodemailer";
import logEvent from "../configs/LogEvent.js";

const createMail = ({ email, subject, html }) => {
  const config = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(config);

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: html,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logEvent(error, "error.log");
      }

      resolve(info);
    });
  });
};

export default createMail;

import Joi from "joi";

export const signUp = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    role: Joi.string().required(),
    phoneNum: Joi.number().min(9).required(),
    email: Joi.string().email().min(10).required(),
    pwd: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

export const signIn = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(10).required().email(),
    pwd: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

// export const forgotPassword = (data) => {
//   const schema = Joi.object({
//     email: Joi.string().min(10).required().email(),
//   });

//   return schema.validate(data);
// };

// export const resetPassword = (data) => {
//   const schema = Joi.object({
//     pwd: Joi.string().min(5).required(),
//   });

//   return schema.validate(data);
// };

export const job = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    empType: Joi.array().required(),
    XP: Joi.string().required(),
    badge: Joi.string().required(),
    category: Joi.string().required(),
    lang: Joi.array().required(),
    skills: Joi.array().required(),
    schedules: Joi.array().required(),
    locations: Joi.array().required(),
    expDate: Joi.date().required(),
    salary: Joi.object().required(),
    benefits: Joi.array().required(),
  });

  return schema.validate(data);
};

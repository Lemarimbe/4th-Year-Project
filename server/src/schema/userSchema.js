const joi = require("joi");

const new_user_Schema = joi
  .object({
    username: joi.string().min(3).required(),
    name: joi.string().min(3),
    password: joi
      .string()
      .required()
      .pattern(new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      )),
    c_password: joi.ref("password"),
    email: joi
      .string()
      .email({ tlds: { allow: false } }).required(),
  })
  .with("password", "c_password");


module.exports = { new_user_Schema }

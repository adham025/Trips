import Joi from "joi";

export const signUpValidation = {
  body: Joi.object()
    .required()
    .keys({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email(),
      password: Joi.string()
        .regex(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[a-zA-Z]).{8,}$/)
        .messages({
          "string.pattern.base": "Password regex fail",
        })
        .required(),
      cPassword: Joi.string().valid(Joi.ref("password")).required(),
      phone: Joi.string()
        .pattern(/^(\+?\d{1,3}[- ]?)?\d{11}$/)
        .messages({
          "string.pattern.base": "Phone number must be valid",
        })
        .required(),
    }),
};

export const changePassValidation = {
  body: Joi.object()
    .required()
    .keys({
      currentPassword: Joi.string()
        .pattern(
          new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=/{}|?]).{6,}$")
        )
        .messages({
          "string.pattern":
            "password must include at least one uppercase, one digit, one special character and min length is 6",
          "string.empty": "Password is required",
        }),
      newPassword: Joi.string()
        .pattern(
          new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=/{}|?]).{6,}$")
        )
        .messages({
          "string.pattern":
            "new password must include at least one uppercase, one digit, one special character and min length is 6",
          "string.empty": "Password is required",
        }),
    }),
};

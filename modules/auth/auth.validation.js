import Joi from "joi";

export const signUpValidation = {
  body: Joi.object()
    .required()
    .keys({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email(),
      password: Joi.string()
        .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=/{}|?]).{8,}$/)
        .messages({
          "string.pattern.base":
            "Password must contain at least one letter, one number, and one special character (!@#$%^&*).",
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

export const changePassValidation = (req, res, next) => {
  console.log("validation");

  const schema = Joi.object({
    currentPassword: Joi.string()
      .pattern(
        new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=/{}|?]).{8,}$")
      )
      .required()
      .messages({
        "string.pattern.base":
          "password must include at least one uppercase, one digit, one special character and min length is 8",
        "string.empty": "Password is required",
      }),
    newPassword: Joi.string()
      .pattern(
        new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=/{}|?]).{8,}$")
      )
      .required()
      .messages({
        "string.pattern.base":
          "new password must include at least one uppercase, one digit, one special character and min length is 8",
        "string.empty": "Password is required",
      }),
  });
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      errors: error.details.map((err) => err.message.replaceAll(`\"`, "")),
    });
  }

  next();
};

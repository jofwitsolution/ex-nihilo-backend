const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema(
  {
    to: {
      type: Array,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
    messageId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
  { collation: { locale: "en", strength: 2 } }
);

const Email = mongoose.model("Email", userSchema);

function validateMail(mail) {
  const schema = Joi.object({
    to: Joi.array().required().label("To address"),
    subject: Joi.string().max(100).required().label("Subject"),
    text: Joi.string().max(1000).required().label("Message"),
  });

  return schema.validate(mail);
}

module.exports.Email = Email;
module.exports.validate = validateMail;

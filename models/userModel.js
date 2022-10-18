const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
      dropDups: true,
    },
    phone: {
      type: String,
      minlength: 8,
      maxlength: 50,
      trim: true,
      required: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    level: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    policy: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    contactMe: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    bio: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 500,
    },
    password: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 255,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    resetToken: String,
    resetTokenExpiration: Date,
  },
  { timestamps: true },
  { collation: { locale: "en", strength: 2 } }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// this will run pre saving the data
userSchema.pre("save", async function (next) {
  // if password is not included in the request
  if (!this.isModified("password")) {
    next(); // move to the next
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

function validateUser(user, task) {
  if (task === "register") {
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(50).required().label("First name"),
      lastName: Joi.string().min(3).max(50).required().label("Last name"),
      email: Joi.string().min(3).max(50).required().email().label("Email"),
      phone: Joi.string().min(3).max(50).required().label("Phone"),
      country: Joi.string().min(2).max(50).required().label("Country"),
      level: Joi.string().min(3).max(50).required().label("Level"),
      policy: Joi.string().min(3).max(50).required().label("Policy"),
      contactMe: Joi.string().min(3).max(50).required().label("Contact me"),
      password: Joi.string().min(10).max(25).required().label("Password"),
    });

    return schema.validate(user);
  } else if (task === "login") {
    const schema = Joi.object({
      email: Joi.string().required().email().label("Email"),
      password: Joi.string().required().label("Password"),
    });

    return schema.validate(user);
  } else if (task === "update") {
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(50).required().label("First name"),
      lastName: Joi.string().min(3).max(50).required().label("Last name"),
      phone: Joi.string().min(3).max(50).required().label("Phone"),
      bio: Joi.string().min(3).max(500).required().label("bio"),
      country: Joi.string().min(3).max(50).required().label("Country"),
      level: Joi.string().min(3).max(50).required().label("Level"),
    });

    return schema.validate(user);
  } else if (task === "adminUpdate") {
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(50).required().label("First name"),
      lastName: Joi.string().min(3).max(50).required().label("Last name"),
      email: Joi.string().min(3).max(50).required().email().label("Email"),
      phone: Joi.string().min(3).max(50).required().label("Phone"),
      country: Joi.string().min(3).max(50).required().label("Country"),
      level: Joi.string().min(3).max(50).required().label("Level"),
      isAdmin: Joi.boolean().required().label("Is admin"),
    });

    return schema.validate(user);
  }
  if (task === "password") {
    const schema = Joi.object({
      password: Joi.string().min(10).max(25).required().label("Password"),
    });

    return schema.validate(user);
  }
}

module.exports.User = User;
module.exports.validate = validateUser;

const config = require("config");
const crypto = require("crypto");
const { User, validate } = require("../models/userModel");
const { generateToken } = require("../utils/generateToken");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const USER = config.get("user");
const pass = config.get("pass");
const clientId = config.get("clientId");
const clientSecret = config.get("clientSecret");
const refreshToken = config.get("refreshToken");
const redirecturi = config.get("redirecturi");

const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirecturi
);
oAuth2Client.setCredentials({ refresh_token: refreshToken });

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = async (req, res) => {
  const { error } = validate(req.body, "login");
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      token: generateToken(
        user._id,
        user.firstName,
        user.lastName,
        user.isAdmin
      ),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
};

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = async (req, res) => {
  const { error } = validate(req.body, "register");

  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  let {
    firstName,
    lastName,
    email,
    phone,
    country,
    level,
    policy,
    contactMe,
    password,
  } = req.body;

  email = email.toLowerCase();

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    country,
    level,
    policy,
    contactMe,
    password,
  });

  if (user) {
    res.json({
      token: generateToken(
        user._id,
        user.firstName,
        user.lastName,
        user.isAdmin
      ),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -policy -contactMe -__v"
  );

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = async (req, res) => {
  const { error } = validate(req.body, "update");
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.phone = req.body.phone;
    user.country = req.body.country;
    user.level = req.body.level;
    user.bio = req.body.bio;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: user.phone,
      country: user.country,
      level: user.level,
      bio: user.bio,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await User.countDocuments({});
  const users = await User.find({})
    .select("-password -isAdmin -__v")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  serialNumbers = [];
  let number = 1;
  for (let i = 0; i < users.length; i++) {
    // give each user sequencial number
    serialNumbers.push(number + pageSize * (page - 1));
    number = number + 1;
  }

  res.json({ serialNumbers, users, page, pages: Math.ceil(count / pageSize) });
};

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -__v");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = async (req, res) => {
  const { error } = validate(req.body, "adminUpdate");
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const user = await User.findById(req.params.id);

  if (user) {
    const email = req.body.email.toLowerCase();

    // if email is not the existing email
    if (user.email != email) {
      // find the new email if it does not already exist
      const userExists = await User.findOne({ email });

      if (userExists) {
        res.status(400);
        throw new Error("User already exists");
      }
    }

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = email;
    user.phone = req.body.phone;
    user.country = req.body.country;
    user.level = req.body.level;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc Reset Password
// @route POST /api/users/reset-password
// @access Public
const resetPassword = async (req, res) => {
  crypto.pseudoRandomBytes(32, async (err, buffer) => {
    if (err) {
      res.status(400);
      throw new Error("Bad request");
    }
    const token = buffer.toString("hex");
    // console.log(token);
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send("User with the given email does not exist.");
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; //current time + 1hr(3600000ms)
    user = await user.save();

    let mailOptions = {
      from: "Didomi Company Limited <didomiconsortium@gmail.com>",
      to: req.body.email,
      subject: "Password reset",
      html: `
      <p>You requested a password reset.</p>
      <p>Click this <a href="http://www.didomiconsortium.com/new-password/${token}">link<a/> to set a new password.</p>
      <P>If you didn't make this request, do not hesitate to contact our support didomiconsortium@gmail.com.</p>
      <br>
      <br>
      <br>
      <h4>Thank you.</h4>
      <strong>Didomi Company Limited.</strong>
      `,
    };

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: USER,
        pass: pass,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
    });

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log(err);
        return res.status(400).send("Problem occurred.");
      } else {
        res.json({
          message: "A link to change password has been sent to your email.",
        });
      }
    });
  });
};

// @desc Get New Password
// @route GET /api/users/new-password/:id
// @access Public
const getNewPassword = async (req, res) => {
  const token = req.params.token;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send("Token expired. Request new reset.");
  }

  res.json({
    userId: user._id.toString(),
    passwordToken: token,
  });
};

// @desc Post New Password
// @route POST /api/users/new-password
// @access Public
const postNewPassword = async (req, res) => {
  const { userId, passwordToken, password } = req.body;

  const { error } = validate({ password }, "password");
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  });

  if (!user) {
    return res.status(400).send("Token expired. Request new reset.");
  }

  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;

  await user.save();

  res.json({
    message: "Password updated successfully.",
  });
};

module.exports.authUser = authUser;
module.exports.registerUser = registerUser;
module.exports.getUserProfile = getUserProfile;
module.exports.updateUserProfile = updateUserProfile;
module.exports.getUsers = getUsers;
module.exports.deleteUser = deleteUser;
module.exports.getUserById = getUserById;
module.exports.updateUser = updateUser;
module.exports.resetPassword = resetPassword;
module.exports.getNewPassword = getNewPassword;
module.exports.postNewPassword = postNewPassword;

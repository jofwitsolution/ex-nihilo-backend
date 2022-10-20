const mongoose = require("mongoose");
const colors = require("colors");
const courses = require("./data/courses");
const users = require("./data/users");
const { Course } = require("./models/courseModel");
const { User } = require("./models/userModel");
const { mongodb } = require("./startup/db");
const dotenv = require("dotenv");

dotenv.config();

require("./startup/config")();

mongodb();

// import data to mongodb
const importData = async () => {
  try {
    // await User.deleteMany();
    await Course.deleteMany();

    // const createUsers = await User.insertMany(users);
    const createCourses = await Course.insertMany(courses);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    // await Course.deleteMany();

    console.log("Data Destroyed!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// if -d argument is passed from the console
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

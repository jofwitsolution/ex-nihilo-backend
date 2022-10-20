const { Course } = require("../models/courseModel");
const isValidObjectId = require("../utils/validateId");

// @desc Create Course
// @route POST /api/courses
// @access Admin
const createCourse = async (req, res) => {
  const body = req.body;

  const course = await Course.create({
    title: body.title,
    location: body.location,
    studyMode: body.studyMode,
    startDates: body.startDates,
    institution: body.institution,
    levelOfStudy: body.levelOfStudy,
    award: body.award,
    apprenticeshipStandard: body.apprenticeshipStandard,
    apprenticeshipCertificate: body.apprenticeshipCertificate,
    fees: body.fees,
    entryRequirements: body.entryRequirements,
    engLangRequirements: body.engLangRequirements,
    modeOfStudy: body.modeOfStudy,
    duration: body.duration,
    assessmentMethods: body.assessmentMethods,
    locations: body.locations,
    video: body.video,
    about: body.about,
    EUFunding: body.EUFunding,
  });

  if (course) {
    res.json({
      message: "Course created successfully",
      course,
    });
  } else {
    res.status(400);
    throw new Error("Invalid course data");
  }
};

// @desc Get all Courses
// @route GET /api/courses
// @access Public
const getCourses = async (req, res) => {
  let courses = await Course.find({}).select("-__v");

  // console.log(universities);
  res.json(courses);
};

// @desc Get Course
// @route GET /api/courses/:title?id=id
// @access Public
const getCourse = async (req, res) => {
  let id = req.query.id;

  if (isValidObjectId(id)) {
    let course = await Course.findById(id).select("-__v");

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }
    // console.log(course);
    res.json(course);
  } else {
    res.status(400);
    throw new Error("Invalid Course ID");
  }
};

// @desc Search Course
// @route GET /api/courses/search
// @access Public
const searchCourse = async (req, res) => {
  console.log(req.query.keyword);
  const keyword = req.query.keyword
    ? {
        $regex: req.query.keyword,
        $options: "i",
      }
    : {};

  // let universities = await Universities.find({
  //   "schools.name": { ...keyword },
  // }).select("-__v");

  let course = await Course.find({ title: { ...keyword } });

  // console.log(universities);
  res.json(course);
};

// export functions
module.exports.getCourses = getCourses;
module.exports.searchCourse = searchCourse;
module.exports.createCourse = createCourse;
module.exports.getCourse = getCourse;

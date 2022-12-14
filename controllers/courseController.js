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
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1; // current page

  const count = await Course.countDocuments({});
  let courses = await Course.find({})
    .select("-__v -about")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // console.log(courses);
  const pages = Math.ceil(count / pageSize); //total pages
  const hasNextPage = page < pages;
  res.json({ courses, page, pages, hasNextPage, totalCourses: count });
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
// @route GET /api/courses/search?keyword=keyword&pageNumber=page
// @access Public
const searchCourse = async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1; // current page

  // console.log(req.query.keyword);
  const keyword = req.query.keyword
    ? {
        $regex: req.query.keyword,
        $options: "i",
      }
    : {
        $regex: "_",
        $options: "i",
      };

  const count = await Course.countDocuments({
    $or: [
      { title: { ...keyword } },
      { levelOfStudy: { ...keyword } },
      { institution: { ...keyword } },
      { location: { ...keyword } },
    ],
  });
  let courses = await Course.find({
    $or: [
      { title: { ...keyword } },
      { levelOfStudy: { ...keyword } },
      { institution: { ...keyword } },
      { location: { ...keyword } },
    ],
  })
    .select("-__v -about")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const pages = Math.ceil(count / pageSize); //total pages
  const hasNextPage = page < pages;
  res.json({ courses, page, pages, hasNextPage, totalCourses: count });
};

// @desc Filter Course
// @route GET /api/courses/filterby/:field?selection=selection&pageNumber=page
// @access Public
const filterCourse = async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1; // current page

  const field = req.params.field;
  const selection = req.query.selection
    ? {
        $regex: req.query.selection,
        $options: "i",
      }
    : { $regex: "_", $options: "i" };

  const count = await Course.countDocuments({ [field]: { ...selection } });
  let courses = await Course.find({ [field]: { ...selection } })
    .select("-__v -about")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // console.log(count);
  const pages = Math.ceil(count / pageSize); //total pages
  const hasNextPage = page < pages;
  res.json({ courses, page, pages, hasNextPage, totalCourses: count });
};

module.exports.getCourses = getCourses;
module.exports.searchCourse = searchCourse;
module.exports.createCourse = createCourse;
module.exports.getCourse = getCourse;
module.exports.filterCourse = filterCourse;

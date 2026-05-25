const Profile = require("../models/Profile");

//Create or update profile
const createOrUpdateProfile = async (req, res) => {
  try {
    const { skills, experience, education, bio, linkedin, portfolio } =
      req.body || {};

    //Resume path
    let resumePath = "";

    if (req.file) {
      resumePath = req.file.path;
    }

    //Find existing profile for authenticated user
    let profile = await Profile.findOne({
      userId: req.user._id,
    });

    //Convert skills string to array
    const skillsArray = skills
      ? skills.split(",").map((skill) => skill.trim())
      : [];

    if (profile) {
      //Update profile
      profile.skills = skillsArray;
      profile.experience = experience;
      profile.education = education;
      profile.bio = bio;
      profile.linkedin = linkedin;
      profile.portfolio = portfolio;

      if (resumePath) {
        profile.resume = resumePath;
      }

      await profile.save();

      return res.json(profile);
    }

    // Create profile
    profile = await Profile.create({
      userId: req.user._id,
      resume: resumePath,
      skills: skillsArray,
      experience,
      education,
      bio,
      linkedin,
      portfolio,
    });

    res.status(201).json(profile);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET MY PROFILE
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      userId: req.user._id,
    }).populate("userId", "firstName lastName email");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL CANDIDATE PROFILES
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "firstName lastName email role",
    );

    res.json(profiles);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  getAllProfiles,
};

const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const Profile = require("../models/Profile");
const User = require("../models/User");

const uploadResumeToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "resumes",
        public_id: `${Date.now()}-${file.originalname}`,
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });

//Create or update profile
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      skills,
      experience,
      education,
      bio,
      linkedin,
      portfolio,
      password,
    } = req.body || {};

    //Resume path
    let resumePath = "";

    if (req.file) {
      const uploadResult = await uploadResumeToCloudinary(req.file);
      resumePath = uploadResult.secure_url;
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
      // Update user fields for candidate
      const { firstName, lastName, email, phone } = req.body || {};
      const user = await User.findById(req.user._id);

      if (user) {
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        if (password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
      }

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

      const populated = await Profile.findById(profile._id).populate(
        "userId",
        "firstName lastName email phone role isActive",
      );

      return res.json(populated);
    }

    // Update user fields for candidate when profile is first created
    const { firstName, lastName, email, phone } = req.body || {};
    const user = await User.findById(req.user._id);
    if (user) {
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (phone) user.phone = phone;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      await user.save();
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

    const created = await Profile.findById(profile._id).populate(
      "userId",
      "firstName lastName email phone role isActive",
    );

    res.status(201).json(created);
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
    }).populate("userId", "firstName lastName email phone role isActive");

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
      "firstName lastName email role phone isActive",
    );

    res.json(profiles);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET CANDIDATE PROFILE BY ID
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate(
      "userId",
      "firstName lastName email role phone isActive",
    );

    if (!profile) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE CANDIDATE AS RECRUITER/ADMIN
const createCandidateByRecruiter = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      skills,
      experience,
      education,
      bio,
      linkedin,
      portfolio,
    } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "First name, last name, email, and password are required.",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "Candidate already exists with this email.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: "Candidate",
    });

    const skillsArray = skills
      ? skills.split(",").map((skill) => skill.trim())
      : [];

    const resumePath = req.file
      ? (await uploadResumeToCloudinary(req.file)).secure_url
      : "";

    const profile = await Profile.create({
      userId: user._id,
      resume: resumePath,
      skills: skillsArray,
      experience,
      education,
      bio,
      linkedin,
      portfolio,
    });

    const createdProfile = await Profile.findById(profile._id).populate(
      "userId",
      "firstName lastName email role phone isActive",
    );

    res.status(201).json(createdProfile);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE CANDIDATE PROFILE AS RECRUITER/ADMIN
const updateProfileById = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      skills,
      experience,
      education,
      bio,
      linkedin,
      portfolio,
    } = req.body || {};

    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const user = await User.findById(profile.userId);
    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: user._id },
      });
      if (emailExists) {
        return res.status(400).json({
          message: "Another user already exists with this email.",
        });
      }
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    await user.save();

    if (skills !== undefined) {
      profile.skills = skills
        ? skills.split(",").map((skill) => skill.trim())
        : [];
    }
    profile.experience = experience ?? profile.experience;
    profile.education = education ?? profile.education;
    profile.bio = bio ?? profile.bio;
    profile.linkedin = linkedin ?? profile.linkedin;
    profile.portfolio = portfolio ?? profile.portfolio;

    if (req.file) {
      const uploadResult = await uploadResumeToCloudinary(req.file);
      profile.resume = uploadResult.secure_url;
    }

    await profile.save();

    const updatedProfile = await Profile.findById(req.params.id).populate(
      "userId",
      "firstName lastName email role phone isActive",
    );

    res.json(updatedProfile);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// TOGGLE CANDIDATE ACTIVE STATUS
const updateCandidateActiveStatus = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const user = await User.findById(profile.userId);
    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    user.isActive = req.body.isActive ?? !user.isActive;
    await user.save();

    const updatedProfile = await Profile.findById(req.params.id).populate(
      "userId",
      "firstName lastName email role phone isActive",
    );

    res.json(updatedProfile);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  getAllProfiles,
  getProfileById,
  createCandidateByRecruiter,
  updateProfileById,
  updateCandidateActiveStatus,
};

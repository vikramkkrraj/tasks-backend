import Profile from "../models/Profile.js";
import User from "../models/User.js";

export const addProfile = async (req, res) => {
    try {
        const { bio, socialMediaLinks, user } = req.body;
        const existingUser = await User.findById(user);
        if (!existingUser) return res.status(404).json({ error: "User not found" });

        const existingProfile = await Profile.findOne({ user });
        if (existingProfile) return res.status(400).json({ error: "Profile already exists for this user" });

        const profile = new Profile({ bio, socialMediaLinks, user });
        await profile.save();
        res.status(201).json(profile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", "name email");
        res.status(200).json(profiles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
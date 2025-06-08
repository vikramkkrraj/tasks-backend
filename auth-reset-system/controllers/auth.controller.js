const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendResetEmail } = require("../utils/sendMail");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send("Email already exists");
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.send("Signup successful");
  } catch (err) {
    res.status(500).send("Error signing up");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send("Invalid credentials");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send("Invalid credentials");
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).send("Error logging in");
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.send("If that email exists, a reset link has been sent.");
    const token = jwt.sign({ userId: user._id }, process.env.JWT_RESET_SECRET, { expiresIn: "20m" });
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 20 * 60000;
    await user.save();
    await sendResetEmail(email, token);
    res.send("If that email exists, a reset link has been sent.");
  } catch (err) {
    res.status(500).send("Error sending reset link");
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const payload = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findOne({ _id: payload.userId, resetToken: token });
    if (!user || user.resetTokenExpiry < Date.now()) {
      return res.status(400).send("Invalid or expired token");
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.send("Password reset successful");
  } catch (err) {
    res.status(400).send("Invalid or expired token");
  }
};

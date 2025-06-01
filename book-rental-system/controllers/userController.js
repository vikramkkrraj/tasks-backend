import User from "../models/User.js";
import Book from "../models/Book.js";

export const addUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserRentals = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("rentedBooks");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.rentedBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
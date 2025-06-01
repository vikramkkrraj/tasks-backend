
import Member from "../models/Member.js";

export const addMember = async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(200).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMemberBorrowedBooks = async (req, res) => {
  try {
    const member = await Member.findById(req.params.memberId).populate("borrowedBooks");
    res.status(200).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

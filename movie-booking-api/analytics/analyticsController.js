import Booking from '../models/booking.js';
export const movieBookings = async (req, res) => {
  const result = await Booking.aggregate([
    { $group: { _id: "$movieId", totalBookings: { $sum: 1 }, totalSeats: { $sum: "$seats" } } }
  ]);
  res.json(result);
};
export const userBookings = async (req, res) => {
  const result = await Booking.aggregate([
    { $lookup: { from: "movies", localField: "movieId", foreignField: "_id", as: "movie" } },
    { $unwind: "$movie" },
    { $group: { _id: "$userId", bookings: { $push: "$movie.title" } } }
  ]);
  res.json(result);
};
export const topUsers = async (req, res) => {
  const result = await Booking.aggregate([
    { $group: { _id: "$userId", total: { $sum: 1 } } },
    { $match: { total: { $gt: 2 } } }
  ]);
  res.json(result);
};
export const genreWiseBookings = async (req, res) => {
  const result = await Booking.aggregate([
    { $lookup: { from: "movies", localField: "movieId", foreignField: "_id", as: "movie" } },
    { $unwind: "$movie" },
    { $group: { _id: "$movie.genre", totalSeats: { $sum: "$seats" } } }
  ]);
  res.json(result);
};
export const activeBookings = async (req, res) => {
  const result = await Booking.aggregate([
    { $match: { status: "Booked" } },
    { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
    { $unwind: "$user" },
    { $lookup: { from: "movies", localField: "movieId", foreignField: "_id", as: "movie" } },
    { $unwind: "$movie" },
    { $project: { userName: "$user.name", movieTitle: "$movie.title", seats: 1, bookingDate: 1 } }
  ]);
  res.json(result);
};

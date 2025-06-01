import Movie from '../models/movie.js';
export const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(200).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

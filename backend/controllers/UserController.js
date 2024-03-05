const User = require("../models/UserModel");

module.exports.getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (user) {
      return res.json({ msg: "success", movies: user.likedMovies });
    } else {
      return res.status(404).json({ msg: "User with given email not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error fetching movies." });
  }
};

module.exports.addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;

    // Check if the email and data are provided
    if (!email || !data) {
      return res.status(400).json({ msg: "Invalid request. Email and data are required." });
    }

    let user = await User.findOne({ email });

    if (user) {
      const { likedMovies } = user;
      const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);

      if (!movieAlreadyLiked) {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            likedMovies: [...likedMovies, data],
          },
          { new: true }
        );

        return res.json({ msg: "Movie successfully added to the liked list.", user });
      } else {
        return res.status(400).json({ msg: "Movie already added to the liked list." });
      }
    } else {
      // Create a new user if not found
      user = await User.create({ email, likedMovies: [data] });
      return res.json({ msg: "Movie successfully added to the liked list.", user });
    }
  } catch (error) {
    console.error("Error adding movie to the liked list:", error);
    return res.status(500).json({ msg: "Internal server error adding movie to the liked list." });
  }
};

module.exports.removeFromLikedMovies = async (req, res) => {
  try {
    const { email, movieId } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const movies = user.likedMovies;
      const movieIndex = movies.findIndex(({ id }) => id === movieId);
      if (movieIndex === -1) {
        return res.status(400).send({ msg: "Movie not found." });
      }
      movies.splice(movieIndex, 1);
      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies: movies,
        },
        { new: true }
      );
      return res.json({ msg: "Movie successfully removed.", movies });
    } else {
      return res.json({ msg: "User with given email not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error removing movie from the liked list" });
  }
};
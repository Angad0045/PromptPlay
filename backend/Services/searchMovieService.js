const mapMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  release_date: movie.release_date,
  popularity: movie.popularity,
  vote_average: movie.vote_average,
  vote_count: movie.vote_count,
  poster_path: movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null,
  backdrop_path: movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null,
  genre_ids: movie.genre_ids,
  original_language: movie.original_language,
  adult: movie.adult,
});

module.exports = { mapMovie };

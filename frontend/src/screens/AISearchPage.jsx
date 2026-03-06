import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../Utils/Constants";
// import MovieCard from "../component/MovieCard";
import { Box, CircularProgress } from "@mui/material";

const AISearchPage = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiSearchResult, setAISearchResult] = useState([]);

  const handleAISearch = async () => {
    console.log(prompt);
    setLoading(true);
    const res = await axios.post(
      `${BASE_URL}/movieRecommender/api/movies/suggestions`,
      { prompt: prompt },
      { withCredentials: true },
    );
    console.log();
    setAISearchResult(res?.data?.data);
    setPrompt("");
    setLoading(false);
  };
  return (
    <>
      <div className="relative min-h-screen w-screen overflow-hidden text-white">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10 bg-neutral-900">
          <div className="mix-blend-overlay">
            {/* <img
              className="w-full min-h-screen object-cover object-center mix-blend-overlay bg-neutral-700"
              src="AISearchPageBg.jpg"
              alt="Poster"
            /> */}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="mt-20 px-7 text-center text-2xl font-black text-red-800 md:px-20 md:text-4xl lg:text-5xl">
            Search with AI : It is not finding information; it is the discovery
            of insight.
          </h1>
          <div className="relative mt-10 flex h-14 w-3/4 items-center justify-center lg:w-1/2">
            <input
              className="h-full w-full rounded-2xl border-2 border-transparent bg-neutral-600/50 p-5 text-neutral-400 focus:border-2 focus:border-red-800 focus:outline-none"
              type="text"
              value={prompt}
              placeholder="Enter Prompt"
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              className="absolute right-5 hover:text-red-800"
              onClick={handleAISearch}
            >
              <SearchIcon fontSize="large" />
            </button>
          </div>
          {loading && (
            <div className="mt-10 flex items-center justify-center gap-3 text-red-900">
              <h1 className="text-3xl font-bold">Generating...</h1>
              <Box sx={{ display: "flex" }}>
                <CircularProgress color="inherit" />
              </Box>
            </div>
          )}
          {/* {aiSearchResult && (
            <div className="my-10 grid grid-cols-2 gap-2 p-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {aiSearchResult.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  poster_path={movie.poster_path}
                  title={movie.title}
                  overview={movie.overview}
                />
              ))}
            </div>
          )} */}
        </div>
      </div>
    </>
  );
};

export default AISearchPage;

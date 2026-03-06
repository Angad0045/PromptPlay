import { useState, useEffect } from "react";
import { useTrendingMoviesQuery } from "../Utils/Slices/moviesApi";

function HeroSection() {
  const { data, error } = useTrendingMoviesQuery();
  const [randomIndex, setRandomIndex] = useState(() =>
    Math.floor(Math.random() * 10),
  );

  useEffect(() => {
    const interval = setInterval(
      () => {
        setRandomIndex(Math.floor(Math.random() * 10));
      },
      30 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  if (error) return <div>Something went wrong.</div>;
  if (!data?.movies) return null;

  const res = data.movies.slice(0, 10);
  const { title, backdrop_path } = res[randomIndex];

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Banner */}
      <div className="relative h-150 w-full mask-b-from-50%">
        <img
          className="h-full w-full object-cover"
          src={backdrop_path}
          alt={title}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      </div>

      {/* Trending Movies Row */}
      <div className="no-scrollbar -mt-50 mb-5 flex items-center overflow-x-scroll mask-x-from-95% md:mb-10 md:ml-5 lg:ml-20 xl:ml-40">
        {res.map((movie, index) => (
          <div
            key={movie.id}
            className="relative z-10 flex flex-shrink-0 cursor-pointer overflow-y-hidden"
          >
            <p className="absolute bottom-0 left-10 z-[100] text-9xl font-black tracking-tight text-neutral-50">
              {index + 1}
            </p>
            <div className="ml-20 h-60 w-40 rounded-lg">
              <img
                className="h-full w-full rounded-lg object-cover"
                src={movie.poster_path}
                alt={movie.title}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeroSection;

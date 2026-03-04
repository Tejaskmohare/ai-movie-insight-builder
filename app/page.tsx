'use client';

import { useState } from 'react';

interface MovieData {
  Title: string;
  Year: string;
  Poster: string;
  imdbRating: string;
  Actors: string;
  Plot: string;
}

export default function Home() {
  const [imdbId, setImdbId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<MovieData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setMovie(null);
    
    if (!imdbId.trim()) {
      setError('Please enter an IMDb ID');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/movie?imdbId=${encodeURIComponent(imdbId)}`);
      const json = await response.json();

      if (!json.success) {
        setError(json.error || 'Failed to fetch movie data');
        setLoading(false);
        return;
      }

      setMovie(json.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(59,130,246,0))] -z-10"></div>
      
      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            🎬 AI Movie Insight
          </h1>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg font-light">
            Search for movies by IMDb ID and get instant details
          </p>
        </div>

        {/* Search Form Card */}
        <div className="bg-slate-800/60 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 mb-8 border border-slate-700/50 hover:border-blue-500/30 hover:shadow-blue-500/20 transition-all duration-300">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter IMDb ID (e.g., tt0111161)"
              value={imdbId}
              onChange={(e) => setImdbId(e.target.value)}
              className="flex-1 px-4 sm:px-5 py-3 rounded-lg bg-slate-700/50 backdrop-blur border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-slate-700 transition-all duration-200 text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-12 sm:py-20">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-cyan-500 animate-spin"></div>
              {/* Inner counter-rotating ring */}
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-400 animate-spin" style={{animationDirection: 'reverse'}}></div>
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <span className="mt-6 text-slate-300 text-sm sm:text-base font-medium animate-pulse">Fetching movie data...</span>
          </div>
        )}

        {/* Error Message Card */}
        {error && (
          <div className="bg-red-900/20 backdrop-blur border border-red-700/50 rounded-lg p-4 sm:p-6 mb-8 animate-shake">
            <p className="text-red-300 font-semibold text-sm sm:text-base">❌ Error: {error}</p>
          </div>
        )}

        {/* Movie Details Card */}
        {movie && (
          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 p-6 sm:p-8">
              {/* Poster */}
              <div className="md:col-span-1">
                {movie.Poster && movie.Poster !== 'N/A' ? (
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full rounded-lg shadow-xl object-cover hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600">
                    <p className="text-slate-400 text-center px-4">No Poster Available</p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="md:col-span-2 flex flex-col justify-between">
                <div>
                  {/* Title & Year */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                    {movie.Title}
                  </h2>
                  <p className="text-slate-400 text-base sm:text-lg mb-6 font-light">
                    {movie.Year}
                  </p>

                  {/* Rating */}
                  {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                    <div className="mb-6 flex items-center gap-3 bg-blue-900/20 backdrop-blur px-4 py-3 rounded-lg border border-blue-800/50 w-fit">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-2xl animate-pulse">★</span>
                        <span className="text-white text-2xl font-bold">
                          {movie.imdbRating}
                        </span>
                      </div>
                      <span className="text-slate-400 font-light">/10</span>
                    </div>
                  )}

                  {/* Cast */}
                  {movie.Actors && movie.Actors !== 'N/A' && (
                    <div className="mb-6">
                      <h3 className="text-slate-200 font-semibold mb-2 text-sm uppercase tracking-wide">Cast</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {movie.Actors}
                      </p>
                    </div>
                  )}

                  {/* Plot */}
                  {movie.Plot && movie.Plot !== 'N/A' && (
                    <div className="bg-slate-900/30 backdrop-blur px-4 sm:px-5 py-4 rounded-lg border border-slate-700/50">
                      <h3 className="text-slate-200 font-semibold mb-3 text-sm uppercase tracking-wide">Plot</h3>
                      <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        {movie.Plot}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !movie && (
          <div className="text-center py-16 sm:py-20">
            <p className="text-slate-400 text-base sm:text-lg font-light">
              Enter an IMDb ID above to get started
            </p>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

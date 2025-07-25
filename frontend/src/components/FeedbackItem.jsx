import React, { useState } from "react";

function FeedbackItem({ feedback, onVote, onDelete, rank }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [votingType, setVotingType] = useState(null);

  const handleVote = async (type) => {
    setVotingType(type);
    await onVote(feedback.id, type);
    setVotingType(null);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(feedback.id);
  };

  const getVoteColorClass = (votes) => {
    if (votes > 0) return "text-green-600 bg-green-50 border-green-200";
    if (votes < 0) return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getRankBadge = (rank) => {
    if (rank === 1)
      return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-lg ring-2 ring-yellow-200";
    if (rank === 2)
      return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 shadow-lg ring-2 ring-gray-200";
    if (rank === 3)
      return "bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900 shadow-lg ring-2 ring-orange-200";
    return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600";
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "👑";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "⭐";
  };

  return (
    <div
      className={`group relative bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 ${
        isDeleting ? "opacity-50 scale-95" : ""
      }`}
    >
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {rank <= 3 && (
                <div
                  className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${getRankBadge(
                    rank
                  )} animate-pulse`}
                >
                  <span>{getRankIcon(rank)}</span>
                  <span>#{rank}</span>
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-800 transition-colors duration-200">
                {feedback.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="hover:text-blue-600 transition-colors duration-200">
                {feedback.email}
              </span>
            </div>
          </div>
          <button
            className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-xl group-hover:scale-110"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete feedback"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl p-4 mb-6">
          <p className="text-gray-700 leading-relaxed text-base">
            {feedback.message}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              className={`group/btn p-3 rounded-xl bg-white border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all duration-200 transform hover:scale-110 ${
                votingType === "upvote"
                  ? "scale-110 border-green-400 bg-green-50"
                  : ""
              }`}
              onClick={() => handleVote("upvote")}
              disabled={votingType !== null}
              aria-label="Upvote"
            >
              <svg
                className="w-5 h-5 text-gray-500 group-hover/btn:text-green-600 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>

            <div
              className={`px-6 py-3 rounded-xl font-bold text-lg border-2 transition-all duration-200 ${getVoteColorClass(
                feedback.votes
              )}`}
            >
              <span className="flex items-center gap-1">
                {feedback.votes > 0 && (
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                )}
                {feedback.votes === 0 && "~"}
                {feedback.votes < 0 && (
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
                {Math.abs(feedback.votes)}
              </span>
            </div>

            <button
              className={`group/btn p-3 rounded-xl bg-white border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 transition-all duration-200 transform hover:scale-110 ${
                votingType === "downvote"
                  ? "scale-110 border-red-400 bg-red-50"
                  : ""
              }`}
              onClick={() => handleVote("downvote")}
              disabled={votingType !== null}
              aria-label="Downvote"
            >
              <svg
                className="w-5 h-5 text-gray-500 group-hover/btn:text-red-600 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {(() => {
                const date = new Date(feedback.createdAt);
                if (isNaN(date.getTime())) {
                  return "Date unavailable";
                }
                return date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackItem;

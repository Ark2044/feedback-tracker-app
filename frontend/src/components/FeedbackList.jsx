import React from "react";
import FeedbackItem from "./FeedbackItem";

function FeedbackList({ feedback, onVote, onDelete }) {
  if (feedback.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce delay-500"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-1000"></div>
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">
          No feedback yet!
        </h3>
        <p className="text-gray-500 text-lg mb-2">
          Be the first to share your thoughts
        </p>
        <p className="text-gray-400 text-sm">
          Your feedback helps us create better experiences for everyone ✨
        </p>

        <div className="mt-8 flex justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-3 w-3"></div>
            <div className="rounded-full bg-gray-300 h-3 w-3"></div>
            <div className="rounded-full bg-gray-200 h-3 w-3"></div>
          </div>
        </div>
      </div>
    );
  }

  const sortedFeedback = [...feedback].sort((a, b) => {
    // First sort by votes (descending)
    if (b.votes !== a.votes) return b.votes - a.votes;
    // Then by date (newest first) - handle invalid dates
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    // If both dates are invalid, maintain original order
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
    // If only one date is invalid, put the valid one first
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    // Both dates are valid, sort normally
    return dateB - dateA;
  });

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">
            {feedback.length} total feedback{feedback.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            {feedback.filter((f) => f.votes > 0).length} positive
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            {feedback.filter((f) => f.votes < 0).length} needs attention
          </span>
        </div>
      </div>

      {/* Feedback Items */}
      <div className="space-y-4">
        {sortedFeedback.map((item, index) => (
          <div
            key={item.id}
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <FeedbackItem
              feedback={item}
              onVote={onVote}
              onDelete={onDelete}
              rank={index + 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedbackList;

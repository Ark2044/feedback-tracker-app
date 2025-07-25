import React, { useState, useEffect } from "react";
import axios from "axios";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function App() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/feedback`);
      setFeedbackList(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch feedback");
      console.error("Error fetching feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmit = async (feedbackData) => {
    try {
      const response = await axios.post(`${API_URL}/feedback`, feedbackData);
      setFeedbackList([...feedbackList, response.data]);
      return { success: true };
    } catch (err) {
      console.error("Error submitting feedback:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Failed to submit feedback",
      };
    }
  };

  const handleVote = async (id, type) => {
    try {
      const response = await axios.put(`${API_URL}/feedback/${id}/vote`, {
        type,
      });
      setFeedbackList(
        feedbackList.map((item) => (item.id === id ? response.data : item))
      );
    } catch (err) {
      console.error("Error updating vote:", err);
      alert("Failed to update vote");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/feedback/${id}`);
      setFeedbackList(feedbackList.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting feedback:", err);
      alert("Failed to delete feedback");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header with gradient and animation */}
      <header className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse delay-1000"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 drop-shadow-sm">
            ✨ Feedback Tracker
          </h1>
          <p className="text-center mt-2 text-blue-100 text-lg font-light">
            Share your thoughts and help us improve
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Form Section */}
          <section className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 sticky top-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Share Your Feedback
                </h2>
              </div>
              <FeedbackForm onSubmit={handleSubmit} />
            </div>
          </section>

          {/* Enhanced Feedback List Section */}
          <section className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
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
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Community Feedback
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>
                    {feedbackList.length}{" "}
                    {feedbackList.length === 1 ? "response" : "responses"}
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col justify-center items-center py-16">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-blue-400 to-purple-500 border-t-transparent"></div>
                    <div className="animate-ping absolute inset-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"></div>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">
                    Loading feedback...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-red-600 font-semibold text-lg">{error}</p>
                  <button
                    onClick={fetchFeedback}
                    className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <FeedbackList
                  feedback={feedbackList}
                  onVote={handleVote}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="mt-16 py-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300">
            Made with ❤️ for better user experiences
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

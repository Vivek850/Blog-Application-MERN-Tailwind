import { useState, useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SettingsPage() {
  const { darkMode, setDarkMode, font, setFont } = useContext(ThemeContext);
  const [fontOpen, setFontOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const isGuest = localStorage.getItem("guest") === "true"; //  guest flag check

      if (isGuest) {
        //  Guest logout: just clear flag and redirect
        localStorage.removeItem("guest");
        console.log("Guest logged out");
        navigate("/login");
        return;
      }

      //  Normal user logout
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          headers: { Authorization: token },
          withCredentials: true,
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      console.log("User logged out");
      navigate("/login");
    } catch (error) {
      console.error(
        "Error during logout:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div
      className={`h-screen pt-[6em] flex flex-col items-center p-8 ${font} ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Gradient border wrapper */}
      <div className="w-full max-w-lg p-[3px] rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 flex flex-col h-full">
        <div className="bg-white dark:bg-gray-300 rounded-xl p-6 flex flex-col flex-1">
          <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>

          {/* Light/Dark Mode */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-semibold">Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="w-5 h-5"
            />
          </div>

          {/* Font Change Accordion */}
          <div className="mb-6">
            <button
              onClick={() => setFontOpen(!fontOpen)}
              className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold"
            >
              Change Font
            </button>
            {fontOpen && (
              <div className="mt-2 flex flex-col border rounded-lg overflow-hidden">
                <button
                  onClick={() => {
                    setFont("font-sans");
                    setFontOpen(false);
                  }}
                  className="px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Sans
                </button>
                <button
                  onClick={() => {
                    setFont("font-serif");
                    setFontOpen(false);
                  }}
                  className="px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Serif
                </button>
                <button
                  onClick={() => {
                    setFont("font-mono");
                    setFontOpen(false);
                  }}
                  className="px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Monospace
                </button>
              </div>
            )}
          </div>

          {/* Logout button bilkul niche */}
          <button
            onClick={handleLogout}
            className="mt-auto w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

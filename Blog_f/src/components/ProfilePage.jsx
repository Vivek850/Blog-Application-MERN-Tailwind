import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "./ThemeContext";
import PostCard from "./PostCard"; // 👈 अब PostCard reuse करेंगे

function ProfilePage() {
  const { darkMode, font } = useContext(ThemeContext);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);

        const res = await axios.get("http://localhost:5000/api/profile/posts", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setUser(res.data.user); // ✅ backend se user info
        setBlogs(res.data.posts); // ✅ posts list
        // setBlogs(res.data);
      } catch (error) {
        console.error(
          "Error fetching profile posts:",
          error.response ? error.response.data : error.message,
        );
      }
    };

    fetchUserPosts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div
        className={`${font} ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} shadow-lg rounded-lg p-8 pt-20 w-full h-full text-center`}
      >
        {/* Profile Photo */}
        <img
          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?._id}`}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-500"
        />

        {/* Dynamic User Name */}
        <h1 className="text-2xl font-bold mb-6">
          {user ? user.name : "Loading..."}
        </h1>

        {/* Blogs Section */}
        <div className="space-y-4 text-left">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              // 👇 अब हर blog को PostCard से render करेंगे
              <PostCard
                key={blog._id}
                post={blog}
                setPosts={(updater) => setBlogs((prev) => updater(prev))}
                isProfilePage={true}
              />
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

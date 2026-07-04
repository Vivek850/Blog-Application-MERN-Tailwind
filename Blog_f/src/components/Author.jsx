import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom"; // 👈 clicked author id
import axios from "axios";
import { ThemeContext } from "./ThemeContext";
import PostCard from "./PostCard";

function Author() {
  const { darkMode, font } = useContext(ThemeContext);
  const [blogs, setBlogs] = useState([]);
  const [author, setAuthor] = useState(null);
  const { id } = useParams(); // 👈 route param

  useEffect(() => {
    const fetchAuthorPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/author/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          // ,
          // withCredentials: true,
        });

        setAuthor(res.data.author?.name || "Unknown"); // ✅ backend se user info
        setBlogs(res.data.posts); // ✅ posts list
        // setBlogs(res.data);
        if (res.data.length > 0) {
          setAuthor(res.data[0].authorName); // 👈 dynamic author name
        } else {
          const userRes = await axios.get(
            `http://localhost:5000/api/users/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setAuthor(userRes.data.name);
        }
      } catch (error) {
        console.error(
          "Error fetching author posts:",
          error.response ? error.response.data : error.message,
        );
      }
    };

    fetchAuthorPosts();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div
        className={`${font} ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} shadow-lg rounded-lg p-8 pt-20 w-full h-screen text-center`}
      >
        <img
          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${id}`}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-500"
        />

        <h1 className="text-2xl font-bold mb-6">
          {author ? author : "Loading..."}
        </h1>
        <div className="space-y-4 text-left">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <PostCard
                key={blog._id}
                post={blog}
                setPosts={setBlogs}
                isProfilePage={false}
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

export default Author;

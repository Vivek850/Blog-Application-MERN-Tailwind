import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password },
        { withCredentials: true },
      );

      // token save karo
      localStorage.setItem("token", res.data.token);

      // user object save karo
      localStorage.setItem(
        "user",
        JSON.stringify({ _id: res.data.user._id, name: res.data.user.name }),
      );

      console.log("Signup response:", res.data);
      navigate("/login");
    } catch (error) {
      console.error(
        "Error during signup:",
        error.response ? error.response.data : error.message,
      );
    }
  };

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   console.log("Redirect to login page");
  //   navigate("/login");
  //   // yahan tum navigate("/login") kar sakte ho agar React Router use kar rahe ho
  // };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h1>
        <form onSubmit={handleSignup} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <button
          onClick={(e) => {
            e.preventDefault();
            navigate("/login");
          }}
          className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Login
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/home"; // redirect to home
          }}
          className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Skip / Continue as Guest
        </button>
      </div>
    </div>
  );
}

export default SignupPage;

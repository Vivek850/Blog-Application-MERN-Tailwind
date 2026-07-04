import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("Login response:", res.data);

      // Token ya user info ko localStorage/sessionStorage me save karo
      // localStorage.setItem("guest", "false"); // Guest ko false set karo
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({ _id: res.data.user, name: res.data.name }));

      // Login ke baad Profile page par redirect
      navigate("/profile");
    } catch (error) {
      console.error(
        "Error during login:",
        error.response ? error.response.data : error.message
      );
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-500 via-blue-500 to-purple-500">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <button
          onClick={() => navigate("/signup")}
          className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default LoginPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../../config/styles";
import { fadeIn, textVariant } from "../../utils/motion";

const AdminLogin = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simple static check for demo
    setTimeout(() => {
      setLoading(false);
      if (form.username === "admin" && form.password === "admin123") {
        navigate("/admin-dashboard");
      } else {
        setError("Invalid credentials");
      }
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary">
      <Tilt className="xs:w-[400px] w-full">
        <motion.div
          variants={fadeIn("up", "spring", 0.2, 1)}
          className="green-pink-gradient p-[2px] rounded-[20px] shadow-card"
        >
          <div className="bg-tertiary rounded-[20px] py-10 px-8 flex flex-col items-center">
            <motion.h2
              variants={textVariant()}
              className="text-white text-[28px] font-bold mb-6 text-center"
            >
              Admin Login
            </motion.h2>
            <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                className="bg-secondary py-3 px-5 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-secondary py-3 px-5 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-green-400 py-3 rounded-lg text-white font-bold shadow-md hover:scale-105 transition-transform duration-300"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              {error && <p className="text-red-400 text-center">{error}</p>}
            </form>
          </div>
        </motion.div>
      </Tilt>
    </div>
  );
};

export default AdminLogin;

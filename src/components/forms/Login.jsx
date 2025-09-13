import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { styles } from "../../config/styles";
import { fadeIn, textVariant } from "../../utils/motion";

const Login = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    setLoading(true);
    // Add login logic here
     const respomse= await fetch('http://localhost:5000/login', {
      method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
    });
    setTimeout(() => setLoading(false), 1500);
    
    if (respomse.ok) {
      const data = await respomse.json();
      
      // Store the token in localStorage
      localStorage.setItem('authToken', data.token || 'dummy-token');
      
      // Dispatch custom event to notify navbar
      window.dispatchEvent(new Event('loginStateChanged'));
      
      alert("Login successful");
      navigate("/"); // Redirect to home page on successful login
    } else {
        alert("Login failed");
      // Handle error
    }
    setTimeout(() => setLoading(false), 1500);
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
              Login
            </motion.h2>
            <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-secondary py-3 px-5 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-secondary py-3 px-5 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-green-400 py-3 rounded-lg text-white font-bold shadow-md hover:scale-105 transition-transform duration-300"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <motion.p
              variants={fadeIn("", "", 0.3, 1)}
              className="mt-6 text-secondary text-[15px] text-center"
            >
              Don't have an account?{" "}
              <Link to="/register" className="text-pink-400 underline">
                Register
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </Tilt>
    </div>
  );
};

export default Login;

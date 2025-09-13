import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { styles } from "../../config/styles";
import { fadeIn, textVariant } from "../../utils/motion";

const Register = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
   const respomse= await fetch('http://localhost:5000/register', {
      method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
    });
    setTimeout(() => setLoading(false), 1500);
    
    if (respomse.ok) {
      const data = await respomse.json();
      alert("Registration successful");
      console.log("Registration successful:", data);
      localStorage.setItem("user", JSON.stringify(data)); // Store user data in localStorage
        navigate("/login"); // Redirect to login page on successful registration
      // Redirect or show success message
    } else {
      console.error("Registration failed");
      // Handle error
    }
    setForm({ name: "", email: "", password: "" });
    setLoading(false);


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
              Register
            </motion.h2>
            <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="bg-secondary py-3 px-5 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
              />
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
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
            <motion.p
              variants={fadeIn("", "", 0.3, 1)}
              className="mt-6 text-secondary text-[15px] text-center"
            >
              Already have an account?{" "}
              <Link to="/login" className="text-pink-400 underline">
                Login
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </Tilt>
    </div>
  );
};

export default Register;

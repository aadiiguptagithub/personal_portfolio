import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../../config/styles";
import { EarthCanvas, StarsCanvas } from "../canvas";

import { slideIn } from "../../utils/motion";

const ContactUs = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Aditya Gupta",
          from_email: form.email,
          to_email: "aadiigupta25@gmail.com",
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. I will get back to you as soon as possible.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          alert("Ahh, something went wrong. Please try again.");
        }
      );
  };

  return (
    <div className="min-h-screen bg-primary relative z-0">
      {/* Contact Form Section */}
      <div className="pt-32 pb-16 px-6 sm:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex xl:flex-row flex-col-reverse gap-12 xl:gap-16">
            <motion.div
              variants={slideIn("left", "tween", 0.2, 1)}
              className='flex-[0.75] bg-black-100 p-10 sm:p-12 rounded-2xl'
            >
              <p className={styles.sectionSubText}>Send a message</p>
              <h3 className={styles.sectionHeadText}>Contact.</h3>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className='mt-12 flex flex-col gap-8'
              >
                <label className='flex flex-col'>
                  <span className='text-white font-medium mb-4'>Your Name</span>
                  <input
                    type='text'
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What's your good name?"
                    className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
                  />
                </label>
                <label className='flex flex-col'>
                  <span className='text-white font-medium mb-4'>Your email</span>
                  <input
                    type='email'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                    placeholder="What's your web address?"
                    className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
                  />
                </label>
                <label className='flex flex-col'>
                  <span className='text-white font-medium mb-4'>Your Message</span>
                  <textarea
                    rows={7}
                    name='message'
                    value={form.message}
                    onChange={handleChange}
                    placeholder='What you want to say?'
                    className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
                  />
                </label>

                <button
                  type='submit'
                  className='bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary hover:bg-secondary transition-colors'
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </form>
            </motion.div>

            <motion.div
              variants={slideIn("right", "tween", 0.2, 1)}
              className='xl:flex-1 xl:h-auto md:h-[600px] h-[400px] mt-8 xl:mt-0'
            >
              <EarthCanvas />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contact Information Display */}
      <div className="pb-24 px-6 sm:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={slideIn("up", "tween", 0.1, 0.8)}
            className="text-center mb-16"
          >
            <h2 className={`${styles.sectionHeadText} mb-6`}>Get In Touch</h2>
          </motion.div>
          
          <motion.div
            variants={slideIn("up", "tween", 0.3, 1)}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-black-100 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">📧</span>
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Email</h3>
              <p className="text-secondary text-lg">aadiigupta25@gmail.com</p>
            </div>
            <div className="bg-black-100 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">📱</span>
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Phone</h3>
              <p className="text-secondary text-lg">+91 12345 67890</p>
            </div>
            <div className="bg-black-100 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">📍</span>
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Location</h3>
              <p className="text-secondary text-lg">India</p>
            </div>
          </motion.div>
        </div>
      </div>
      <StarsCanvas />
    </div>
  );
};

export default ContactUs;

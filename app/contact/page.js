"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const recipient = "your@email.com";

    const body = `
Name: ${form.name}
Email: ${form.email}

Message:
${form.message}
    `;

    const mailtoLink =
      `mailto:${recipient}` +
      `?subject=${encodeURIComponent(form.subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  return (
    <div>
      <main className="min-h-screen bg-[#eef2e6] text-white flex flex-col items-center justify-center px-6 pb-25 gap-10 ">
        <Navbar />
        <div className="w-full max-w-5xl grid md:grid-cols-2 bg-[#181818] rounded-3xl overflow-hidden  shadow-2xl">
          {/* Left Section */}
          <div className="bg-[#1C7262] p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Let's <span className="text-cyan-400">Talk.</span>
            </h1>

            <p className="text-gray-400 leading-7 mb-10">
              Have a question, suggestion, or just want to say hello? Send me a
              message and I'll get back to you as soon as possible.
            </p>

            {/* Email */}
            <div className="flex items-center gap-4 mb-7">
              <div className="w-12 h-12 rounded-full bg-[#eef2e6] flex items-center justify-center text-xl">
                ✉
              </div>

              <div>
                <h3 className="font-semibold mb-1">Email</h3>

                <a
                  href="mailto:your@email.com"
                  className="text-gray-400 hover:text-cyan-400 transition"
                >
                  your@email.com
                </a>
              </div>
            </div>

            {/* Website */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#eef2e6] flex items-center justify-center text-xl">
                🌐
              </div>

              <div>
                <h3 className="font-semibold mb-1">Website</h3>

                <p className="text-gray-400">yourwebsite.com</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="p-8 md:p-12 ">
            <h2 className="text-3xl font-bold mb-8">Send a Message</h2>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-5">
                <label className="block text-sm text-gray-300 mb-2">
                  Your Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#222] border border-[#333] text-white outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className="block text-sm text-gray-300 mb-2">
                  Your Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#222] border border-[#333] text-white outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Subject */}
              <div className="mb-5">
                <label className="block text-sm text-gray-300 mb-2">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#222] border border-[#333] text-white outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm text-gray-300 mb-2">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#222] border border-[#333] text-white outline-none focus:border-cyan-400 transition resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-cyan-400 text-black font-semibold hover:bg-white transition-all duration-300 hover:-translate-y-1"
              >
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </main>
        <Footer />
    </div>
  );
}

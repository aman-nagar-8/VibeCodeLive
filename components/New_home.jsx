// app/page.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import StartLearningButton from "@/components/home/Join_session_btn.jsx";
import Navbar from "@/components/Navbar.jsx";
import { IoPeopleSharp } from "react-icons/io5";

export default function Home() {
  return (
    <main className="w-full bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <div className="bg-[#eef2e6]">
        \
        <section className="max-w-7xl bg-[#eef2e6] mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          {/* Left content */}
          <div>
            <p className="text-sm font-semibold text-black mb-3">
              Real-Time Teaching
            </p>

            <h1 className="text-6xl font-bold leading-tight text-black mb-6">
              Modern & Smooth <br /> Teaching Platform
            </h1>

            <p className="text-lg text-black/80 font-medium mb-8 max-w-lg">
              Join interactive coding sessions, meet with teachers, and conduct
              live classes with ease. Start today!
            </p>
            <div className="flex gap-5">
              <StartLearningButton label="Start Now" />
              <StartLearningButton label="Join Now" />
            </div>
          </div>

          {/* Right image and floating cards */}
          <div className="relative flex justify-center">
            {/* Main image */}
            <Image
              src="/main_photo2.png"
              alt="Laptop Coding"
              width={550}
              height={450}
              className="rounded-full shadow-md object-cover"
            />

            {/* Floating Card 1 */}
            <motion.div
              initial={{ opacity: 0, y:30 , x:30 }}
              whileInView={{ opacity: 1, y: 0 , x:0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
            className="absolute -top-6 -left-4 bg-white shadow-md rounded-2xl px-12 py-8">
              <div className="flex items-center gap-2">
                <span className="text-[#B7A96B] text-3xl">
                  <IoPeopleSharp />
                </span>
                <div className="flex flex-col">
                  <span className="font-bold text-black/70 text-lg">50+</span>
                  <span className="text-black/70 text-sm">Tutors</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 , x:-30 }}
              whileInView={{ opacity: 1, y: 0 , x:0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
              className="absolute top-10 -right-6 bg-white shadow-md rounded-2xl px-12 py-8"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#B7A96B] text-3xl">
                  <IoPeopleSharp />
                </span>
                <div className="flex flex-col">
                  <span className="font-bold text-black/70 text-lg">2K+</span>
                  <span className="text-black/70 text-sm">5M</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 3 */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: -40 }}
              transition={{ duration: 1.0 }}
              viewport={{ once: false, amount: 0.3 }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-10 bg-white shadow-md rounded-2xl px-25 py-10"
            >
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="font-bold text-black/70 text-2xl">97%</p>
                </div>
                <div>
                  <p className="font-bold text-black/70 text-2xl">10k</p>
                  <p className="text-sm text-black/60">50+</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Divider Section */}
      <div className="w-full h-32 bg-linear-to-b from-[#eef2e6] to-[#ffff] flex items-center justify-center"></div>

      {/* ABOUT SECTION */}
      <section className="w-full bg-white py-25">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          {/* Images Left */}
          <div className="relative flex gap-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
              className="w-45 h-75 md:w-65 md:h-125 rounded-xl bg-zinc-300"
            >
              {/* <Image
              src="/main_photo2.png"
              alt="Coding Screen"
              width={350}
              height={400}
              className="rounded-3xl shadow-md ml-10"
            /> */}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
              viewport={{ once: false, amount: 0.3 }}
              className="w-45 h-75 md:w-65 md:h-125 rounded-xl mt-20 bg-zinc-300"
            >
              {/* <Image
              src="/main_photo2.png"
              alt="Coding Screen"
              width={350}
              height={400}
              className="rounded-3xl shadow-md ml-10"
            /> */}
            </motion.div>

            {/* Floating Success Rate */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
              className="absolute bottom-5 left-16 translate-y-10 bg-white w-77 h-30 flex items-center justify-center rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-6">
                <p className="text-3xl font-bold text-[#1C7262]">85%</p>
                <div>
                  <p className="text-2xl text-black/60 font-bold">95%</p>
                  <p className="text-sm text-black/60 font-bold ">
                    Success Rate
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h2 className="text-6xl font-bold text-black mb-4">
              About TechLive: <br /> Empowering Coders Worldwide
            </h2>

            <p className="text-lg text-black/70 mb-8 font-medium">
              We are dedicated to providing top-notch coding education. Join us
              and unlock your potential today!
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5  rounded bg-[#1C7262] flex items-center justify-center text-white">
                  ✓
                </div>
                <span className="text-black/80 text-lg">Expert Mentorship</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-[#1C7262] flex items-center justify-center text-white">
                  ✓
                </div>
                <span className="text-black/80 text-lg">
                  Interactive Learning Tools
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-[#1C7262] flex items-center justify-center text-white">
                  ✓
                </div>
                <span className="text-black/80 text-lg">Global Community</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>
      <section>
        <div className="w-full max-w-8xl relative bg-white py-25 flex justify-center">
          <div className="flex justify-center gap-10 w-full max-w-7xl">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, x:-80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0 }}
              viewport={{ once: false, amount: 0.3 }}
              className="bg-[#e8efdf] w-90 mim-h-90 flex flex-col p-15 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer "
            >
              <div className="flex justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#356a44"
                  viewBox="0 0 24 24"
                  width="60"
                  height="60"
                >
                  <path d="M12 2L13.09 8.26L19 9.27L14.55 13.14L15.82 19.02L12 16.1L8.18 19.02L9.45 13.14L5 9.27L10.91 8.26L12 2Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-center text-black mb-3">
                Interactive Tools
              </h2>
              <p className="text-center text-gray-700">
                Interactive tools enhance engagement, making learning fun and
                effective.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
              viewport={{ once: false, amount: 0.3 }}
              className="bg-[#e8efdf] w-90 h-90 flex flex-col p-15 rounded-xl  shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#356a44"
                  viewBox="0 0 24 24"
                  width="60"
                  height="60"
                >
                  <path d="M20 17V7H4v10h16zm0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16zM7 14h2v2H7v-2zm0-4h2v2H7V10zm4 0h6v2h-6V10zm0 4h4v2h-4v-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black text-center mb-3">
                Collaborative Coding
              </h2>
              <p className="text-center text-gray-700">
                Real-time collaboration fosters teamwork, enhancing
                problem-solving capabilities effectively.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0 }}
              viewport={{ once: false, amount: 0.3 }}
              className="bg-[#e8efdf] w-90 h-90 flex flex-col p-15 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#356a44"
                  viewBox="0 0 24 24"
                  width="60"
                  height="60"
                >
                  <path d="M20 3H4c-1.1 0-2 .9-2 2v14l4-4h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2zm-2 9H6V10h12v2zm0-4H6V6h12v2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-center text-black mb-3">
                Expert Mentorship
              </h2>
              <p className="text-center text-gray-700">
                Personalized feedback accelerates learning, ensuring mastery of
                coding concepts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      <section>
        <div className="w-full bg-[#4b8f89] py-24 mt-25 px-6 flex justify-center">
          <div className="max-w-7xl w-full">
            {/* Heading */}
            <p className="text-center text-white text-sm font-semibold tracking-wide mb-2">
              Real Stories
            </p>
            <h2 className="text-center text-white text-5xl font-bold mb-16">
              What People Say
            </h2>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 border border-white/40 rounded-xl overflow-hidden">
              {/* Card 1 */}
              <div className="p-10 border-b md:border-b-0 md:border-r border-white/40">
                <img
                  src="https://randomuser.me/api/portraits/men/12.jpg"
                  alt="User 1"
                  className="w-20 h-20 rounded-full mx-auto mb-6"
                />

                <p className="text-white text-lg leading-relaxed mb-6">
                  TechLive transformed my coding skills. The interactive
                  sessions and expert guidance were invaluable. Highly recommend
                  it!
                </p>

                <h3 className="text-white font-bold text-lg">John Doe</h3>
                <p className="text-white/80 text-sm">Developer</p>
              </div>

              {/* Card 2 */}
              <div className="p-10 border-b md:border-b-0 md:border-r border-white/40">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="User 2"
                  className="w-20 h-20 rounded-full mx-auto mb-6"
                />

                <p className="text-white text-lg leading-relaxed mb-6">
                  I loved the interactive coding sessions. The instructors are
                  knowledgeable and supportive. TechLive is the best!
                </p>

                <h3 className="text-white font-bold text-lg">Jane Doe</h3>
                <p className="text-white/80 text-sm">Designer</p>
              </div>

              {/* Card 3 */}
              <div className="p-10">
                <img
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="User 3"
                  className="w-20 h-20 rounded-full mx-auto mb-6"
                />

                <p className="text-white text-lg leading-relaxed mb-6">
                  TechLive's platform is a game-changer. The real-time
                  collaboration and personalized feedback helped me level up my
                  skills.
                </p>

                <h3 className="text-white font-bold text-lg">Mike Smith</h3>
                <p className="text-white/80 text-sm">Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="w-full py-24 px-6 flex justify-center bg-white">
          <div className="max-w-7xl w-full">
            {/* Heading */}
            <h2 className="text-center text-5xl font-bold mb-4 text-black">
              Explore Our Coding <br /> Insights
            </h2>

            <p className="text-center text-gray-600 text-lg mb-16">
              Dive into our blog for coding insights, tips, and tutorials.{" "}
              <br />
              Elevate your skills today!
            </p>

            {/* Blog Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Card 1 */}
              <div className="rounded-2xl overflow-hidden shadow-sm bg-[#f8f8f8] cursor-pointer hover:shadow-lg transition">
                <img
                  src="main_photo1.png"
                  alt="Python"
                  className="w-full h-60 object-cover rounded-2xl"
                />
                <div className="p-6">
                  <p className="text-gray-500 text-sm mb-3">
                    Growth · Feb 15 2024
                  </p>
                  <h3 className="text-xl font-semibold leading-relaxed text-black">
                    Master Python: A Beginner's Guide <br /> to Success
                  </h3>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-2xl overflow-hidden shadow-sm bg-[#f8f8f8] cursor-pointer hover:shadow-lg transition">
                <img
                  src="main_photo1.png"
                  alt="JavaScript"
                  className="w-full h-60 object-cover rounded-2xl"
                />
                <div className="p-6">
                  <p className="text-gray-500 text-sm mb-3">
                    Growth · Aug 15 2024
                  </p>
                  <h3 className="text-xl font-semibold leading-relaxed text-black">
                    JavaScript Tips: Elevate Your Web <br /> Development
                  </h3>
                </div>
              </div>

              {/* Card 3 */}
              <div className="rounded-2xl overflow-hidden shadow-sm bg-[#f8f8f8] cursor-pointer hover:shadow-lg transition">
                <img
                  src="main_photo1.png"
                  alt="Java Code"
                  className="w-full h-60 object-cover rounded-2xl"
                />
                <div className="p-6">
                  <p className="text-gray-500 text-sm mb-3">
                    Growth · Sep 15 2023
                  </p>
                  <h3 className="text-xl font-semibold leading-relaxed text-black">
                    Java Best Practices: Write Clean <br /> Code
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="w-full bg-[#0f5147] text-white py-20 px-6 flex justify-center">
          <div className="max-w-7xl w-full">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 mb-16">
              {/* Brand & Rights */}
              <div>
                <h2 className="text-3xl font-bold mb-3">TechLive</h2>
                <p className="text-gray-200 text-lg">All rights reserved.</p>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-10 text-lg">
                <a href="#" className="hover:opacity-80">
                  Home
                </a>
                <a href="#" className="hover:opacity-80">
                  About
                </a>
                <a href="#" className="hover:opacity-80">
                  Courses
                </a>
                <a href="#" className="hover:opacity-80">
                  Instructors
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/30 mb-10"></div>

            {/* Bottom Row */}
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Social Icons */}
              <div className="flex items-center gap-5 text-2xl">
                <a href="#" className="hover:opacity-80">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="hover:opacity-80">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="hover:opacity-80">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="hover:opacity-80">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>

              {/* Copyright */}
              <p className="text-gray-300 text-sm mt-6 md:mt-0">
                © 20xx Codedesign.ai. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

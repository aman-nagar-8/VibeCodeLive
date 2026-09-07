import React from 'react'

const Footer = () => {
  return (
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
  )
}

export default Footer

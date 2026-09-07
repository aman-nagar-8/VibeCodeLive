"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#eef2e6] text-[#1C7262]">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <p className="text-sm font-semibold tracking-[0.25em] uppercase mb-5">
              About Us
            </p>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-7">
              Built with
              <br />
              <span className="text-[#1C7262]">
                purpose.
              </span>
            </h1>

            <p className="text-[#1C7262]/70 text-lg leading-8 max-w-xl">
              We believe good digital experiences should feel simple,
              meaningful, and effortless. Our goal is to create things
              that look beautiful, work smoothly, and leave a lasting
              impression.
            </p>

            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#1C7262] text-[#eef2e6] font-semibold hover:bg-[#15594d] transition-all duration-300 hover:-translate-y-1"
              >
                Get in Touch
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Decorative Card */}
          <div className="relative">

            <div className="aspect-square max-w-md mx-auto rounded-[40px] bg-[#1C7262] p-8 md:p-12 flex items-end">

              <div>
                <span className="text-7xl md:text-9xl font-bold text-[#eef2e6]/20">
                  01
                </span>

                <h2 className="text-3xl md:text-4xl font-bold text-[#eef2e6] mt-[-20px]">
                  Ideas into
                  <br />
                  experiences.
                </h2>
              </div>

            </div>

            {/* Small floating card */}
            <div className="absolute -bottom-5 -left-2 md:-left-8 bg-[#eef2e6] border border-[#1C7262]/20 rounded-2xl px-6 py-5 shadow-lg">
              <p className="text-xs uppercase tracking-widest text-[#1C7262]/60 mb-1">
                Our approach
              </p>
              <p className="font-bold">
                Simple. Thoughtful. Human.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* Story Section */}
      <section className="bg-[#1C7262] text-[#eef2e6] px-6 py-20 md:py-28">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20">

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#eef2e6]/60 mb-5">
              Our Story
            </p>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Why we do
              <br />
              what we do.
            </h2>
          </div>

          <div className="space-y-6 text-[#eef2e6]/75 text-lg leading-8">

            <p>
              Every project starts with an idea. We believe that idea
              deserves the right combination of creativity, technology,
              and attention to detail.
            </p>

            <p>
              Instead of making things complicated, we focus on finding
              simple solutions to meaningful problems. From the first
              concept to the final detail, every decision has a purpose.
            </p>

            <p>
              The result is digital work that doesn't just look good,
              but feels natural to use.
            </p>

          </div>

        </div>

      </section>


      {/* Values */}
      <section className="px-6 py-20 md:py-28">

        <div className="max-w-6xl mx-auto">

          <div className="mb-14">
            <p className="text-sm uppercase tracking-[0.25em] text-[#1C7262]/60 mb-4">
              What Matters
            </p>

            <h2 className="text-4xl md:text-5xl font-bold">
              Our values.
            </h2>
          </div>


          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="rounded-3xl bg-[#1C7262] text-[#eef2e6] p-8 min-h-[280px] flex flex-col justify-between">
              <span className="text-4xl font-bold opacity-30">
                01
              </span>

              <div>
                <h3 className="text-2xl font-bold mb-3">
                  Simplicity
                </h3>

                <p className="text-[#eef2e6]/70 leading-7">
                  We remove unnecessary complexity and focus on what
                  actually matters.
                </p>
              </div>
            </div>


            {/* Card 2 */}
            <div className="rounded-3xl border border-[#1C7262]/20 p-8 min-h-[280px] flex flex-col justify-between">
              <span className="text-4xl font-bold opacity-20">
                02
              </span>

              <div>
                <h3 className="text-2xl font-bold mb-3">
                  Creativity
                </h3>

                <p className="text-[#1C7262]/70 leading-7">
                  We explore fresh ideas and turn them into experiences
                  people remember.
                </p>
              </div>
            </div>


            {/* Card 3 */}
            <div className="rounded-3xl border border-[#1C7262]/20 p-8 min-h-[280px] flex flex-col justify-between">
              <span className="text-4xl font-bold opacity-20">
                03
              </span>

              <div>
                <h3 className="text-2xl font-bold mb-3">
                  Quality
                </h3>

                <p className="text-[#1C7262]/70 leading-7">
                  We care about the details because small details create
                  great experiences.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="px-6 pb-20">

        <div className="max-w-6xl mx-auto rounded-[35px] bg-[#1C7262] text-[#eef2e6] p-10 md:p-16 text-center">

          <p className="text-sm uppercase tracking-[0.25em] text-[#eef2e6]/60 mb-5">
            Have an idea?
          </p>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Let's make it
            <br />
            happen.
          </h2>

          <p className="max-w-xl mx-auto text-[#eef2e6]/70 mb-8">
            Have a project, question, or idea you'd like to discuss?
            We'd love to hear from you.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#eef2e6] text-[#1C7262] font-semibold hover:bg-white transition-all duration-300"
          >
            Contact Us
            <span>→</span>
          </Link>

        </div>

      </section>
        <Footer />
    </main>
  );
}

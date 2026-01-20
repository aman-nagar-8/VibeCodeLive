'use client';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailClient() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const searchParams = useSearchParams();
  const route = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return
    }

    fetch(`/api/login/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
      })
      .then((data) => {
        setStatus("success");
        setMessage(data.message);
        console.log(data.data)

        setTimeout(() => {
          route.push("/login");
        }, 3000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Verification failed");
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#4b8f89] overflow-y-scroll no-scrollbar">
      {/* Top Bar */}

      {/* Main Content */}
      <main className="flex w-full flex-col h-screen justify-between px-6">
        <header className="h-20 flex items-center px-10 gap-2">
        
          <Link
            href="/"
            className="text-2xl font-semibold text-white tracking-wide"
          >
            VibeCodeLive
          </Link>
          <div className="flex-1 flex justify-center mr-25 font-bold " >
              <p>Welcome to VibeCodeLive! Just one quick step left</p>
          </div>

        </header>
        <div className="w-2/3 h-3/4  mx-auto rounded-t-2xl border border-zinc-200 bg-white p-10 text-center shadow-2xl">
          {/* Loading */}
          {status === "loading" && (
            <div>
              <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-[#4b8f89]" />
              <h2 className="text-xl font-semibold text-zinc-800">
                Verifying your email
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                We’re confirming your email address. This won’t take long.
              </p>
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div>
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15 text-green-600 text-xl font-bold">
                ✓
              </div>
              <h2 className="text-xl font-semibold text-green-600">
                {message}
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Your account is now active. You can continue to login.
              </p>

              <Link
                href="/login"
                className="mt-6 inline-block rounded-lg bg-[#4b8f89] px-6 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Go to Login
              </Link>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div>
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 text-red-500 text-xl font-bold">
                ✕
              </div>
              <h2 className="text-xl font-semibold text-red-500">
                Verification failed
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                {message || "This verification link is invalid or has expired."}
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href="/login/register"
                  className="block text-sm font-medium text-[#4b8f89] hover:underline"
                >
                  Create a new account
                </Link>
                <Link
                  href="/login"
                  className="block text-sm text-zinc-500 hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className="w-full bg-[#0f5147] text-white py-20 px-6 flex justify-center">
          <div className="max-w-7xl w-full">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 mb-16">
              {/* Brand & Rights */}
              <div>
                <h2 className="text-3xl font-bold mb-3">VibeCodeLive</h2>
                <p className="text-gray-200 text-lg">All rights reserved.</p>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-10 text-lg">
                <Link href="/" className="hover:opacity-80">
                  Home
                </Link>
                <Link href="/" className="hover:opacity-80">
                  About
                </Link>
                <Link href="/" className="hover:opacity-80">
                  Courses
                </Link>
                <Link href="/" className="hover:opacity-80">
                  Instructors
                </Link>
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
    </div>
  );
}

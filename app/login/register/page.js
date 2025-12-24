"use client";
import { useState } from "react";
import Link from "next/link";
import { Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import { registerSchema } from "@/utils/registerSchema";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const page = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [PasswordHidden, setPasswordHidden] = useState(true);
  const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const isDisabled =
    !form.email.trim() ||
    !form.password.trim() ||
    isLoading ||
    !form.name.trim() ||
    !form.confirmPassword.trim();
  const [message, setMessage] = useState({});

  const [loginSuccess, setloginSuccess] = useState(false);
  const [loginError, setloginError] = useState(false);
  const [register, setregister] = useState("Register");
  const [successMessage, setsuccessMessage] = useState("");

  const ErrorList = ({ error }) => {
    if (!error || error.length === 0) return null;
    return error.map((e, index) => (
      <div key={index}>
        <Alert severity="error">{e}</Alert>
      </div>
    ));
  };

  function handleChange(e) {
    setMessage({});
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
   
    const result = registerSchema.safeParse(form);

    if (!result.success) {
      setMessage(result.error.flatten().fieldErrors);
      setStatus("error");
      return;
    }

    setMessage({});
    setisLoading(true);

    try {

      const res = await fetch("/api/login/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
      if(!data.success){
        setStatus("error");
      } else {
         setStatus("success");
      }
      setMessage({ message: [data.message] });

    } catch (error) {
      setStatus("error");
      setMessage({ message: [error.message] });

    } finally {
      setisLoading(false);
    }
  }
  return (
    <div className="min-h-screen w-screen overflow-hidden flex">
      <div className="min-h-screen w-full md:w-[25vw] md:min-w-[380px] md:max-w-[470px] bg-[#4b8f89] pl-12 pr-3 pt-8 ">
        <Link
          href="/"
          className="text-2xl font-semibold text-white tracking-wide"
        >
          VibeCodeLive
        </Link>
        <p className="font-bold mt-1 text-zinc-200">
          Code together. Learn faster.
        </p>
        <div className="mt-12 mb-2 text-left">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100">
            What you’ll get
          </h3>

          <ul className="mt-3 space-y-2 ml-2.5 text-sm text-zinc-200">
            <li className="flex gap-2">
              <span className="text-zinc-200">✓</span>
              <span>Collaborate on code in real time</span>
            </li>
            <li className="flex gap-2">
              <span className="text-zinc-200">✓</span>
              <span>Host and join live coding classes</span>
            </li>
            <li className="flex gap-2">
              <span className="text-zinc-200">✓</span>
              <span>Share notes, whiteboard ideas, and solutions</span>
            </li>
            <li className="flex gap-2">
              <span className="text-zinc-200">✓</span>
              <span>A secure, fast, and focused workspace</span>
            </li>
          </ul>
        </div>

        <div className=" h-full bg-[#4b8f89] text-white  py-8 flex flex-col justify-b">
          {/* Top Intro */}
          <div>
            <h2 className="text-xl font-semibold leading-snug">
              One account.
              <br />
              One workspace.
            </h2>

            <p className="mt-3 text-sm text-white/85 leading-relaxed">
              Everything you need to learn, collaborate, and review — in one
              place.
            </p>
          </div>

          {/* Info Points */}
          <div className="mt-3 space-y-4 text-sm text-white/90">
            <div className="flex gap-3">
              <span className="opacity-80">●</span>
              <span>Manage live coding sessions and meetings</span>
            </div>

            <div className="flex gap-3">
              <span className="opacity-80">●</span>
              <span>Access your code, notes, and comments anytime</span>
            </div>

            <div className="flex gap-3">
              <span className="opacity-80">●</span>
              <span>Revisit past sessions and track progress</span>
            </div>

            <div className="flex gap-3">
              <span className="opacity-80">●</span>
              <span>AI-powered summaries coming soon</span>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-8 text-xs text-white/70">
            Built for focus, clarity, and real collaboration.
          </div>
        </div>
      </div>
      <div className="min-h-screen grow  bg-white pl-10 relative overflow-y- flex flex-col">
        <h1 className="text-3xl font-semibold text-[#4b8f89] mb-2 mt-8 ">
          Create Account
        </h1>
        <p className="mt-2 mb-7 font-bold text-lg text-black">
          Does have a account?{" "}
          <Link href={"/login"} className="text-blue-500">
            Login
          </Link>
        </p>
        <div className="flex gap-5 relative">
          <form onSubmit={handleSubmit} className="space-y-4 ">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-[300px] rounded-lg  border border-zinc-400 px-3 py-2.5 text-sm text-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#4b8f89] focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-[300px] rounded-lg  border border-zinc-400 px-3 py-2.5 text-sm text-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#4b8f89] focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Password
              </label>
              <div className="flex">
                <input
                  type={PasswordHidden ? "password" : "text"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-[300px] rounded-lg  border border-zinc-400 px-3 py-2.5 text-sm text-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#4b8f89] focus:border-transparent"
                />
                <div className="">
                  {PasswordHidden ? (
                    <FaEyeSlash
                      onClick={() => setPasswordHidden(!PasswordHidden)}
                      className="relative left-[-30px] top-3 text-zinc-500 cursor-pointer "
                    />
                  ) : (
                    <FaEye
                      onClick={() => setPasswordHidden(!PasswordHidden)}
                      className="relative left-[-30px] top-3 text-zinc-500 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Confirm Password
              </label>
              <div className="flex">
                <input
                  type={confirmPasswordHidden ? "password" : "text"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-[300px] rounded-lg  border border-zinc-400 px-3 py-2.5 text-sm text-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#4b8f89] focus:border-transparent"
                />
                <div className="">
                  {confirmPasswordHidden ? (
                    <FaEyeSlash
                      onClick={() =>
                        setConfirmPasswordHidden(!confirmPasswordHidden)
                      }
                      className="relative left-[-30px] top-3 text-zinc-500 cursor-pointer "
                    />
                  ) : (
                    <FaEye
                      onClick={() =>
                        setConfirmPasswordHidden(!confirmPasswordHidden)
                      }
                      className="relative left-[-30px] top-3 text-zinc-500 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isDisabled}
              className="mt-2 w-[300px] transition-all duration-150 active:scale-[0.98] rounded-lg cursor-pointer bg-[#4b8f89] active:bg-[#398e87]  px-4 py-2.5 text-sm font-medium text-white"
            >
              Register
            </button>

            <div className="text-center w-[300px]">
              <p className="text-zinc-600 text-xs">
                Your information is safe with us. We respect your privacy.
              </p>
            </div>
            <div className="mt-6 w-[300px] text-xs text-center text-zinc-600">
              <ul>
                <li className="flex gap-2">
                  <span>
                    After signing up, we’ll send a verification link to your
                    email. Please verify to activate your account.
                  </span>
                </li>
              </ul>
            </div>
          </form>
          <div className="flex flex-col items-center mx-3 text-zinc-500 text-sm mt-5">
            <div className="h-[120px] border border-zinc-300 mb-2 "></div>
            Or
            <div className="h-[120px] border border-zinc-300 mt-2 "></div>
          </div>
          <div className="mt-5">
            <div className="w-[300px] h-12 border border-zinc-500 rounded-lg hover flex justify-center items-center text-zinc-600 gap-1 cursor-pointer ">
              <img
                src="https://img.freepik.com/premium-vector/google-logo_1273375-1572.jpg?semt=ais_se_enriched&w=740&q=80"
                alt=""
                className="w-8 h-8"
              />
              Google
            </div>
            <div className="w-[300px] mt-5 h-12 border border-zinc-500 rounded-lg hover flex justify-center items-center text-zinc-600 gap-1 cursor-pointer ">
              <img
                src="https://github.blog/wp-content/uploads/2013/04/074d0b06-a5e3-11e2-8b7f-9f09eb2ddfae.jpg?resize=1234%2C701"
                alt=""
                className="w-10"
              />
              Github
            </div>
            <Stack
              sx={{ width: "300px" }}
              spacing={2}
              className="mt-5 flex-1 overflow-y-auto"
            >
              {status == "success" && (
                <Alert severity="success">{successMessage}</Alert>
              )}
              {status == "error" && (
                <>
                  <ErrorList error={message?.name} />
                  <ErrorList error={message?.email} />
                  <ErrorList error={message?.password} />
                  <ErrorList error={message?.confirmPassword} />
                  <ErrorList error={message?.message} />
                </>
              )}
            </Stack>
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-xs">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-3 border-zinc-300 border-t-[#4b8f89]" />
                  <p className="text-sm text-zinc-600">
                    Creating your account…
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

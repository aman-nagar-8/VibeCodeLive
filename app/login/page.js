"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { animate } from "animejs";
import { createTimeline } from "animejs";
import { useEffect } from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { setAccessToken } from "@/lib/apiClient";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { set } from "mongoose";
import Video from "next-video";
import interactionVideo from "@/videos/Login_with_zoom.mp4"
import Image from "next/image";


const Loginpage = () => {
  const route = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const isDisabled = !form.email || !form.password || isLoading;
  const [Password_hidden, setPassword_hidden] = useState(true);

  

  const dispatch = useDispatch();

  function handleChange(e) {
    setMessage("");
    setStatus("idle");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setMessage("All fields are required");
      setStatus("error");
      return;
    }

    setIsLoading(true);
    setStatus("loading");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      setAccessToken(data.accessToken);
      if (!data.success) {
        setStatus("error");
      } else {
        setStatus("success");
        dispatch(setUser(data.user));
      }
      setMessage(data.message);

      setTimeout(() => {
        if (data.success) {
          route.push("/");
        }
      }, 2000);
    } catch (error) {
      setMessage(error.message || "Something went wrong");
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    await signIn("google" , { callbackUrl: "/" });

  }

  return (
    <div className=" w-screen min-h-screen flex flex-col md:flex-row">
      {/* // left side // */}
      <div className="min-h-screen w-full md:w-[25vw] md:min-w-[380px] md:max-w-[470px] bg-white pl-12 pt-12 ">
        <div className="w-full h-full">
          <Link href="/" className="text-2xl font-bold  text-black">
            VibeCodeLive
          </Link>
          <p className="text-[#4b8f89] text-3xl mt-8">Log in to your account</p>
          <p className="mt-3 font-bold text-lg text-black">
            Does not have a account?{" "}
            <Link href={"/login/register"} className="text-blue-500">
              Register
            </Link>
          </p>
          <div className="relative mt-6">
            <form onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-[300px] rounded-lg  border border-zinc-700 px-3 py-2.5 text-sm text-zinc-600 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1 mt-4">
                  Password
                </label>
                <div className="flex">
                  <input
                    type={Password_hidden ? "password" : "text"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-75 rounded-lg border border-zinc-700 px-3 py-2.5 text-sm text-zinc-600 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="">
                    {Password_hidden ? (
                      <FaEyeSlash
                        onClick={() => setPassword_hidden(!Password_hidden)}
                        className="relative left-[-30px] top-3 text-zinc-500 cursor-pointer "
                      />
                    ) : (
                      <FaEye
                        onClick={() => setPassword_hidden(!Password_hidden)}
                        className="relative left-[-30px] top-3 text-zinc-500 cursor-pointer"
                      />
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end w-75 mt-3" ><Link href="/login/forget-password" className="text-sm text-blue-500 font-bold cursor-pointer">
                  Forgot Password?
                </Link></div>
              </div>
              {/* <button
                type="submit"
                className="mt-4 cursor-pointer w-[100px] rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors px-4 py-2.5 text-sm font-medium text-white"
              >
                {login}
              </button> */}
              <div className="flex gap-5">
                <button
                  disabled={isDisabled}
                  type="submit"
                  className={`${
                    isDisabled ? " cursor-not-allowed " : " cursor-pointer "
                  } relative px-5 py-2 mt-3 text-sm cursor-not-allowed overflow-hidden font-bold text-gray-500 bg-gray-100 border border-gray-300 rounded-lg shadow-inner group`}
                >
                  <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
                  <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
                  <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                  <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                  <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
                  <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">
                    Login
                  </span>
                </button>
              </div>
            </form>
            <div className="flex items-center mx-3 text-zinc-500 text-sm mt-5">
              <div className="w-[120px] border border-zinc-300 mr-2"></div>
              Or
              <div className="w-[120px] border border-zinc-300 ml-2"></div>
            </div>
            <div className="mt-5">
              <button
                onClick={handleGoogleSignIn}
                className="w-[300px] h-12 border border-zinc-500 rounded-lg hover flex justify-center items-center text-zinc-600 gap-1 cursor-pointer "
              >
                <img
                  src="https://img.freepik.com/premium-vector/google-logo_1273375-1572.jpg?semt=ais_se_enriched&w=740&q=80"
                  alt=""
                  className="w-8 h-8"
                />
                Google
              </button>
              <div className="w-[300px] mt-5 h-12 border border-zinc-500 rounded-lg hover flex justify-center items-center text-zinc-600 gap-1 cursor-pointer ">
              <img
                src="https://github.blog/wp-content/uploads/2013/04/074d0b06-a5e3-11e2-8b7f-9f09eb2ddfae.jpg?resize=1234%2C701"
                alt=""
                className="w-10"
              />
              Github
            </div>
            </div>
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/35 backdrop-blur-[2px]">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-3 border-zinc-300 border-t-[#4b8f89]" />
                  <p className="text-sm text-zinc-600">Logging you in…</p>
                </div>
              </div>
            )}
          </div>
          <Stack sx={{ width: "300px" }} spacing={2} className="mt-5">
            {status === "success" && (
              <Alert severity="success">{message}</Alert>
            )}

            {status === "error" && <Alert severity="error">{message}</Alert>}
          </Stack>
        </div>
      </div>
      {/* // right side // */}
      <div className="min-h-screen w-full grow bg-[#4b8f89] pl-10 relative hidden md:block z-0">
        <Image src={"/Login_bg-1.png"} alt="Login" fill className="object-cover -z-10" />

        <div>
        {/* // heading// */}
        <div className="z-10">
          <div className="mt-8">
            <h3 className="font-bold md:text-3xl sm:text-2xl">
              Collaborate, Learn, Grow—All In One Place.
            </h3>
          </div>
          <div className="mt-2">
            <h4>
              A platform where students and teachers can code together, solve
              problems, conduct live workshops, and share notes and code in one
              place
            </h4>
          </div>
        </div>

        {/* // mid part // */}
        <div className="mt-9 flex md:flex-col gap-5 sm:flex-col lg:flex-row">
          <div  className="rounded-2xl overflow-hidden bg-[#4b8f89]"  >

          <Video src={interactionVideo}  width={800} height={450} controls={false} autoPlay loop muted playsInline className=""  />
          </div>

          

        </div>
        </div>
        {/* // bottom rotated part // */}
        {/* <div className="w-full h-15 bg-white fixed -bottom-5 -rotate-3"></div> */}
        {/* // ball for animation // */}
        {/* <div className="bg-red-400 w-10 h-10 absolute rounded-full top-0 right-15 ball"></div> */}
      </div>
    </div>
  );
};

export default Loginpage;

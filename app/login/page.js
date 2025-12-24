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

  const dispatch =  useDispatch();

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

  // useEffect(() => {
  //   const tl = createTimeline({ defaults: { duration: 750 } });

  //   tl.label("start")
  //     .add(".ball", { y: 136, duration: 600, easing: "easeOutCubic" }, "start")
  //     .add(
  //       ".ball",
  //       {
  //         scaleY: [1, 0.97],
  //         scaleX: [1, 1.05],
  //         duration: 200,
  //         easing: "easeOutQuad",
  //       },
  //       "-=200"
  //     )
  //     .add(".ball", {
  //       translateY: [136, 60],
  //       x: [0, '-40'],
  //       duration: 400,
  //       rotate: true,

  //     })
  //     .add(".ball", {
  //       translateY: [60, 136],
  //       translateX: [-40 , -60],
  //       duration: 400,
  //       easing: "easeInCubic",
  //     })
  //     .add(".ball", {
  //       translateX:[-60 , -180],
  //       duration: 700,
  //       rotate: true,
  //     })
  //     .add(".ball", {
  //       translateY:[136, 266],
  //       duration: 600,
  //     });
  // }, []);

  return (
    <div className=" w-screen min-h-screen flex flex-col md:flex-row">
      {/* // left side // */}
      <div className="min-h-screen w-full md:w-[25vw] md:min-w-[380px] md:max-w-[470px] bg-white pl-12 pt-12 ">
        <div className="w-full h-full">
          <Link href="/" className="text-2xl font-semibold text-black">
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
                <label className="block text-sm font-medium text-zinc-800 mb-1">
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
                <label className="block text-sm font-medium text-zinc-800 mb-1 mt-4">
                  Password
                </label>
                <div className="flex">
                  <input
                    type={Password_hidden ? "password" : "text"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-[300px] rounded-lg border border-zinc-700 px-3 py-2.5 text-sm text-zinc-600 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  } relative px-5 py-2 mt-5 cursor-not-allowed overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group`}
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
              <div className="w-[300px] h-12 border border-zinc-500 rounded-lg hover flex justify-center items-center text-zinc-600 gap-1 cursor-pointer ">
                <img
                  src="https://img.freepik.com/premium-vector/google-logo_1273375-1572.jpg?semt=ais_se_enriched&w=740&q=80"
                  alt=""
                  className="w-8 h-8"
                />
                Google
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
      <div className="min-h-screen grow bg-[#4b8f89] pl-10 relative overflow-y-scroll">
        {/* // heading// */}
        <div className="">
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
          {/* // left part // */}
          <div className="w-[26.5%] h-[500px] min-w-[300px] max-w-[415px] bg-amber-100 rounded-xl"></div>
          {/* // right part // */}
          <div className="flex-1 max-w-[1100px]">
            {/* // first box // */}
            <div>
              <div className="w-[75%] max-w-[300px] lg:w-[29%] lg:max-w-60  h-0.5 border-2 relative lg:left-[66.4%] top-10 rounded-2xl "></div>
            </div>
            {/* // second box // */}
            <div>
              <div className="w-[75%] max-w-[300px] lg:w-[29%] lg:max-w-60 h-0.5 border-2 relative lg:left-[37.4%] top-[170px] rounded-2xl "></div>
            </div>
            {/* // third box // */}
            <div>
              <div className="w-[75%] max-w-[300px] lg:w-[29%] lg:max-w-60 h-0.5 border-2 relative lg:left-[8.4%] top-[300px] rounded-2xl "></div>
            </div>
          </div>
        </div>
        {/* // bottom rotated part // */}
        <div className="w-full h-15 bg-white fixed -bottom-5 -rotate-3"></div>
        {/* // ball for animation // */}
        {/* <div className="bg-red-400 w-10 h-10 absolute rounded-full top-0 right-15 ball"></div> */}
      </div>
    </div>
  );
};

export default Loginpage;

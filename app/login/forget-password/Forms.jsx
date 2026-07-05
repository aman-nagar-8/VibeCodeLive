"use client";
import React from "react";
import { useState, useRef } from "react";
import { emailSchema } from "@/utils/registerSchema";

const Forms = () => {
  const OTP_LENGTH = 6;
  const OTPInputs = useRef([]);

  const processSteps = [
    { id: 1, name: "Email Verification" },
    { id: 2, name: "OTP Verification" },
    { id: 3, name: "Reset Password" },
    { id: 4, name: "Success" },
  ];
  const [currentProcessStep, setCurrentProcessStep] = useState(2);

  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState(new Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isGetOTPButtonDisabled = !email || isLoading;
  const isVerifyOTPButtonDisabled =
    OTP.some((digit) => digit === "") || isLoading;

  const emailChangeInInput = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const OTPChangeInInput = (e, index) => {
    e.preventDefault();
    const { value } = e.target;

    // Only allow single digit input
    if (value.match(/^\d$/)) {
      const newOtp = [...OTP];
      newOtp[index] = value;
      setOTP(newOtp);

      // Move focus to the next input
      if (index < OTP_LENGTH - 1) {
        OTPInputs.current[index + 1].focus();
      }
    }

    // Move focus to previous input on backspace
    if (value === "" && index > 0) {
      OTPInputs.current[index - 1].focus();
    }
  };

  const handleKeyDownOnOTPInput = (e, index) => {
    if (e.key === "Backspace" && OTP[index] === "") {
      // Move focus to previous input on backspace if current input is empty
      if (index > 0) {
        const newOtp = [...OTP];
        newOtp[index] = ''; // Clear the previous input
        setOTP([newOtp]);
        OTPInputs.current[index - 1].focus();
      }
    }
  };

  const emailSubmit = async () => {
    setIsLoading(true);
    if (!checkEmailValidation(email)) {
      setIsLoading(false);
      return;
    }
    await sendEmail(email);
    setIsLoading(false);
  };

  const checkEmailValidation = (email) => {
    const result = emailSchema.safeParse({ email });
    setErrorMessage(result.success ? "" : result.error.errors[0].message);
    return result.success;
  };

  const sendEmail = async (email) => {
    try {
      const response = await fetch("/api/login/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error("Failed to send OTP. Please try again later.");
        setErrorMessage("Failed to send OTP. Please try again later.");
      }
      const data = await response.json();
      setSuccessMessage(data.message);
    } catch (error) {
      setErrorMessage("Failed to send OTP. Please try again later.");
    }
  };

  const verifyOTP = () => {};

  const checkOTPValidation = (OTP) => {};

  const sendOTP = () => {};

  const moveToNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };
  return (
    <div>
      {/* step - 1  */}
      {currentProcessStep === 1 && (
        <form
          action=""
          onSubmit={emailSubmit}
          className="flex flex-col gap-3 mt-3"
        >
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={emailChangeInInput}
              placeholder="you@example.com"
              className="w-75 rounded-lg  border border-zinc-700 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            disabled={isGetOTPButtonDisabled}
            type="submit"
            className={`w-30 ${
              isGetOTPButtonDisabled
                ? " cursor-not-allowed "
                : " cursor-pointer "
            } relative px-5 py-2 mt-3 cursor-not-allowed overflow-hidden font-medium text-gray-600 bg-gray-100 border  rounded-lg shadow-inner group`}
          >
            <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
            <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
            <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
            <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
            <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
            <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">
              Get OTP
            </span>
          </button>
        </form>
      )}
      {/* step - 2  */}
      {currentProcessStep === 2 && (
        <div>
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              disabled
              placeholder="you@example.com"
              className="w-75 rounded-lg  border border-zinc-700 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <form action="" className="mt-3">
            <label className="block text-sm font-medium text-zinc-200 mb-1">
              Enter OTP
            </label>

            <div className="flex">
              {OTP.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={OTP[index]}
                  onChange={(e) => OTPChangeInInput(e, index)}
                  onKeyDown={(e) => handleKeyDownOnOTPInput(e, index)}
                  ref={(el) => (OTPInputs.current[index] = el)}
                  style={{
                    width: "40px",
                    height: "40px",
                    margin: "0 5px",
                    textAlign: "center",
                    fontSize: "18px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </div>
          </form>
        </div>
      )}
      {/* step - 3 */}
      {currentProcessStep === 3 && <div></div>}
      {/* step - 4 */}
      {currentProcessStep === 4 && <div></div>}
    </div>
  );
};

export default Forms;

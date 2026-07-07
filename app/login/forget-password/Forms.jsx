"use client";
import React from "react";
import { useState, useRef } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { emailSchema, passwordSchema } from "@/utils/registerSchema";
import Button from "./Button";


const Forms = () => {
  const OTP_LENGTH = 6;
  const OTPInputs = useRef([]);

  const processSteps = [
    { id: 1, name: "Email Verification" },
    { id: 2, name: "OTP Verification" },
    { id: 3, name: "Reset Password" },
    { id: 4, name: "Success" },
  ];
  const [currentProcessStep, setCurrentProcessStep] = useState(1);
  const [resetToken, setResetToken] = useState("");

  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState(new Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isNewPasswordHidden, setIsNewPasswordHidden] = useState(true);
  const isGetOTPButtonDisabled = !email || isLoading;
  const isVerifyOTPButtonDisabled =
    OTP.some((digit) => digit === "") || isLoading;
  const isResetPasswordButtonDisabled = !newPassword || isLoading;

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
  };

  const handleKeyDownOnOTPInput = (e, index) => {
    if (e.key === "Backspace" && OTP[index] === "") {
      // Move focus to previous input on backspace if current input is empty
      if (index > 0) {
        OTPInputs.current[index - 1].focus();
      }
    } else if (e.key === "Backspace" && OTP[index] !== "") {
      const newOTP = [...OTP];
      newOTP[index] = "";
      setOTP(newOTP);
      if (index > 0) {
        OTPInputs.current[index - 1].focus();
      }
    }
  };

  const passwordChangeInInput = (e) => {
    e.preventDefault();
    setNewPassword(e.target.value);
  };

  const emailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!checkEmailValidation(email)) {
      setIsLoading(false);
      return;
    }
    const isSuccess = await sendEmail(email);
    setIsLoading(false);
    if(!isSuccess){
      return;
    }
    moveToNextStep();
  };

  const checkEmailValidation = (email) => {
    const result = emailSchema.safeParse({ email });
    setErrorMessage(result.success ? "" : result.error.errors[0].message);
    return result.success;
  };

  const sendEmail = async (email) => {
    console.log("send email")
    try {
      const response = await fetch("/api/login/forgotpassword/generateOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data?.message);
        throw new Error(data?.message);
      }
      setSuccessMessage(data.message);
      return true
    } catch (error) {
      console.log(error)
      setErrorMessage("Failed to send OTP. Please try again later.");
      return false
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (checkOTPValidation(OTP)) {
      setErrorMessage("Please enter all OTP digits.");
      return;
    }
    const isSuccess = await sendOTP(OTP);
    setIsLoading(false);
    if(!isSuccess){
      return;
    }
    moveToNextStep();
  };

  const checkOTPValidation = (OTP) => {
    return OTP.some((digit) => digit === "");
  };

  const sendOTP = async (OTP) => {
    try {
      const response = await fetch("/api/login/forgotpassword/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp:OTP }),
      });
      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data?.message);
        return false;
      }
      setSuccessMessage(data.message);
      setResetToken(data?.resetToken);
      return true
    } catch (error) {
      setErrorMessage("Failed to verify OTP. Please try again later.");
      return false
    } 
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!checkPasswordValidation(newPassword)) {
      setIsLoading(false);
      return;
    }
    if(!resetToken){
      setIsLoading(false);
      setErrorMessage("OTP Verification is required");
    }
    const isSuccess = await sendPassword(newPassword);
    setIsLoading(false);
    if(!isSuccess){
      return
    }
    moveToNextStep();
  };

  const checkPasswordValidation = (password) => {
    const result = passwordSchema.safeParse({password});
    if (!result.success) {
      setErrorMessage(result.error.issues[0].message);
      
    }
    return result.success;
  };

  const sendPassword = async (password) => {
    try {
      const response = await fetch("/api/login/forgotpassword/changepassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, resetToken }),
      });
      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data.message);
        return false;
      }
      setSuccessMessage(data.message);
      return true;
    } catch (error) {
      setErrorMessage("Can not change password, try again later");
      return false;
    }
  };

  const moveToNextStep = () => {
    setCurrentProcessStep((prev) => prev + 1);
  };
  return (
    <div>
      {/* step - 1  */}
      {currentProcessStep === 1 && (
        <form
          method="POST"
          onSubmit={emailSubmit}
          className="flex flex-col gap-3 mt-3"
        >
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={emailChangeInInput}
              placeholder="you@example.com"
              className={`w-75 rounded-lg  border px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errorMessage ? " border-red-500 " : " border-zinc-700 "}`}
            />
            <div className="text-xs mt-1 ml-2 h-4 text-red-500">
              {errorMessage}
            </div>
          </div>
          <Button text="Get OTP" isDisabled={isGetOTPButtonDisabled} />
          <div className="text-sm text-zinc-200 w-75 flex ml-2">
            {successMessage}
          </div>
        </form>
      )}
      {/* step - 2  */}
      {currentProcessStep === 2 && (
        <div>
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              disabled
              placeholder="you@example.com"
              className="w-75 rounded-lg  border border-zinc-700 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end w-75 mt-1">
              <span
                onClick={() => setCurrentProcessStep(1)}
                className="text-xs text-blue-500 cursor-pointer "
              >
                Change email?
              </span>
            </div>
          </div>
          <form action="" className="mt-3" onSubmit={verifyOTP}>
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
                    border: "1px solid #9f9fa9",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </div>
            <div className="text-xs text-red-500 ml-2 mt-1">{errorMessage}</div>
            <Button text="Confirm OTP" isDisabled={isVerifyOTPButtonDisabled} />
            <div className="text-sm ml-2 mt-2" >{successMessage}</div>
          </form>
        </div>
      )}
      {/* step - 3 */}
      {currentProcessStep === 3 && (
        <div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">
              Email
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
          <form action="" onSubmit={changePassword}>
            {/* Password */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-zinc-200 mb-1">
                New Password
              </label>
              <div className="flex">
                <input
                  type={isNewPasswordHidden ? "password" : "text"}
                  name="password"
                  value={newPassword}
                  onChange={passwordChangeInInput}
                  placeholder="Create a strong password"
                  className={`w-75 rounded-lg  border px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring focus:ring-[#4b8f89] focus:border-transparent ${errorMessage ? " border-red-500 " : " border-zinc-400 "} `}
                />
                <div className="">
                  {isNewPasswordHidden ? (
                    <FaEyeSlash
                      onClick={() =>
                        setIsNewPasswordHidden(!isNewPasswordHidden)
                      }
                      className="relative -left-7.5 top-3 text-zinc-300 cursor-pointer "
                    />
                  ) : (
                    <FaEye
                      onClick={() =>
                        setIsNewPasswordHidden(!isNewPasswordHidden)
                      }
                      className="relative -left-7.5 top-3 text-zinc-300 cursor-pointer"
                    />
                  )}
                </div>
              </div>
              <div className="h-4 mt-1 ml-2 text-red-500 text-xs" > {errorMessage} </div>
              <div className="ml-2 w-75 text-xs mt-2 text-zinc-400" >Password should contain Number, Uppercase and special characters</div>
            </div>
            <Button
              text="Reset Password"
              isDisabled={isResetPasswordButtonDisabled}
            />
            <div className="text-sm ml-2 mt-2 " >{successMessage}</div>
          </form>
        </div>
      )}
      {/* step - 4 */}
      {currentProcessStep === 4 && (
        <div className="text-sm flex flex-col justify-center items-center mt-4">
          <div>{successMessage}</div>
          <div>
            Redirecting you to <span className="text-blue-500">Login</span>{" "}
            Page...
          </div>
        </div>
      )}
    </div>
  );
};

export default Forms;

"use client";
import { MeetingDetailsCard } from "./MeetingDetailsCard";
import { motion } from "framer-motion";
import { StepCircle } from "./StepCircle";
import { StepConnector } from "./StepConnector";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentStep } from "@/store/joinMeetingSlice";

export function MeetingSection() {
  const steps = ["Info", "Form", "Confirmation"];
  const dispatch = useDispatch();

  const addStep = () => {
    dispatch(setCurrentStep(1));
  };
  const subtractStep = () => {
    dispatch(setCurrentStep(0));
  };

  const { meeting, currentStep } = useSelector((state) => state.joinMeeting);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden sticky top-6"
    >
      <div className="bg-white pb-6 mb-4 p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => {
            const status =
              index < currentStep
                ? "done"
                : index === currentStep
                ? "running"
                : "incomplete";

            return (
              <div key={index} className="flex items-center">
                {/* Step Circle */}
                <div className="relative ">
                  <StepCircle status={status} />
                  <div className="absolute text-gray-600 text-xs righ">
                    {step}
                  </div>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <StepConnector active={index < currentStep} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {meeting && <MeetingDetailsCard />}

      {!meeting && (
        <div className="relative p-8 border border-gray-200 rounded-3xl bg-linear-to-br from-white to-gray-50 overflow-hidden">
          {/* soft decorative background */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />

          <div className="relative z-10 flex gap-8 items-center">
            {/* Left: Main process illustration */}
            <div className="relative w-[360px] h-[360px] shrink-0 rounded-2xl overflow-hidden bg-white shadow-sm">
              <Image
                src="/joinMeeting03.png"
                fill
                alt="How meetings work"
                className="object-cover"
              />
            </div>

            {/* Right: Guidance + steps visuals */}
            <div className="flex flex-col gap-8">
              {/* Textual guidance */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  No meeting selected
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Select a meeting to view details, or follow the steps below to
                  get started with collaboration.
                </p>
              </div>

              {/* Step visuals */}
              <div className="flex gap-4">
                <div className="relative w-40 h-45 rounded-xl overflow-hidden bg-white shadow-sm hover:scale-[1.02] transition-all duration-300 ease-out">
                  <Image
                    src="/joinMeeting01.png"
                    fill
                    alt="Fill details"
                    className="object-cover"
                  />
                </div>

                <div className="relative w-40 h-45 rounded-xl overflow-hidden bg-white shadow-sm">
                  <Image
                    src="/joinMeeting02.png"
                    fill
                    alt="Join and collaborate"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep == 0 && meeting && (
        <div className="mt-10 flex justify-end text-zinc-500 cursor-pointer">
          <div onClick={addStep} className="px-3 py-1 border rounded-md">
            Next
          </div>
        </div>
      )}
      {currentStep == 1 && meeting && (
        <div className="mt-10 flex justify-start text-zinc-500 cursor-pointer">
          <div onClick={subtractStep} className="px-3 py-1 border rounded-md">
            Back
          </div>
        </div>
      )}
    </motion.div>
  );
}

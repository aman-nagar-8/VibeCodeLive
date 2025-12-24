import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Video, Lock, User } from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setFormDate } from "@/store/joinMeetingSlice";
import Link from "next/link";
import { form } from "framer-motion/client";

export function JoinSection({ handleJoin, password, setPassword }) {
  const dispatch = useDispatch();
  const [guestName, setGuestName] = useState("");
  const user = useSelector((state) => state.user.user);
  const { meeting } = useSelector((state) => state.joinMeeting);
  const [formInfo, setFormInfo] = useState({});

  useEffect(() => {
    dispatch(setFormDate(formInfo));
  }, [formInfo]);

  const isPasswordValid = !meeting.requiresPassword || password.trim() !== "";

  const areRequiredFieldsValid =
    meeting.requiredFields.length === 0 ||
    meeting.requiredFields.every((field) => formInfo?.[field]?.trim() !== "");
    console.log("required fields validity : ", areRequiredFieldsValid);

  const canJoin = isPasswordValid && areRequiredFieldsValid && formInfo; 
  console.log("canJoin : ", canJoin);

  if (meeting.joinPolicy === "AUTH_ONLY" && !user) {
    return (
      <div className="p-6">
        <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <LogIn className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900 mb-1">Authentication Required</p>
              <p className="text-gray-600">
                Please Log in to join this meeting
              </p>
            </div>
          </div>
        </div>
        <Link
          href={"/login"}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          Log In
        </Link>

        {/* <button
          onClick={()=>handleJoin()}
          disabled={isJoining}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          {isJoining ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Log In to Join</span>
            </>
          )}
        </button> */}
      </div>
    );
  }

  if (meeting.joinPolicy === "AUTH_ONLY" && user) {
    return (
      <div className="p-6">
        <h3 className="text-gray-900 mb-4">Join Meeting</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="guestName" className="block text-gray-700 mb-2">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="guestName"
                type="text"
                value={user.name}
                readOnly
                className="w-full pl-10 pr-4 text-gray-500 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {meeting.requiresPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Meeting Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </motion.div>
          )}
          {meeting.requiredFields.map((field, index) => (
            <div key={index}>
              <label htmlFor={field} className="block text-gray-700 mb-2">
                {field}
              </label>
              <input
                id="field"
                type="text"
                value={formInfo[field] || ""}
                onChange={(e) =>
                  setFormInfo((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
                placeholder={`Enter ${field}`}
                className="w-full pl-10 pr-4 text-gray-500 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          ))}

          <button
            onClick={() => handleJoin()}
            disabled={!canJoin}
            className={` w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:hover:shadow-sm`}
          >
            <>
              <Video className="w-5 h-5" />
              <span>Join Meeting</span>
            </>
          </button>

          {meeting.status === "scheduled" && (
            <p className="text-gray-500 text-center">
              This meeting hasn't started yet
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-gray-900 mb-4">Join as Guest</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="guestName" className="block text-gray-700 mb-2">
            Your Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your name"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {meeting.requiresPassword && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Meeting Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </motion.div>
        )}

        <button
          onClick={() => handleJoin()}
          disabled={!canJoin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
        >
          <Video className="w-5 h-5" />
          <span>Join Meeting</span>
        </button>

        {meeting.status === "scheduled" && (
          <p className="text-gray-500 text-center">
            This meeting hasn't started yet
          </p>
        )}
      </div>
    </div>
  );
}

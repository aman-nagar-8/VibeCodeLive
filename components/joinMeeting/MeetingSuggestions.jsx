import { setCurrentStep, setMeeting } from "@/store/joinMeetingSlice";
import { motion } from "framer-motion";
import { Video, Calendar } from "lucide-react";
import { useDispatch } from "react-redux";
// import { Meeting } from '../App';

export function MeetingSuggestions({ meetings }) {
  const dispatch = useDispatch();
  
  const onSelectMeeting = (meeting) => {
    dispatch(setCurrentStep(0));
    dispatch(setMeeting(meeting));
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10"
    >
      <div className="max-h-80 overflow-y-auto">
        {meetings.map((meeting, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            onClick={() => onSelectMeeting(meeting)}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 group"
          >
            <div
              className={`p-2 rounded-lg ${
                meeting.status === "live" ? "bg-green-50" : "bg-blue-50"
              }`}
            >
              {meeting.status === "live" ? (
                <Video
                  className={`w-5 h-5 ${
                    meeting.status === "live"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                />
              ) : (
                <Calendar className="w-5 h-5 text-blue-600" />
              )}
            </div>

            <div className="flex-1 text-left">
              <div className="text-gray-900 group-hover:text-blue-600 transition-colors">
                {meeting.name}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    meeting.status === "live"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {meeting.status === "live" && (
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                  )}
                  <span className="capitalize">{meeting.status}</span>
                </span>
                {meeting.status === "live" && (
                  <span className="text-gray-500">
                    • {meeting.members.length} participants
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

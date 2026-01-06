import { motion } from "framer-motion";
import { JoinSection } from "./JoinSection";
import { Video, Users, Clock, Shield, Globe, User } from "lucide-react";
import LoadingSection from "./LoadingSection";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Api from "@/lib/apiClient";
import { useRouter } from "next/navigation";

export function MeetingDetailsCard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { meeting, currentStep , formData } = useSelector((state) => state.joinMeeting);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setsuccess] = useState("");


  const handleJoin = async ()=>{
    // redirect to loading section
    dispatch({type: 'joinMeeting/setCurrentStep', payload: 2});

   //api call to join meeting
    const res = await Api.post("/joinmeeting" , {
      meetingId: meeting._id,
      password: password,
      formData: formData
    });
    const data = res.data
  
    if(!data.success){
      setError(data.message);
      console.log(data)
      setTimeout(() => {
        dispatch({type: 'joinMeeting/setCurrentStep', payload: 1});
        setError("");
      }, 3000);
      return;
    }
    setsuccess("Joined meeting successfully!");
    setTimeout(() => {
      router.push(`/meeting/member/${data.data.meetingId}`);
    }, 2000);
    // redirect to meeting page
    
    
    try {
      
    } catch (error) {
      console.log("Error joining meeting: ", error);
      setError("Failed to join the meeting. Please try again.");
      setTimeout(() => {
        dispatch({type: 'joinMeeting/setCurrentStep', payload: 1});
      }, 3000);
      return;
    }

  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
        <div className="flex items-start gap-3 m">
          <div
            className={`p-3 rounded-xl ${
              meeting?.status === "live" ? "bg-green-100" : "bg-blue-100"
            }`}
          >
            <Video
              className={`w-6 h-6 ${
                meeting?.status === "live" ? "text-green-600" : "text-blue-600"
              }`}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-gray-900 mb-2">{meeting.name}</h2>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
                  meeting?.status === "live"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {meeting?.status === "live" && (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-600 rounded-full"
                  />
                )}
                <span className="capitalize">{meeting?.status}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Info */}
      {currentStep == 0 && (
        <div className="p-6 space-y-4 border-b border-gray-200">
          <h3 className="text-gray-900">Meeting Details</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-900">{meeting.adminName}</p>
                <p className="text-gray-500">{"Admin"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                {meeting?.joinPolicy === "AUTH_ONLY" ? (
                  <Shield className="w-5 h-5 text-gray-600" />
                ) : (
                  <Globe className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <p className="text-gray-900">
                  {meeting?.joinPolicy === "AUTH_ONLY"
                    ? "Login Required"
                    : "Guest Access Allowed"}
                </p>
                <p className="text-gray-500">
                  {meeting?.joinPolicy === "AUTH_ONLY"
                    ? "Sign in to join this meeting"
                    : "Anyone with link can join"}
                </p>
              </div>
            </div>

            {meeting?.status === "live" && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-900">
                    {meeting.members.length} Participants
                  </p>
                  <p className="text-gray-500">Currently in the meeting</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-900">
                  {new Date(meeting.createdAt).getHours()}:
                  {new Date(meeting.createdAt).getMinutes()}{" "}
                </p>
                <p className="text-gray-500">
                  {meeting?.status === "live" ? "Started at" : "Scheduled for"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Section */}
      {currentStep == 1 && <JoinSection handleJoin={handleJoin} password={password} setPassword={setPassword} />}
      {/* <JoinSection meeting={meeting} /> */}

      {currentStep == 2 && <LoadingSection error={error} success={success} />}
    </div>
  );
}

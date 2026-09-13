import { useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

function VideoCall({ localStream, remoteStream, toggleAudio, toggleVideo, isAudioMuted, isVideoMuted }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="flex-1 flex flex-col gap-3 relative h-full">
      <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
        {/* Remote Video (Fullscreen) */}
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-white/50">
            Waiting for other participant to join...
          </div>
        )}

        {/* Local Video (Picture in Picture) */}
        <div className="absolute bottom-4 right-4 w-40 h-28 bg-base-300 rounded-lg overflow-hidden shadow-lg border-2 border-base-100 z-10">
          {localStream ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100" // Mirror local video
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-xs">
              No Camera
            </div>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <div className="bg-base-100 p-3 rounded-lg shadow flex justify-center gap-4">
        <button
          onClick={toggleAudio}
          className={`btn btn-circle ${isAudioMuted ? "btn-error" : "btn-base-200"}`}
        >
          {isAudioMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`btn btn-circle ${isVideoMuted ? "btn-error" : "btn-base-200"}`}
        >
          {isVideoMuted ? <VideoOff size={20} /> : <Video size={20} />}
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-circle btn-error"
          title="Leave Call"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}

export default VideoCall;

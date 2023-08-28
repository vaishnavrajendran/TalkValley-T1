import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { setLogout } from '../store/Features/userSlice';
import { useAppDispatch } from '../store/store';
import { FaCamera, FaStopCircle } from 'react-icons/fa';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [screenRecordedChunks, setScreenRecordedChunks] = useState<Blob[]>([]);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(setLogout());
    navigate('/');
  };

  const [cameraEnabled, setCameraEnabled] = useState(true);

  useEffect(() => {
    const getCameraAccess = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
          const recorder = new MediaRecorder(localStream, { mimeType: 'video/webm' });

          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
            }
          };
          setMediaRecorder(recorder);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };
    getCameraAccess();
  }, []);

  const startScreenRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      setScreenStream(screenStream);

      const screenRecorder = new MediaRecorder(screenStream, { mimeType: 'video/webm' });
      const screenChunks: Blob[] = [];

      screenRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          screenChunks.push(event.data);
        }
      };

      screenRecorder.onstop = () => {
        setScreenRecordedChunks(screenChunks);
      };

      screenRecorder.start();
    } catch (error) {
      console.error('Error accessing screen:', error);
    }
  };


  const stopScreenRecording = () => {
    if (screenStream) {
      const screenTracks = screenStream.getTracks();
      screenTracks.forEach((track) => track.stop());
      setScreenStream(null);
    }
  };

  const handleToggleRecording = () => {
    if (mediaRecorder) {
      if (isRecording) {
        mediaRecorder.stop();
        stopScreenRecording();
      } else {
        setRecordedChunks([]);
        setScreenRecordedChunks([]);
        mediaRecorder.start();
        startScreenRecording();
      }
      setIsRecording(!isRecording);
    }
  };

  const handleDownloadBothRecordings = () => {

    if (recordedChunks.length > 0 && screenRecordedChunks.length > 0) {
      const cameraBlob = new Blob(recordedChunks, { type: 'video/webm' });
      const cameraUrl = URL.createObjectURL(cameraBlob);
      const cameraLink = document.createElement('a');
      cameraLink.href = cameraUrl;
      cameraLink.download = 'camera-recorded-video.webm';
      cameraLink.style.display = 'none';
      document.body.appendChild(cameraLink);
      cameraLink.click();
      document.body.removeChild(cameraLink);

      const screenBlob = new Blob(screenRecordedChunks, { type: 'video/webm' });
      const screenUrl = URL.createObjectURL(screenBlob);
      const screenLink = document.createElement('a');
      screenLink.href = screenUrl;
      screenLink.download = 'screen-recorded-video.webm';
      screenLink.style.display = 'none';
      document.body.appendChild(screenLink);
      screenLink.click();
      document.body.removeChild(screenLink);
    }
  };


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} />
      <div className="flex-grow flex flex-col items-center justify-center relative">
        <video ref={videoRef} id="user-1" className="w-full max-h-[60vh] mb-4" autoPlay playsInline />
        <div id="controls" className="flex flex-col items-center space-y-4">
          <div
            className={`bg-custom-primary px-3 py-2 rounded-full cursor-pointer ${cameraEnabled ? 'bg-custom-primary' : 'bg-custom-secondary'
              }`}
            id="camera-btn"
            onClick={() => {
              handleToggleRecording();
              setCameraEnabled((prev) => !prev);
            }}
          >
            {isRecording ? <FaStopCircle className="text-white" size={30} /> : <FaCamera className="text-white" size={30} />}
          </div>
          {recordedChunks.length > 0 && (
            <button
              className="bg-custom-primary py-2 px-4 rounded-full cursor-pointer"
              onClick={handleDownloadBothRecordings}
            >
              Download Recorded
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

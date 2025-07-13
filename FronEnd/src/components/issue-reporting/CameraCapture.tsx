import React, { useRef, useEffect, useState } from "react";
import { Camera, X, RotateCcw, Loader2 } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [facingMode]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current
        .play()
        .then(() => setIsLoading(false))
        .catch((e) => {
          console.error("Autoplay failed:", e);
          setIsLoading(false);
        });
    }
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startCamera = async () => {
    setIsLoading(true);
    setError("");

    try {
      stopCamera();

      const constraints = {
        video: {
          facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
    } catch (err: any) {
      console.error("Camera error:", err);

      if (err.name === "NotAllowedError") setError("क्यामेरा अनुमति दिइएन");
      else if (err.name === "NotFoundError") setError("क्यामेरा फेला परेन");
      else if (err.name === "NotReadableError") setError("क्यामेरा प्रयोगमा छ");
      else setError(`क्यामेरा त्रुटि: ${err.message}`);

      setIsLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          onCapture(file);
        }
      },
      "image/jpeg",
      0.8
    );
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-all"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={toggleCamera}
            className="bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-all"
          >
            <RotateCcw className="h-6 w-6" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          {isLoading && (
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                <p>क्यामेरा तयार गर्दै...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{error}</p>
                <button
                  onClick={startCamera}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  पुनः प्रयास गर्नुहोस्
                </button>
              </div>
            </div>
          )}

          {stream && !error && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video object-cover"
              style={{
                transform: facingMode === "user" ? "scaleX(-1)" : "scaleX(1)",
              }}
            />
          )}
        </div>

        {/* Capture Button */}
        {stream && !error && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={capturePhoto}
              className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </button>
          </div>
        )}

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraCapture;

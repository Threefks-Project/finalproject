
import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RotateCcw, Loader2 } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsLoading(false);
    } catch (err) {
      setError('क्यामेरा एक्सेस गर्न सकिएन');
      setIsLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `issue-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
      }
    }, 'image/jpeg', 0.8);
  };

  const toggleCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
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

        {/* Video/Loading/Error */}
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
                  className="mt-4 bg-municipal-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  पुनः प्रयास गर्नुहोस्
                </button>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full aspect-video object-cover"
            />
          )}
        </div>

        {/* Capture Button */}
        {!isLoading && !error && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={capturePhoto}
              className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
            >
              <div className="w-16 h-16 bg-municipal-blue rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </button>
          </div>
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraCapture;

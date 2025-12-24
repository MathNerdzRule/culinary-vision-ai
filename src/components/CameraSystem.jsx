import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CameraSystem = ({ label, image, onImageCapture, onImageClear }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      onImageCapture(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageCapture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest">{label}</h3>
        {image && (
          <button onClick={onImageClear} className="text-charcoal-400 dark:text-charcoal-500 hover:text-red-500 transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-card flex items-center justify-center group">
        <AnimatePresence mode="wait">
          {image ? (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={image}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : isCameraOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-white border-4 border-sage-500 shadow-xl flex items-center justify-center active:scale-90 transition-transform"
                >
                  <div className="w-10 h-10 rounded-full bg-sage-500" />
                </button>
                <button
                  onClick={stopCamera}
                  className="w-12 h-12 rounded-full bg-charcoal-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 p-8 text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-sage-500/10 flex items-center justify-center text-sage-500 dark:text-sage-400 mb-2">
                <Camera size={28} />
              </div>
              <div>
                <p className="text-charcoal-900 dark:text-white font-medium mb-1">Capture {label}</p>
                <p className="text-xs text-charcoal-500 dark:text-charcoal-400">Take a photo of your {label.toLowerCase()} contents</p>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={startCamera} className="btn-primary flex items-center gap-2 py-2 text-sm">
                  <Camera size={18} />
                  <span>Camera</span>
                </button>
                <label className="btn-secondary flex items-center gap-2 py-2 cursor-pointer text-sm">
                  <Upload size={18} />
                  <span>Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

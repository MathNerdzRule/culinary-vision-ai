import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CameraSystem = ({ label, images, onAdd, onRemove, onClear }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Effect to attach stream to video element when it mounts
  useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions and ensure you are on HTTPS.");
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
      
      // Ensure we have valid dimensions
      const width = video.videoWidth || video.width || 640;
      const height = video.videoHeight || video.height || 480;
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, width, height);
      
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        if (dataUrl && dataUrl !== 'data:,') {
          onAdd(dataUrl);
          stopCamera();
        } else {
          throw new Error("Invalid image captured");
        }
      } catch (err) {
        console.error("Capture failed:", err);
        alert("Failed to capture photo. Please try again.");
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAdd(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest">{label}</h3>
        {images.length > 0 && (
          <button onClick={onClear} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-tight">
            Clear All
          </button>
        )}
      </div>

      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-card flex flex-col bg-charcoal-50 dark:bg-charcoal-900/20">
        <AnimatePresence mode="wait">
          {isCameraOpen ? (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative z-10 bg-black"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20">
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
          ) : images.length > 0 ? (
            <motion.div 
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full p-4 overflow-y-auto no-scrollbar grid grid-cols-2 gap-3 content-start"
            >
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm bg-charcoal-100 dark:bg-white/5 border border-charcoal-200 dark:border-white/10">
                  <img src={img} className="w-full h-full object-cover" alt={`${label} ${idx}`} />
                  <button 
                    onClick={() => onRemove(idx)}
                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button 
                onClick={startCamera}
                className="aspect-square rounded-xl border-2 border-dashed border-charcoal-300 dark:border-charcoal-700 flex flex-col items-center justify-center gap-2 text-charcoal-400 dark:text-charcoal-500 hover:border-sage-500 hover:text-sage-500 transition-all bg-white/50 dark:bg-transparent"
              >
                <div className="w-10 h-10 rounded-full bg-charcoal-100 dark:bg-charcoal-800 flex items-center justify-center">
                  <Camera size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Add Photo</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-sage-500/10 flex items-center justify-center text-sage-500 dark:text-sage-400 mb-2">
                <Camera size={28} />
              </div>
              <div className="space-y-1">
                <p className="text-charcoal-900 dark:text-white font-bold tracking-tight">Capture {label}</p>
                <p className="text-xs text-charcoal-500 dark:text-charcoal-400 max-w-[200px]">Take multiple photos to show all your items</p>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={startCamera} className="btn-primary flex items-center gap-2 py-2 px-4 text-xs">
                  <Camera size={16} />
                  <span>Camera</span>
                </button>
                <label className="btn-secondary flex items-center gap-2 py-2 px-4 cursor-pointer text-xs">
                  <Upload size={16} />
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

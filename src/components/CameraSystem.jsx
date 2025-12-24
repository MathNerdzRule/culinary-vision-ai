import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CameraSystem = ({ label, images, onAdd, onRemove, onClear }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const nativeCameraRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Effect to attach stream to video element when it mounts
  useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  const startLiveCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Live camera failed, falling back to native:", err);
      // Fallback to native camera input if live stream fails
      nativeCameraRef.current?.click();
    }
  };

  const handleNativeCamera = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAdd(reader.result);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so the same file can be captured again if needed
    e.target.value = '';
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
      
      // Safety check: Don't capture if video isn't ready
      if (video.readyState < 2) {
        alert("Camera is still warming up...");
        return;
      }

      const canvas = canvasRef.current;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      // Mirroring fix for front cameras if needed, but we use environment
      ctx.drawImage(video, 0, 0, width, height);
      
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        if (dataUrl && dataUrl !== 'data:,') {
          onAdd(dataUrl);
          stopCamera();
        } else {
          throw new Error("Black frame captured");
        }
      } catch (err) {
        console.error("Capture failed:", err);
        // If live capture fails, trigger native camera
        nativeCameraRef.current?.click();
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
      {/* Hidden Native Camera Input - THE MOST RELIABLE MOBILE METHOD */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={nativeCameraRef}
        onChange={handleNativeCamera}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest">{label}</h3>
        {images.length > 0 && (
          <button onClick={onClear} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-tight">
            Clear All
          </button>
        )}
      </div>

      <div className="relative min-h-[320px] rounded-2xl overflow-hidden glass-card flex flex-col bg-charcoal-50 dark:bg-charcoal-900/20 border-2 border-charcoal-200 dark:border-white/5">
        <AnimatePresence mode="wait">
          {isCameraOpen ? (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-black"
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
                  className="w-16 h-16 rounded-full bg-white border-4 border-sage-500 shadow-[0_0_20px_rgba(76,175,80,0.5)] flex items-center justify-center active:scale-95 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-sage-500" />
                </button>
                <button
                  onClick={stopCamera}
                  className="w-12 h-12 rounded-full bg-charcoal-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90"
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
                    className="absolute top-1 right-1 p-2 bg-red-500 text-white rounded-lg shadow-lg z-10"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => nativeCameraRef.current?.click()}
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
              <div className="w-20 h-20 rounded-[2.5rem] bg-sage-500/10 flex items-center justify-center text-sage-500 dark:text-sage-400 mb-2">
                <Camera size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-charcoal-900 dark:text-white text-lg font-bold tracking-tight">Capture {label}</p>
                <p className="text-xs text-charcoal-500 dark:text-charcoal-400 max-w-[220px] mx-auto leading-relaxed">
                  Take clear photos to help Gemini 3 identify every ingredient.
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={() => nativeCameraRef.current?.click()} 
                  className="btn-primary flex flex-col items-center gap-2 py-3 px-6 min-w-[100px]"
                >
                  <Camera size={20} />
                  <span className="text-[10px] uppercase font-black tracking-widest">Camera</span>
                </button>
                <label className="btn-secondary flex flex-col items-center gap-2 py-3 px-6 min-w-[100px] cursor-pointer">
                  <Upload size={20} />
                  <span className="text-[10px] uppercase font-black tracking-widest">Upload</span>
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

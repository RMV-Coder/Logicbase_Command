'use client';

import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
type CameraCaptureProps = {
  onFrameCapture: (frameBase64: string) => void;
};

const CameraCapture: React.FC<CameraCaptureProps> = ({ onFrameCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStarted, setCameraStarted] = useState<boolean>(false);

  useEffect(() => {
    const startCamera = async () => {
      const facingMode: MediaTrackConstraints['facingMode'] = 'environment'; // always back camera, otherwise front if this is the only available camera

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(() => {
              setCameraStarted(true);
            }).catch((err) => {
              console.error("Play error:", err);
            });
          };
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!cameraStarted || !videoRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {willReadFrequently:true});
    let imageData = null;
    const interval = setInterval(() => {
        const video = videoRef.current;
        if (!video) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        try{
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });
            console.log("scanning...");
            if (code) {
                console.log(code.data);
                onFrameCapture(code.data);
            }
        } catch (error) {
            onFrameCapture(error as string);
            console.error("Error decoding QR code: ", error);
        }
    }, 300);

    return () => clearInterval(interval);
  }, [cameraStarted, onFrameCapture]);

  return (
    // <>
    <div className="flex flex-col items-center" style={{width: '350px', height: '350px', overflow: 'hidden', justifySelf: 'center' }}>
      <video
        ref={videoRef}
        className="shadow-lg"
        muted
        playsInline
        style={{margin:'16px' , objectFit: 'cover', position:'relative',   width:'fit-content', height:'-webkit-fill-available'}}
      />
    </div>
  );
};

export default CameraCapture;

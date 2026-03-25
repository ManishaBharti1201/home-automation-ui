import React, { memo, useRef, useEffect } from 'react';

const VideoBackground = memo(({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays smoothly after mounting
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.play().catch(err => console.error("Video play failed", err));
    }
  }, [src]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-transparent">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover scale-[1.01]" // Slight scale hides edge artifacts
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)' // Forces GPU acceleration
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
      {/* The "Glass Overlay" that aids readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />
    </div>
  );
});

VideoBackground.displayName = 'VideoBackground';
export default VideoBackground;
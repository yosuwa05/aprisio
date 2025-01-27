'use client';
import { useState, useEffect, useRef } from 'react';
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

export default function About() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // 1024px is the 'lg' breakpoint in Tailwind
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log("Playback failed:", err));
      }
      setIsPlaying(!isPlaying);
      
      // Show controls and set timeout to hide them
      setShowControls(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 300);
    }
  };

  const handleMuteUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Remove autoplay logic and observer for video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Only play video when user interacts
    const attemptUnmutedAutoplay = async () => {
      try {
        video.muted = false;
        await video.play();
        setIsPlaying(true);
        setIsMuted(false);
      } catch {
        video.muted = true;
        await video.play();
        setIsPlaying(true);
        setIsMuted(true);
      }
    };

    // Remove intersection observer logic, as autoplay is not needed
  }, []);

  const handleControlsVisibility = (visible: boolean) => {
    // Only handle hover events on large screens
    if (!isLargeScreen) return;
    
    if (visible) {
      setShowControls(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      timeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 300);
    }
  };

  return (
    <section className="bg-[#6F7E5F] relative">
      <div className="flex flex-col gap-16 lg:px-14 px-5 lg:pt-20 pt-6">
        <div className="flex lg:flex-row flex-col gap-4 lg:gap-0 justify-between">
          <div className="lg:w-1/2 w-full">
            <h1 className="font-roboto font-semibold xl:text-7xl lg:text-5xl text-2xl text-white">
              About Aprisio
            </h1>
            <p className="font-roboto lg:text-4xl text-xl lg:pt-4 pt-5 text-white">
            Live your best life after your career
            </p>
          </div>

          <div className="lg:w-1/2 w-full">
            <p className="text-white !leading-relaxed xl:text-3xl lg:text-xl text-lg font-sans">
              Aprisio is a community of, for and by post-career individuals whose careers may be behind them but their best days are ahead of them. This community seeks to explore new opportunities to stay productive, foster new, meaningful connections to stay connected, and pursue new interests to retain their zest for life.
            </p>
          </div>
        </div>

        <div className='w-full h-full flex justify-center items-center'>
          <div className='w-fit h-fit'>
            <div 
              className="lg:w-full xl:h-[614px] flex justify-center lg:h-[414px] h-[280px] rounded-3xl relative"
              onMouseEnter={() => handleControlsVisibility(true)}
              onMouseLeave={() => handleControlsVisibility(false)}
            >
              <div className='w-fit'>
                <video
                  className="w-full h-full object-cover rounded-t-2xl"
                  ref={videoRef}
                  preload="auto"
                  loop
                  playsInline
                  muted={isMuted}
                >
                  <source src="/video/Home_Page Video_140125.mp4" type="video/mp4" />
                </video>

                <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
                  <div className="w-full h-full flex justify-center items-center">
                    <button
                      onClick={handlePlayPause}
                      className={`lg:w-20 lg:h-20 h-14 w-14 rounded-full bg-white/80 flex justify-center lg:text-2xl text-lg items-center text-[#043A53] transition-opacity duration-300 ${
                        showControls ? 'opacity-100' : 'opacity-0'
                      }`}
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                  </div>
                </div>

                <div 
                  className={`absolute lg:bottom-7 lg:right-24 bottom-5 right-20 p-2 rounded text-[#043A53] font-bold bg-white text-sm transition-opacity duration-300 ${
                    isMuted ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Tap to unmute
                </div>

                <button
                  onClick={handleMuteUnmute}
                  className={`absolute bottom-4 right-4 lg:w-16 lg:h-16 h-12 w-12 rounded-full bg-white/80 flex justify-center text-lg lg:text-2xl items-center text-[#043A53] transition-opacity duration-300 
                 `}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

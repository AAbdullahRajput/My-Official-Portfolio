"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const DOCK_DELAY = 3000;
const AUDIO_DELAY = 1500;

export default function GramophonePlayer({ active = true }: { active?: boolean }) {
  const [phase, setPhase] = useState<"hidden" | "paused" | "center" | "docking" | "docked" | "gone">(() => {
    if (typeof window === "undefined") return "hidden";
    if (localStorage.getItem("gramo_dismissed") === "1") return "gone";
    // If not on home page, start docked so there is no dark modal covering /privacy or /404
    if (window.location.pathname !== "/") return "docked";
    return "hidden";
  });

  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [gifSrc, setGifSrc] = useState("/gifs/gramophone.gif");
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasPlayingBeforeHideRef = useRef(false);

  // Background play setting: true = keeps playing when Chrome/phone is minimized; false = pauses on minimize
  const [bgPlay, setBgPlay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("gramo_bg_play");
    return saved !== null ? saved === "1" : true;
  });

  const toggleBgPlay = () => {
    setBgPlay((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("gramo_bg_play", next ? "1" : "0");
      }
      return next;
    });
  };

  // MediaSession API for mobile lockscreen & background controls
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "Sunflower (Portfolio Theme)",
        artist: "Post Malone & Swae Lee",
        album: "Spider-Man Soundtrack",
        artwork: [
          { src: "/images/profile.jpeg", sizes: "512x512", type: "image/jpeg" },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        audioRef.current?.play().catch(() => {});
        setPlaying(true);
        notifyGramophonePlaying();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        audioRef.current?.pause();
        setPlaying(false);
      });
    } catch {}

    return () => {
      if ("mediaSession" in navigator) {
        try {
          navigator.mediaSession.setActionHandler("play", null);
          navigator.mediaSession.setActionHandler("pause", null);
        } catch {}
      }
    };
  }, []);

  // Update MediaSession playback state
  useEffect(() => {
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.playbackState = playing ? "playing" : "paused";
      } catch {}
    }
  }, [playing]);

  // Chrome minimization listener: pause if bgPlay is false; resume on restore if was playing
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (!bgPlay && playing && audioRef.current && !audioRef.current.paused) {
          wasPlayingBeforeHideRef.current = true;
          audioRef.current.pause();
          setPlaying(false);
        }
      } else {
        if (!bgPlay && wasPlayingBeforeHideRef.current && audioRef.current) {
          wasPlayingBeforeHideRef.current = false;
          audioRef.current.play().catch(() => {});
          setPlaying(true);
          notifyGramophonePlaying();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [bgPlay, playing]);

  // Resize listener
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Auto-dock if navigating away from home page
  useEffect(() => {
    if (pathname !== "/" && phase !== "docked" && phase !== "gone") {
      setPhase("docked");
    }
  }, [pathname, phase]);

  // Listen for splash screen finished on home page
  useEffect(() => {
    if (!isHomePage) {
      if (phase === "hidden") {
        setPhase("docked");
      }
      return;
    }

    // On home page, if active and already completed splash
    if (active && phase === "hidden") {
      const handleSplashDone = () => {
        setPhase("paused");
      };

      // Check if already finished or listen
      if (sessionStorage.getItem("splash_done") === "1") {
        setPhase("paused");
      } else {
        window.addEventListener("splash-finished", handleSplashDone);
        return () => window.removeEventListener("splash-finished", handleSplashDone);
      }
    }
  }, [active, phase, isHomePage]);

  // Audio coordination: Listen for 404 Arcade player playing
  useEffect(() => {
    const handleAudioEvent = (e: any) => {
      if (e.detail?.source === "arcade" && e.detail?.action === "play") {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          setPlaying(false);
        }
      }
    };
    window.addEventListener("portfolio-audio-event", handleAudioEvent);
    return () => window.removeEventListener("portfolio-audio-event", handleAudioEvent);
  }, []);

  function notifyGramophonePlaying() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("portfolio-audio-event", {
          detail: { action: "play", source: "gramophone" },
        })
      );
    }
  }

  function handlePlay() {
    setShowGif(true);
    setGifSrc(`/gifs/gramophone.gif?t=${Date.now()}`);
    setPhase("center");
    setTimeout(() => {
      audioRef.current?.play().catch((err) => {
        console.warn("Audio play failed:", err);
      });
      setPlaying(true);
      notifyGramophonePlaying();
    }, AUDIO_DELAY);

    dockTimerRef.current = setTimeout(() => {
      setPhase("docking");
      setTimeout(() => setPhase("docked"), 1000);
    }, DOCK_DELAY);
  }

  function toggleMute() {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setMuted(audioRef.current.muted);
    }
  }

  function handleDismiss() {
    audioRef.current?.pause();
    setPlaying(false);
    localStorage.setItem("gramo_dismissed", "1");
    setPhase("gone");
  }

  useEffect(() => {
    return () => {
      if (dockTimerRef.current) clearTimeout(dockTimerRef.current);
    };
  }, []);

  if (phase === "hidden") return null;

  const isPaused = phase === "paused";
  const isDocking = phase === "docking";
  const isDocked = phase === "docked";

  // Only show fullscreen dark backdrop if on the home page and in introductory phase
  const overlayVisible = isHomePage && (isPaused || phase === "center" || isDocking);

  return (
    <>
      <audio ref={audioRef} src="/song/sunflower.mp3" loop />

      <AnimatePresence>
        {overlayVisible && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[9990] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              backgroundColor: "rgb(5,5,5)",
              backgroundImage:
                "radial-gradient(ellipse at 50% 50%, rgba(80,5,5,0.9) 0%, rgba(11,14,19,0.98) 50%, rgba(5,5,5,1) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase !== "gone" && (
          <>
            {!isDocked && isHomePage && (
              <motion.div
                key="gramo-center"
                className="fixed z-[9991] pointer-events-none"
                style={{
                  top: "50%",
                  left: "50%",
                  marginTop: -110,
                  marginLeft: -150,
                  width: 300,
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                  opacity: isDocking ? 0 : 1,
                  scale: isDocking ? 0.7 : 1,
                  y: isDocking ? 60 : 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
              >
                <div
                  className="pointer-events-none absolute inset-0 -z-10"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(138,3,3,0.55) 0%, rgba(138,3,3,0.18) 45%, transparent 70%)",
                    transform: "scale(2)",
                    filter: "blur(20px)",
                    borderRadius: "50%",
                  }}
                />

                <motion.img
                  src={showGif ? gifSrc : "/gifs/gramophone-poster.png"}
                  alt="Gramophone"
                  className="pointer-events-none w-full drop-shadow-2xl"
                  animate={
                    showGif
                      ? { filter: "grayscale(0) brightness(1) blur(0px)" }
                      : { filter: "grayscale(0.95) brightness(0.45) blur(3px)" }
                  }
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />

                <AnimatePresence>
                  {isPaused && (
                    <motion.button
                      key="play-btn"
                      onClick={handlePlay}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-auto"
                      aria-label="Play music"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.15 }}
                      transition={{ duration: 0.4, delay: 0.25 }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <div className="relative flex items-center justify-center">
                        <motion.div
                          className="absolute rounded-full border-2 border-[#8a0303]"
                          animate={{ scale: [1, 1.7], opacity: [0.8, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                          style={{ width: 82, height: 82 }}
                        />
                        <motion.div
                          className="absolute rounded-full border border-[#8a0303]/50"
                          animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                          transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                          style={{ width: 82, height: 82 }}
                        />
                        <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full border-2 border-[#8a0303] bg-black/60 shadow-2xl backdrop-blur-sm">
                          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-[10px] tracking-[0.32em] text-white/50 uppercase font-light select-none">
                        click to resume
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {isDocked && (
              <motion.div
                key="gramo-docked"
                className="fixed z-[9991]"
                style={{ bottom: isMobile ? 18 : 24, left: isMobile ? 18 : 24, width: isMobile ? 74 : 90 }}
                initial={{ opacity: 0, scale: 0.5, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="pointer-events-none absolute inset-0 -z-10"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(138,3,3,0.35) 0%, transparent 70%)",
                    transform: "scale(2.2)",
                    filter: "blur(10px)",
                    borderRadius: "50%",
                  }}
                />
                <img
                  src={playing ? "/gifs/gramophone.gif" : "/gifs/gramophone-poster.png"}
                  alt="Gramophone"
                  className="pointer-events-none w-full drop-shadow-2xl"
                />
                <button
                  onClick={() => {
                    if (!audioRef.current) return;
                    if (playing) {
                      audioRef.current.pause();
                      setPlaying(false);
                    } else {
                      audioRef.current.play().catch(() => {});
                      setPlaying(true);
                      notifyGramophonePlaying();
                    }
                  }}
                  className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#8a0303]/40 bg-white text-[#8a0303] shadow-sm transition-transform hover:scale-110"
                  aria-label={playing ? "Pause music" : "Play music"}
                >
                  {playing ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="4" width="4" height="16" />
                      <rect x="15" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#8a0303]/40 bg-white text-[#8a0303] shadow-sm transition-transform hover:scale-110"
                  aria-label={muted ? "Unmute music" : "Mute music"}
                >
                  {muted ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={handleDismiss}
                  className="absolute -right-2 -bottom-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#8a0303]/40 bg-white text-[#8a0303] shadow-sm transition-transform hover:scale-110"
                  aria-label="Close music player"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <button
                  onClick={toggleBgPlay}
                  className={`absolute -left-2 -bottom-2 flex h-6 w-6 items-center justify-center rounded-full border shadow-sm transition-transform hover:scale-110 ${
                    bgPlay
                      ? "border-emerald-500/50 bg-white text-emerald-600 shadow-emerald-500/20"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                  aria-label={bgPlay ? "Disable background playback (pauses on minimize)" : "Enable background playback (plays on minimize)"}
                  title={bgPlay ? "Background Play: ON (Plays if Chrome is minimized)" : "Background Play: OFF (Pauses if Chrome is minimized)"}
                >
                  {bgPlay ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  )}
                </button>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {phase === "gone" && (
        <motion.button
          className="fixed bottom-6 left-6 z-[9991] flex h-9 w-9 items-center justify-center rounded-full border border-[#8a0303]/40 bg-white/90 text-[#8a0303] shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 1 }}
          onClick={() => {
            localStorage.removeItem("gramo_dismissed");
            setShowGif(false);
            setPhase("docked");
          }}
          aria-label="Play music again"
          title="Play music again"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </motion.button>
      )}
    </>
  );
}

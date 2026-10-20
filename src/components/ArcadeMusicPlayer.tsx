"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiPause,
  FiSkipForward,
  FiSkipBack,
  FiSearch,
  FiVolume2,
  FiVolumeX,
  FiRepeat,
  FiShuffle,
  FiMusic,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

export interface Song {
  id: string | number;
  title: string;
  artist: string;
  albumArt: string;
  previewUrl: string;
}

// Initial default playlist referencing the user's exact uploaded designs
const DEFAULT_SONGS: Song[] = [
  {
    id: "foals-runner",
    title: "The Runner",
    artist: "Foals",
    albumArt: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/4e/77/84/4e77843d-0d67-4eb3-ea75-45c5896cb4dc/190295371569.jpg/600x600bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/58/b7/71/58b771e8-7657-30e4-08fa-8cf48c3b9991/mzaf_11301078726207198751.plus.aac.p.m4a",
  },
  {
    id: "fkj-ylang",
    title: "Ylang Ylang",
    artist: "FKJ & ((( O )))",
    albumArt: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bb/b7/ab/bbb7aba4-e046-a42c-49e3-d5ebb39c7e32/112178.jpg/600x600bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bf/25/7f/bf257f86-cfdf-ba68-4a57-19ad080fa46d/mzaf_1052671542457813872.plus.aac.p.m4a",
  },
  {
    id: "odesza-moment",
    title: "A Moment Apart",
    artist: "ODESZA",
    albumArt: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/eb/d4/22/ebd422d1-b959-dd5d-b395-f9413044cff1/5054429119183.png/600x600bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/57/02/76/57027663-e5e7-a9a2-5d4c-2831cb6358c3/mzaf_16428623719011707963.plus.aac.p.m4a",
  },
  {
    id: "daft-punk-one-more-time",
    title: "One More Time",
    artist: "Daft Punk",
    albumArt: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/600x600bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/91/92/ff/9192ff15-f5ae-95cb-d6ae-8488eefd2a6a/mzaf_13502570088891041926.plus.aac.p.m4a",
  },
  {
    id: "m83-midnight-city",
    title: "Midnight City",
    artist: "M83",
    albumArt: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/bb/94/d6/bb94d61c-99a0-6ce3-8995-18864700ea65/3700551717316.jpg/600x600bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ee/f1/a0/eef1a0ee-6c39-3075-ef19-ba37d0458f33/mzaf_7190367292156828859.plus.aac.p.m4a",
  },
];

export default function ArcadeMusicPlayer() {
  const [playlist, setPlaylist] = useState<Song[]>(DEFAULT_SONGS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30); // Previews are typically 30s
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSong = playlist[currentIndex] || DEFAULT_SONGS[0];

  // Initialize and handle Audio Element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 30);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNext();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Update source when currentSong changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.previewUrl;
    audio.load();

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Auto-play prevented by browser policy:", err);
        setIsPlaying(false);
      });
    }
  }, [currentIndex, currentSong]);

  // Volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Audio play blocked:", err);
      });
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * playlist.length);
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    }
  };

  const handlePrev = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
  };

  // Live Song Search via iTunes API (Free, reliable, no token needed)
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=8`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const mapped: Song[] = data.results
          .filter((item: any) => item.previewUrl)
          .map((item: any) => ({
            id: item.trackId,
            title: item.trackName,
            artist: item.artistName,
            albumArt: (item.artworkUrl100 || "").replace("100x100bb.jpg", "600x600bb.jpg"),
            previewUrl: item.previewUrl,
          }));
        setSearchResults(mapped);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Failed to search songs:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (song: Song) => {
    // Add to playlist if not already present
    const existingIndex = playlist.findIndex((s) => s.id === song.id);
    if (existingIndex !== -1) {
      setCurrentIndex(existingIndex);
    } else {
      setPlaylist((prev) => [song, ...prev]);
      setCurrentIndex(0);
    }
    setIsPlaying(true);
    setShowSearch(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate circular progress for SVG ring
  const progressRatio = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="w-full max-w-[340px] select-none">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* ── Minimized Floating Pill Bar ── */
          <motion.div
            key="minimized"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-3 rounded-full border border-gray-200/90 bg-white/90 p-2 pl-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#151a24]/90"
          >
            {/* Spinning mini disk */}
            <div
              className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/20 shadow-sm ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "7s" }}
            >
              <img
                src={currentSong.albumArt}
                alt={currentSong.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <p className="truncate font-sans text-xs font-bold text-[#0b0e13] dark:text-white">
                {currentSong.title}
              </p>
              <p className="truncate font-sans text-[10px] text-[#6b7280] dark:text-[#9aa4b5]">
                {currentSong.artist}
              </p>
            </div>

            <button
              type="button"
              onClick={togglePlay}
              data-cursor-hover
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8a0303] text-white shadow-md dark:bg-[#f2a93b] dark:text-[#0b0e13]"
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              {isPlaying ? <FiPause className="h-3.5 w-3.5" /> : <FiPlay className="ml-0.5 h-3.5 w-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              data-cursor-hover
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#6b7280] hover:text-[#0b0e13] dark:text-[#9aa4b5] dark:hover:text-white"
              aria-label="Expand player"
            >
              <FiChevronUp className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          /* ── Full Player Card (Behance / Google Ref Style) ── */
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-[32px] border border-gray-200/80 bg-white/85 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#12161f]/90"
          >
            {/* Ambient album glow behind card */}
            <div
              className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full opacity-30 blur-3xl"
              style={{
                backgroundImage: `radial-gradient(circle, #8a0303 0%, transparent 70%)`,
              }}
            />
            <div
              className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full opacity-25 blur-3xl"
              style={{
                backgroundImage: `radial-gradient(circle, #f2a93b 0%, transparent 70%)`,
              }}
            />

            {/* Top Bar inside Card */}
            <div className="relative z-10 mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                data-cursor-hover
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#6b7280] hover:text-[#0b0e13] dark:text-[#9aa4b5] dark:hover:text-white"
                aria-label="Minimize player"
              >
                <FiChevronDown className="h-4 w-4" />
              </button>

              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6b7280] dark:text-[#9aa4b5]">
                Arcade Chillout
              </span>

              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                data-cursor-hover
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                  showSearch
                    ? "bg-[#8a0303] text-white dark:bg-[#f2a93b] dark:text-[#0b0e13]"
                    : "text-[#6b7280] hover:text-[#0b0e13] dark:text-[#9aa4b5] dark:hover:text-white"
                }`}
                aria-label="Search song"
              >
                <FiSearch className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* ── Search Overlay Drawer ── */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative z-20 mb-4 overflow-hidden rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-lg dark:border-white/10 dark:bg-[#1a202c]/95"
                >
                  <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search any song or artist..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 font-sans text-xs text-[#0b0e13] outline-none placeholder:text-gray-400 focus:border-[#8a0303] dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:focus:border-[#f2a93b]"
                    />
                    <button
                      type="submit"
                      disabled={isSearching}
                      data-cursor-hover
                      className="shrink-0 rounded-xl bg-[#8a0303] px-3 py-1.5 font-mono text-[11px] font-medium text-white shadow-sm transition-all hover:bg-[#6e0202] dark:bg-[#f2a93b] dark:text-[#0b0e13]"
                    >
                      {isSearching ? "..." : "Find"}
                    </button>
                  </form>

                  {/* Search results list */}
                  {searchResults.length > 0 && (
                    <div className="no-scrollbar mt-3 max-h-40 space-y-1.5 overflow-y-auto pt-1">
                      {searchResults.map((song) => (
                        <button
                          key={song.id}
                          type="button"
                          onClick={() => selectSearchResult(song)}
                          data-cursor-hover
                          className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                        >
                          <img
                            src={song.albumArt}
                            alt={song.title}
                            className="h-7 w-7 rounded-md object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-sans text-xs font-semibold text-[#0b0e13] dark:text-white">
                              {song.title}
                            </p>
                            <p className="truncate font-sans text-[10px] text-[#6b7280] dark:text-[#9aa4b5]">
                              {song.artist}
                            </p>
                          </div>
                          <FiPlay className="h-3 w-3 text-[#8a0303] dark:text-[#f2a93b]" />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Circular Vinyl & Progress Ring Visual ── */}
            <div className="relative mx-auto my-4 flex h-48 w-48 items-center justify-center">
              {/* SVG Circular Progress Track */}
              <svg className="absolute inset-0 h-full w-full -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="transparent"
                  className="text-gray-200 dark:text-white/10"
                />
                {/* Active Progress Ring */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-[#8a0303] transition-all duration-200 dark:text-[#f2a93b]"
                />
              </svg>

              {/* Spinning Vinyl Album Artwork */}
              <div
                className={`relative h-28 w-28 overflow-hidden rounded-full border-2 border-white/40 shadow-xl ${
                  isPlaying ? "animate-spin" : ""
                }`}
                style={{ animationDuration: "12s" }}
              >
                <img
                  src={currentSong.albumArt}
                  alt={currentSong.title}
                  className="h-full w-full object-cover select-none"
                />
                {/* Center vinyl pin hole */}
                <div className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-black/80" />
              </div>
            </div>

            {/* Time Indicator */}
            <div className="mb-2 text-center font-mono text-[11px] text-[#6b7280] dark:text-[#9aa4b5]">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-2 opacity-40">|</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Song Title & Artist */}
            <div className="mb-6 text-center">
              <h3 className="truncate font-sans text-base font-bold text-[#0b0e13] dark:text-white">
                {currentSong.title}
              </h3>
              <p className="mt-0.5 truncate font-sans text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                {currentSong.artist}
              </p>
            </div>

            {/* ── Main Media Controls Row ── */}
            <div className="flex items-center justify-between px-2">
              {/* Shuffle */}
              <button
                type="button"
                onClick={() => setIsShuffle(!isShuffle)}
                data-cursor-hover
                className={`transition-colors ${
                  isShuffle
                    ? "text-[#8a0303] dark:text-[#f2a93b]"
                    : "text-[#9ca3af] hover:text-[#0b0e13] dark:text-white/40 dark:hover:text-white"
                }`}
                aria-label="Toggle shuffle"
              >
                <FiShuffle className="h-4 w-4" />
              </button>

              {/* Prev */}
              <button
                type="button"
                onClick={handlePrev}
                data-cursor-hover
                className="text-[#374151] transition-transform hover:scale-110 hover:text-[#0b0e13] dark:text-[#d1d5db] dark:hover:text-white"
                aria-label="Previous track"
              >
                <FiSkipBack className="h-5 w-5" />
              </button>

              {/* Big Circular Play / Pause Button */}
              <button
                type="button"
                onClick={togglePlay}
                data-cursor-hover
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b0e13] text-white shadow-xl transition-all duration-200 hover:scale-105 hover:bg-[#8a0303] dark:bg-white dark:text-[#0b0e13] dark:hover:bg-[#f2a93b]"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <FiPause className="h-5 w-5" /> : <FiPlay className="ml-0.5 h-5 w-5" />}
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={handleNext}
                data-cursor-hover
                className="text-[#374151] transition-transform hover:scale-110 hover:text-[#0b0e13] dark:text-[#d1d5db] dark:hover:text-white"
                aria-label="Next track"
              >
                <FiSkipForward className="h-5 w-5" />
              </button>

              {/* Repeat */}
              <button
                type="button"
                onClick={() => setIsRepeat(!isRepeat)}
                data-cursor-hover
                className={`transition-colors ${
                  isRepeat
                    ? "text-[#8a0303] dark:text-[#f2a93b]"
                    : "text-[#9ca3af] hover:text-[#0b0e13] dark:text-white/40 dark:group-hover:text-white dark:hover:text-white"
                }`}
                aria-label="Toggle repeat"
              >
                <FiRepeat className="h-4 w-4" />
              </button>
            </div>

            {/* Bottom Mini Equalizer & Volume */}
            <div className="mt-5 flex items-center justify-between border-t border-gray-200/80 pt-4 dark:border-white/[0.08]">
              {/* Equalizer Waveform Animation */}
              <div className="flex items-end gap-1 h-3.5">
                {[40, 80, 55, 95, 60].map((h, i) => (
                  <span
                    key={i}
                    className={`w-0.5 rounded-full bg-[#8a0303] transition-all duration-200 dark:bg-[#f2a93b] ${
                      isPlaying ? "animate-pulse" : "opacity-30"
                    }`}
                    style={{
                      height: isPlaying ? `${h}%` : "30%",
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
                <span className="ml-2 font-mono text-[9px] uppercase tracking-wider text-[#6b7280] dark:text-[#9aa4b5]">
                  {isPlaying ? "Live Audio" : "Paused"}
                </span>
              </div>

              {/* Volume Button */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                data-cursor-hover
                className="text-[#6b7280] hover:text-[#0b0e13] dark:text-[#9aa4b5] dark:hover:text-white"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <FiVolumeX className="h-3.5 w-3.5 text-red-500" />
                ) : (
                  <FiVolume2 className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

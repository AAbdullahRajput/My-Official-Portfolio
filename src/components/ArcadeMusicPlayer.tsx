"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  FiHeart,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiTrash2,
  FiStar,
} from "react-icons/fi";

export interface Song {
  id: string | number;
  title: string;
  artist: string;
  albumArt: string;
  previewUrl: string;
}

// ── Bulletproof Fallback Tracks (Guaranteed permanent live audio streams) ──
const FALLBACK_SONGS: Song[] = [
  {
    id: "lofi-chill-1",
    title: "Ylang Ylang (Chill Vibes)",
    artist: "FKJ & ((( O )))",
    albumArt: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    previewUrl: "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3",
  },
  {
    id: "synthwave-drive-2",
    title: "A Moment Apart",
    artist: "ODESZA",
    albumArt: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "retro-arcade-3",
    title: "The Runner",
    artist: "Foals",
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "cyber-beats-4",
    title: "One More Time",
    artist: "Daft Punk",
    albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

// Quick suggestion chips
const SUGGESTED_GENRES = [
  "FKJ Ylang Ylang",
  "Odesza",
  "Daft Punk",
  "Synthwave",
  "Lofi Gaming",
  "The Weeknd",
];

const STORAGE_RECENT_KEY = "arcade_player_recent_searches";
const STORAGE_LIKED_KEY = "arcade_player_liked_songs";

export default function ArcadeMusicPlayer() {
  const [playlist, setPlaylist] = useState<Song[]>(FALLBACK_SONGS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [isLoop, setIsLoop] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"player" | "search" | "liked">("player");

  // Search & History
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const currentSong = playlist[currentIndex] || FALLBACK_SONGS[0];

  // Load localStorage on mount & fetch fresh live tracks
  useEffect(() => {
    try {
      const savedRecents = localStorage.getItem(STORAGE_RECENT_KEY);
      if (savedRecents) setRecentSearches(JSON.parse(savedRecents));

      const savedLiked = localStorage.getItem(STORAGE_LIKED_KEY);
      if (savedLiked) setLikedSongs(JSON.parse(savedLiked));
    } catch (e) {
      console.warn("localStorage access restricted", e);
    }

    // Fetch fresh live preview URLs from iTunes on mount
    async function loadFreshHits() {
      try {
        const queries = ["FKJ Ylang Ylang", "Odesza A Moment Apart", "Daft Punk One More Time", "M83 Midnight City"];
        const promises = queries.map((q) =>
          fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=1`)
            .then((r) => r.json())
            .catch(() => null)
        );
        const results = await Promise.all(promises);
        const fresh: Song[] = [];

        results.forEach((res) => {
          if (res?.results?.[0]?.previewUrl) {
            const item = res.results[0];
            fresh.push({
              id: item.trackId,
              title: item.trackName,
              artist: item.artistName,
              albumArt: (item.artworkUrl100 || "").replace("100x100bb.jpg", "600x600bb.jpg"),
              previewUrl: item.previewUrl,
            });
          }
        });

        if (fresh.length > 0) {
          setPlaylist((prev) => [...fresh, ...prev]);
        }
      } catch (err) {
        console.warn("Fallback to offline songs", err);
      }
    }

    loadFreshHits();
  }, []);

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
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
      setAudioError(null);
    };

    const handleEnded = () => {
      if (isLoop) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNext();
      }
    };

    const handleError = () => {
      setAudioError("Stream unavailable. Skipping...");
      setTimeout(() => {
        handleNext();
      }, 1500);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [isLoop]);

  // Sync Loop property directly on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLoop;
    }
  }, [isLoop]);

  // Safe Play & Pause methods handling Chrome/Safari Promise race conditions
  const safePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setAudioError(null);
    try {
      const promise = audio.play();
      if (promise !== undefined) {
        playPromiseRef.current = promise;
        promise
          .then(() => {
            playPromiseRef.current = null;
            setIsPlaying(true);
          })
          .catch((err) => {
            playPromiseRef.current = null;
            // Ignore AbortError: triggered normally when user rapidly toggles pause/play
            if (err.name !== "AbortError") {
              console.warn("Playback error:", err);
              setIsPlaying(false);
            }
          });
      }
    } catch {
      playPromiseRef.current = null;
    }
  }, []);

  const safePause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playPromiseRef.current) {
      playPromiseRef.current
        .then(() => {
          audio.pause();
          setIsPlaying(false);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  // Handle song change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong || !currentSong.previewUrl) return;

    setAudioError(null);

    const changeTrack = () => {
      audio.pause();
      audio.src = currentSong.previewUrl;
      audio.load();
      if (isPlaying) {
        safePlay();
      }
    };

    if (playPromiseRef.current) {
      playPromiseRef.current
        .then(changeTrack)
        .catch(changeTrack);
    } else {
      changeTrack();
    }
  }, [currentIndex, currentSong?.id, isPlaying, safePlay]);

  // Sync volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (isPlaying) {
      safePause();
    } else {
      safePlay();
    }
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  }, [playlist.length]);

  const handlePrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
  }, [playlist.length]);

  // Toggle Like / Favorite
  const isCurrentLiked = likedSongs.some((s) => s.id === currentSong?.id);
  const toggleLike = () => {
    if (!currentSong) return;
    let updated: Song[];
    if (isCurrentLiked) {
      updated = likedSongs.filter((s) => s.id !== currentSong.id);
    } else {
      updated = [currentSong, ...likedSongs];
    }
    setLikedSongs(updated);
    try {
      localStorage.setItem(STORAGE_LIKED_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  // Perform search
  const performSearch = async (queryText: string) => {
    const clean = queryText.trim();
    if (!clean) return;

    setIsSearching(true);
    setSearchQuery(clean);

    // Save to recents
    const updatedRecents = [clean, ...recentSearches.filter((q) => q.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
    setRecentSearches(updatedRecents);
    try {
      localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(updatedRecents));
    } catch (e) {}

    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(clean)}&entity=song&limit=10`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const valid: Song[] = data.results
          .filter((item: any) => item.previewUrl)
          .map((item: any) => ({
            id: item.trackId,
            title: item.trackName,
            artist: item.artistName,
            albumArt: (item.artworkUrl100 || "").replace("100x100bb.jpg", "600x600bb.jpg"),
            previewUrl: item.previewUrl,
          }));
        setSearchResults(valid);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const selectSong = (song: Song) => {
    const existingIndex = playlist.findIndex((s) => s.id === song.id);
    if (existingIndex !== -1) {
      setCurrentIndex(existingIndex);
    } else {
      setPlaylist((prev) => [song, ...prev]);
      setCurrentIndex(0);
    }
    setIsPlaying(true);
    setActiveTab("player");
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_RECENT_KEY);
    } catch (e) {}
  };

  // Scrubber seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Circular progress calculations
  const progressRatio = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="w-full max-w-[340px] select-none">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* ── Minimized Floating Bar ── */
          <motion.div
            key="minimized"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-3 rounded-full border border-gray-200/90 bg-white/95 p-2 pl-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#151a24]/95"
          >
            {/* Spinning mini vinyl */}
            <div
              className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/20 shadow-sm ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "8s" }}
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
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8a0303] text-white shadow-md transition-transform hover:scale-105 dark:bg-[#f2a93b] dark:text-[#0b0e13]"
              aria-label={isPlaying ? "Pause" : "Play"}
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
          /* ── Full Player Card (Behance / Google Reference Design) ── */
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="relative overflow-hidden rounded-[32px] border border-gray-200/90 bg-white/90 p-5 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#12161f]/95"
          >
            {/* Ambient album glow */}
            <div
              className="pointer-events-none absolute -top-16 -left-16 h-52 w-52 rounded-full opacity-30 blur-3xl"
              style={{
                backgroundImage: `radial-gradient(circle, #8a0303 0%, transparent 70%)`,
              }}
            />
            <div
              className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full opacity-25 blur-3xl"
              style={{
                backgroundImage: `radial-gradient(circle, #f2a93b 0%, transparent 70%)`,
              }}
            />

            {/* Top Navigation Tabs inside Card */}
            <div className="relative z-10 mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                data-cursor-hover
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#6b7280] hover:text-[#0b0e13] dark:text-[#9aa4b5] dark:hover:text-white"
                aria-label="Minimize"
              >
                <FiChevronDown className="h-4 w-4" />
              </button>

              {/* Navigation Pill Tabs */}
              <div className="flex items-center gap-1 rounded-full border border-gray-200/80 bg-gray-100/70 p-1 font-mono text-[10px] dark:border-white/10 dark:bg-white/[0.04]">
                <button
                  type="button"
                  onClick={() => setActiveTab("player")}
                  data-cursor-hover
                  className={`rounded-full px-2.5 py-0.5 font-medium transition-all ${
                    activeTab === "player"
                      ? "bg-white text-[#0b0e13] shadow-sm dark:bg-white/15 dark:text-white"
                      : "text-[#6b7280] hover:text-[#0b0e13] dark:text-[#9aa4b5] dark:hover:text-white"
                  }`}
                >
                  Now Playing
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("search")}
                  data-cursor-hover
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium transition-all ${
                    activeTab === "search"
                      ? "bg-white text-[#0b0e13] shadow-sm dark:bg-white/15 dark:text-white"
                      : "text-[#6b7280] hover:text-[#0b0e13] dark:text-[#9aa4b5] dark:hover:text-white"
                  }`}
                >
                  <FiSearch className="h-2.5 w-2.5" />
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("liked")}
                  data-cursor-hover
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium transition-all ${
                    activeTab === "liked"
                      ? "bg-white text-red-600 shadow-sm dark:bg-white/15 dark:text-red-400"
                      : "text-[#6b7280] hover:text-red-500 dark:text-[#9aa4b5]"
                  }`}
                >
                  <FiHeart className="h-2.5 w-2.5" />
                  ({likedSongs.length})
                </button>
              </div>

              {/* Loop Song Active Badge */}
              <button
                type="button"
                onClick={() => setIsLoop(!isLoop)}
                data-cursor-hover
                className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                  isLoop
                    ? "bg-[#8a0303] text-white dark:bg-[#f2a93b] dark:text-[#0b0e13]"
                    : "text-[#6b7280] hover:text-[#0b0e13] dark:text-[#9aa4b5] dark:hover:text-white"
                }`}
                aria-label={isLoop ? "Loop enabled" : "Loop disabled"}
                title={isLoop ? "Looping current song" : "Enable loop"}
              >
                <FiRepeat className="h-3.5 w-3.5" />
                {isLoop && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* ── TAB 1: PLAYER VIEW ── */}
            {activeTab === "player" && (
              <div className="relative z-10 flex flex-col items-center">
                {/* Circular Vinyl & Progress Ring */}
                <div className="relative my-3 flex h-44 w-44 items-center justify-center">
                  <svg className="absolute inset-0 h-full w-full -rotate-90">
                    <circle
                      cx="88"
                      cy="88"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="3.5"
                      fill="transparent"
                      className="text-gray-200 dark:text-white/10"
                    />
                    <circle
                      cx="88"
                      cy="88"
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

                  {/* Spinning Vinyl Disk */}
                  <div
                    className={`relative h-28 w-28 overflow-hidden rounded-full border-2 border-white/50 shadow-xl ${
                      isPlaying ? "animate-spin" : ""
                    }`}
                    style={{ animationDuration: "12s" }}
                  >
                    <img
                      src={currentSong.albumArt}
                      alt={currentSong.title}
                      className="h-full w-full object-cover select-none"
                    />
                    <div className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-black/80" />
                  </div>
                </div>

                {/* Scrubber Range Slider (Interactive Seeking) */}
                <div className="w-full px-3">
                  <input
                    type="range"
                    min={0}
                    max={duration || 30}
                    step={0.5}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full accent-[#8a0303] dark:accent-[#f2a93b] cursor-pointer"
                  />
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#6b7280] dark:text-[#9aa4b5]">
                    <span>{formatTime(currentTime)}</span>
                    {audioError ? (
                      <span className="text-amber-500 font-semibold">{audioError}</span>
                    ) : (
                      <span>{formatTime(duration)}</span>
                    )}
                  </div>
                </div>

                {/* Track Details */}
                <div className="my-3 text-center w-full px-2">
                  <h3 className="truncate font-sans text-base font-bold text-[#0b0e13] dark:text-white">
                    {currentSong.title}
                  </h3>
                  <p className="truncate font-sans text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                    {currentSong.artist}
                  </p>
                </div>

                {/* ── Functional Controls Row ── */}
                <div className="flex w-full items-center justify-between px-3 mt-1">
                  {/* Like / Favorite Button */}
                  <button
                    type="button"
                    onClick={toggleLike}
                    data-cursor-hover
                    className={`p-2 transition-transform hover:scale-125 ${
                      isCurrentLiked ? "text-red-500 fill-current" : "text-[#9ca3af] hover:text-red-500"
                    }`}
                    aria-label={isCurrentLiked ? "Unlike song" : "Like song"}
                    title={isCurrentLiked ? "Liked" : "Add to Liked Songs"}
                  >
                    <FiHeart className={`h-4 w-4 ${isCurrentLiked ? "fill-red-500" : ""}`} />
                  </button>

                  {/* Previous Track */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    data-cursor-hover
                    className="p-2 text-[#374151] transition-transform hover:scale-110 hover:text-[#0b0e13] dark:text-[#d1d5db] dark:hover:text-white"
                    aria-label="Previous track"
                  >
                    <FiSkipBack className="h-5 w-5" />
                  </button>

                  {/* Play / Pause Main Button */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    data-cursor-hover
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b0e13] text-white shadow-xl transition-all duration-200 hover:scale-105 hover:bg-[#8a0303] dark:bg-white dark:text-[#0b0e13] dark:hover:bg-[#f2a93b]"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <FiPause className="h-5 w-5" /> : <FiPlay className="ml-0.5 h-5 w-5" />}
                  </button>

                  {/* Next Track */}
                  <button
                    type="button"
                    onClick={handleNext}
                    data-cursor-hover
                    className="p-2 text-[#374151] transition-transform hover:scale-110 hover:text-[#0b0e13] dark:text-[#d1d5db] dark:hover:text-white"
                    aria-label="Next track"
                  >
                    <FiSkipForward className="h-5 w-5" />
                  </button>

                  {/* Loop Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsLoop(!isLoop)}
                    data-cursor-hover
                    className={`p-2 transition-colors ${
                      isLoop
                        ? "text-[#8a0303] dark:text-[#f2a93b]"
                        : "text-[#9ca3af] hover:text-[#0b0e13] dark:text-white/40 dark:hover:text-white"
                    }`}
                    aria-label="Toggle loop"
                    title={isLoop ? "Loop active" : "Enable loop"}
                  >
                    <FiRepeat className="h-4 w-4" />
                  </button>
                </div>

                {/* Volume & Equalizer footer */}
                <div className="mt-4 flex w-full items-center justify-between border-t border-gray-200/80 pt-3 dark:border-white/[0.08]">
                  <div className="flex items-end gap-1 h-3">
                    {[40, 85, 55, 95, 60].map((h, i) => (
                      <span
                        key={i}
                        className={`w-0.5 rounded-full bg-[#8a0303] dark:bg-[#f2a93b] ${
                          isPlaying ? "animate-pulse" : "opacity-30"
                        }`}
                        style={{
                          height: isPlaying ? `${h}%` : "30%",
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                    <span className="ml-2 font-mono text-[9px] uppercase tracking-wider text-[#6b7280] dark:text-[#9aa4b5]">
                      {isLoop ? "Loop On" : isPlaying ? "Live" : "Paused"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    data-cursor-hover
                    className="text-[#6b7280] hover:text-[#0b0e13] dark:text-[#9aa4b5] dark:hover:text-white"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <FiVolumeX className="h-3.5 w-3.5 text-red-500" /> : <FiVolume2 className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 2: SEARCH & SUGGESTIONS VIEW ── */}
            {activeTab === "search" && (
              <div className="relative z-10 flex flex-col pt-1">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
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

                {/* Suggested Chips */}
                <div className="mt-3">
                  <div className="mb-1.5 flex items-center gap-1 font-mono text-[10px] text-[#6b7280] dark:text-[#9aa4b5]">
                    <FiStar className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                    <span>SUGGESTED FOR YOU</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_GENRES.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => performSearch(tag)}
                        data-cursor-hover
                        className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 font-mono text-[10px] text-[#4b5563] transition-colors hover:border-[#8a0303] hover:text-[#8a0303] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9aa4b5] dark:hover:border-[#f2a93b] dark:hover:text-[#f2a93b]"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Search History */}
                {recentSearches.length > 0 && (
                  <div className="mt-3">
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] text-[#6b7280] dark:text-[#9aa4b5]">
                      <div className="flex items-center gap-1">
                        <FiClock className="h-2.5 w-2.5" />
                        <span>RECENT SEARCHES</span>
                      </div>
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className="text-[9px] hover:text-red-500"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((rec) => (
                        <button
                          key={rec}
                          type="button"
                          onClick={() => performSearch(rec)}
                          data-cursor-hover
                          className="rounded-md border border-gray-200 bg-white px-2 py-0.5 font-mono text-[10px] text-[#0b0e13] hover:border-[#8a0303] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:border-[#f2a93b]"
                        >
                          {rec}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search Results List */}
                <div className="mt-3 max-h-52 overflow-y-auto space-y-1.5 no-scrollbar">
                  {searchResults.map((song) => (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => selectSong(song)}
                      data-cursor-hover
                      className="flex w-full items-center gap-2.5 rounded-xl border border-transparent p-1.5 text-left transition-colors hover:border-gray-200 hover:bg-gray-100 dark:hover:border-white/10 dark:hover:bg-white/[0.05]"
                    >
                      <img
                        src={song.albumArt}
                        alt={song.title}
                        className="h-8 w-8 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-sans text-xs font-semibold text-[#0b0e13] dark:text-white">
                          {song.title}
                        </p>
                        <p className="truncate font-sans text-[10px] text-[#6b7280] dark:text-[#9aa4b5]">
                          {song.artist}
                        </p>
                      </div>
                      <FiPlay className="h-3.5 w-3.5 text-[#8a0303] dark:text-[#f2a93b]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 3: LIKED SONGS VIEW ── */}
            {activeTab === "liked" && (
              <div className="relative z-10 flex flex-col pt-1">
                <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-[#6b7280] dark:text-[#9aa4b5]">
                  <span className="flex items-center gap-1 font-bold text-red-500">
                    <FiHeart className="h-3 w-3 fill-current" /> Liked Songs ({likedSongs.length})
                  </span>
                </div>

                {likedSongs.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                    <FiHeart className="mx-auto mb-2 h-6 w-6 text-gray-300 dark:text-white/20" />
                    <p>No liked songs yet.</p>
                    <p className="mt-1 text-[10px]">Tap the heart icon ♥ while playing any track to save it here!</p>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-1.5 no-scrollbar">
                    {likedSongs.map((song) => (
                      <button
                        key={song.id}
                        type="button"
                        onClick={() => selectSong(song)}
                        data-cursor-hover
                        className="flex w-full items-center gap-2.5 rounded-xl border border-transparent p-1.5 text-left transition-colors hover:border-gray-200 hover:bg-gray-100 dark:hover:border-white/10 dark:hover:bg-white/[0.05]"
                      >
                        <img
                          src={song.albumArt}
                          alt={song.title}
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-sans text-xs font-semibold text-[#0b0e13] dark:text-white">
                            {song.title}
                          </p>
                          <p className="truncate font-sans text-[10px] text-[#6b7280] dark:text-[#9aa4b5]">
                            {song.artist}
                          </p>
                        </div>
                        <FiPlay className="h-3.5 w-3.5 text-red-500" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

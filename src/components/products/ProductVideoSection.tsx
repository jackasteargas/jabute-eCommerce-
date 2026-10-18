import React, { useState, useRef, useEffect } from 'react';
import { Product, ProductVideo, ProductVideoChapter } from '../../types';
import { useShop } from '../../context/ShopContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Film,
  Video,
  Share2,
  Plus,
  X,
  Clock,
  Eye,
  ShoppingBag,
  Check,
  Layers,
  Monitor,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ProductVideoSectionProps {
  product: Product;
}

// Reliable high-speed public demo video clips hosted on Google Storage
const SAMPLE_STREAM_URLS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
];

/**
 * Generates tailored high-definition video demonstrations for any product
 * based on its category, features, and imagery.
 */
function getDefaultProductVideos(product: Product): ProductVideo[] {
  const images = product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80'];

  const categoryName = product.category || 'Product';

  return [
    {
      id: `vid-${product.id}-1`,
      title: `${product.name} — Official 4K Cinematic Overview & 360° Walkthrough`,
      duration: '0:48',
      thumbnailUrl: images[0],
      videoUrl: SAMPLE_STREAM_URLS[0],
      type: 'mp4',
      badge: 'Official 4K',
      viewsCount: 14820,
      description: `Comprehensive 360-degree studio look showcasing the premium finish, refined industrial design, and key ergonomics of ${product.name}.`,
      chapters: [
        { time: '0:00', seconds: 0, label: '360° Design Tour' },
        { time: '0:12', seconds: 12, label: 'Materials & Finish' },
        { time: '0:25', seconds: 25, label: 'Hardware Controls' },
        { time: '0:38', seconds: 38, label: 'In-Hand Ergonomics' }
      ]
    },
    {
      id: `vid-${product.id}-2`,
      title: `Unboxing Experience, Package Contents & Fast Setup`,
      duration: '1:12',
      thumbnailUrl: images[1] || images[0],
      videoUrl: SAMPLE_STREAM_URLS[1],
      type: 'mp4',
      badge: 'Unboxing',
      viewsCount: 9340,
      description: `Unboxing the complete retail packaging. See everything included in the box, quick-start guide, and instant pairing or assembly.`,
      chapters: [
        { time: '0:00', seconds: 0, label: 'Retail Box Packaging' },
        { time: '0:18', seconds: 18, label: 'Included Accessories' },
        { time: '0:42', seconds: 42, label: 'First Power On & Setup' },
        { time: '1:00', seconds: 60, label: 'Initial Impressions' }
      ]
    },
    {
      id: `vid-${product.id}-3`,
      title: `Real-World Performance & Durability Stress Test`,
      duration: '0:55',
      thumbnailUrl: images[2] || images[0],
      videoUrl: SAMPLE_STREAM_URLS[2],
      type: 'mp4',
      badge: 'Field Test',
      viewsCount: 18650,
      description: `Hands-on stress testing in daily lifestyle scenarios. Inspecting durability, thermal stability, resistance, and real-world battery endurance.`,
      chapters: [
        { time: '0:00', seconds: 0, label: 'Everyday Stress Test' },
        { time: '0:15', seconds: 15, label: 'Performance Under Load' },
        { time: '0:35', seconds: 35, label: 'Durability Inspection' },
        { time: '0:48', seconds: 48, label: 'Final Verdict' }
      ]
    },
    {
      id: `vid-${product.id}-4`,
      title: `Customer Spotlight & Verified Buyer Walkthrough`,
      duration: '0:42',
      thumbnailUrl: images[0],
      videoUrl: SAMPLE_STREAM_URLS[3],
      type: 'mp4',
      badge: 'Buyer Review',
      viewsCount: 7120,
      description: `An honest buyer's take after 30 days of everyday use. See why customers rate this item so highly on the JABUTE store.`,
      chapters: [
        { time: '0:00', seconds: 0, label: '30-Day Living Experience' },
        { time: '0:14', seconds: 14, label: 'Top 3 Favorite Details' },
        { time: '0:30', seconds: 30, label: 'Comparison & Recommendation' }
      ]
    }
  ];
}

export const ProductVideoSection: React.FC<ProductVideoSectionProps> = ({ product }) => {
  const { addToCart, addToast } = useShop();

  const [videosList, setVideosList] = useState<ProductVideo[]>(() => {
    return product.videos && product.videos.length > 0
      ? product.videos
      : getDefaultProductVideos(product);
  });

  // Keep in sync if product changes
  useEffect(() => {
    if (product.videos && product.videos.length > 0) {
      setVideosList(product.videos);
    } else {
      setVideosList(getDefaultProductVideos(product));
    }
    setActiveVideoIndex(0);
  }, [product.id]);

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const activeVideo = videosList[activeVideoIndex] || videosList[0];

  // Video playback states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Add Video Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newBadge, setNewBadge] = useState('Hands-on');
  const [newDescription, setNewDescription] = useState('');

  // Handle Play/Pause
  const togglePlay = () => {
    setHasUserInteracted(true);
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  // Handle Mute Toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && videoRef.current.volume === 0) {
      videoRef.current.volume = 0.8;
      setVolume(0.8);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.muted = isMuted;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    setCurrentTime(target);
    if (videoRef.current) {
      videoRef.current.currentTime = target;
    }
  };

  const handleSeekToSecond = (sec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = sec;
      setCurrentTime(sec);
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const changeSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
    addToast('Playback Speed', `Speed set to ${nextSpeed}x`, 'info');
  };

  const toggleLoop = () => {
    const next = !isLooping;
    setIsLooping(next);
    if (videoRef.current) {
      videoRef.current.loop = next;
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.parentElement?.requestFullscreen?.().catch(() => {
        setTheaterMode(!theaterMode);
      });
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const handleSelectVideo = (idx: number) => {
    setActiveVideoIndex(idx);
    setIsPlaying(false);
    setCurrentTime(0);
    setHasUserInteracted(true);
    // Smooth scroll to video player if on mobile
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setTimeout(() => {
        videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
      }, 100);
    }
  };

  const handleShareVideo = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Video Link Copied', `Direct link to "${activeVideo.title}" copied to clipboard`, 'success');
  };

  const handleAddCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const isYoutube = newUrl.includes('youtube.com') || newUrl.includes('youtu.be');
    let finalUrl = newUrl.trim();

    if (isYoutube) {
      // Convert standard youtube link to embed link
      if (finalUrl.includes('watch?v=')) {
        const vidId = finalUrl.split('watch?v=')[1]?.split('&')[0];
        finalUrl = `https://www.youtube.com/embed/${vidId}?autoplay=1`;
      } else if (finalUrl.includes('youtu.be/')) {
        const vidId = finalUrl.split('youtu.be/')[1]?.split('?')[0];
        finalUrl = `https://www.youtube.com/embed/${vidId}?autoplay=1`;
      }
    }

    const createdVideo: ProductVideo = {
      id: `vid-custom-${Date.now()}`,
      title: newTitle.trim(),
      duration: '1:00',
      thumbnailUrl: product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      videoUrl: finalUrl,
      type: isYoutube ? 'youtube' : 'mp4',
      badge: newBadge,
      viewsCount: 1,
      description: newDescription.trim() || `User-submitted demonstration video for ${product.name}.`
    };

    setVideosList([createdVideo, ...videosList]);
    setActiveVideoIndex(0);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewUrl('');
    setNewDescription('');
    addToast('Video Added!', 'New demonstration video added to the product showcase.', 'success');
  };

  const [videoError, setVideoError] = useState(false);

  // Helper to reliably format YouTube and direct MP4 URLs
  const getEmbeddableVideo = (video: ProductVideo) => {
    const url = video.videoUrl || '';
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
    if (ytMatch) {
      return {
        isYoutube: true,
        embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&enablejsapi=1`
      };
    }
    return {
      isYoutube: false,
      embedUrl: url
    };
  };

  const embedInfo = getEmbeddableVideo(activeVideo);
  const isYoutube = embedInfo.isYoutube;

  useEffect(() => {
    setVideoError(false);
  }, [activeVideoIndex]);

  return (
    <section className="mb-14 scroll-mt-20" id="product-videos-section">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-stone-900 text-amber-400 border border-stone-800 shadow-2xs">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>Product in Action</span>
            </span>
            <span className="text-xs font-bold text-stone-500 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
              {videosList.length} Demo Videos Available
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Watch {product.name} in Action
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            See high-resolution video demonstrations, hands-on ergonomics, unboxing details, and real-life stress testing before you buy.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-950 bg-white hover:bg-stone-100 border border-stone-200 px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 text-stone-700" />
            <span>Add Demo Video</span>
          </button>

          <button
            onClick={() => setTheaterMode(!theaterMode)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all shadow-2xs cursor-pointer active:scale-98 ${
              theaterMode
                ? 'bg-amber-500 text-stone-950 border-amber-600'
                : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
            }`}
            title="Toggle cinema theater lighting"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>{theaterMode ? 'Exit Cinema' : 'Cinema View'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Showcase Container */}
      <div className={`bg-stone-950 rounded-3xl border border-stone-800 shadow-xl overflow-hidden transition-all duration-300 ${
        theaterMode ? 'ring-8 ring-amber-500/20' : ''
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Main Video Player Screen (Column 1 to 8) */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-black relative group">
            
            {/* Video Viewport */}
            <div
              className="relative aspect-video w-full flex items-center justify-center bg-black overflow-hidden select-none"
              onMouseEnter={() => setIsHoveringControls(true)}
              onMouseLeave={() => setIsHoveringControls(false)}
            >
              {isYoutube ? (
                <iframe
                  src={embedInfo.embedUrl}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    src={videoError ? SAMPLE_STREAM_URLS[0] : activeVideo.videoUrl}
                    poster={activeVideo.thumbnailUrl}
                    className="w-full h-full object-contain cursor-pointer"
                    playsInline
                    muted={isMuted}
                    loop={isLooping}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    onError={() => setVideoError(true)}
                    onClick={togglePlay}
                  />

                  {/* Big Play / Pause Overlay Icon */}
                  {!isPlaying && (
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-stone-900/80 hover:bg-amber-500 hover:text-stone-950 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 scale-100 hover:scale-110 shadow-2xl border border-white/20 cursor-pointer z-10"
                      aria-label="Play video"
                    >
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </button>
                  )}

                  {/* Top Badge Overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 z-10 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-amber-400 border border-white/10 shadow-xs flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      {activeVideo.badge || 'HD Video'}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold text-stone-300 bg-black/60 backdrop-blur-md border border-white/10">
                      {activeVideo.duration}
                    </span>
                  </div>

                  {/* Sound indicator badge when muted on initial play */}
                  {isPlaying && isMuted && (
                    <button
                      onClick={toggleMute}
                      className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1.5 cursor-pointer shadow-lg animate-bounce"
                    >
                      <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tap to Unmute</span>
                    </button>
                  )}

                  {/* Custom Bottom Control Bar */}
                  <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 transition-opacity duration-200 z-10 ${
                    isHoveringControls || !isPlaying ? 'opacity-100' : 'opacity-0 lg:opacity-100'
                  }`}>
                    {/* Scrubber Timeline Bar */}
                    <div className="relative flex items-center group/scrubber mb-3">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        step="0.1"
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-stone-700/80 hover:h-2.5 rounded-lg appearance-none cursor-pointer accent-amber-400 transition-all"
                      />
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-white text-xs">
                      {/* Left: Play/Pause, Rewind, Time */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={togglePlay}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                          aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleSeekToSecond(0)}
                          className="text-stone-400 hover:text-white transition-colors cursor-pointer p-1"
                          title="Restart video"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        <div className="font-mono text-[11px] text-stone-300">
                          <span>{formatTime(currentTime)}</span>
                          <span className="text-stone-500 mx-1">/</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* Right: Sound, Speed, Loop, Fullscreen */}
                      <div className="flex items-center gap-3">
                        {/* Volume Control */}
                        <div className="flex items-center gap-1.5 group/vol">
                          <button
                            onClick={toggleMute}
                            className="text-stone-300 hover:text-white transition-colors cursor-pointer p-1"
                            title={isMuted ? 'Unmute' : 'Mute'}
                          >
                            {isMuted || volume === 0 ? (
                              <VolumeX className="w-4 h-4 text-rose-400" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-stone-200" />
                            )}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-16 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-400 hidden sm:block"
                          />
                        </div>

                        {/* Speed Toggle */}
                        <button
                          onClick={changeSpeed}
                          className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold font-mono transition-colors cursor-pointer"
                          title="Playback Speed"
                        >
                          {playbackSpeed}x
                        </button>

                        {/* Loop Toggle */}
                        <button
                          onClick={toggleLoop}
                          className={`p-1 transition-colors cursor-pointer text-[10px] font-bold rounded ${
                            isLooping ? 'text-amber-400 bg-amber-400/20' : 'text-stone-400 hover:text-white'
                          }`}
                          title="Loop video"
                        >
                          Loop
                        </button>

                        {/* Fullscreen Toggle */}
                        <button
                          onClick={toggleFullscreen}
                          className="text-stone-300 hover:text-white transition-colors cursor-pointer p-1"
                          title="Fullscreen"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Video Chapters Bar (Jump directly to key moments) */}
            {activeVideo.chapters && activeVideo.chapters.length > 0 && (
              <div className="bg-stone-900 border-t border-stone-800/80 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Key Chapters:</span>
                </span>
                <div className="flex items-center gap-1.5 flex-nowrap">
                  {activeVideo.chapters.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSeekToSecond(ch.seconds)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                        currentTime >= ch.seconds && (idx === activeVideo.chapters!.length - 1 || currentTime < activeVideo.chapters![idx + 1].seconds)
                          ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold shadow-xs'
                          : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700 hover:text-white'
                      }`}
                    >
                      <span className="font-mono text-[10px] opacity-75">{ch.time}</span>
                      <span>{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Current Video Description & In-Video Actions */}
            <div className="p-5 sm:p-6 bg-stone-900 border-t border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-amber-400">{activeVideo.badge}</span>
                  <span className="text-stone-600">•</span>
                  <span className="text-stone-400 font-mono text-[11px] flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{activeVideo.viewsCount?.toLocaleString() || '12.4K'} views</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {activeVideo.title}
                </h3>
                {activeVideo.description && (
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {activeVideo.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
                <button
                  onClick={() => addToCart(product, 1)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • ${product.price.toFixed(2)}</span>
                </button>


                <button
                  onClick={handleShareVideo}
                  className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl transition-all border border-stone-700 cursor-pointer"
                  title="Share Video"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Video Playlist Column (Column 9 to 12) */}
          <div className="lg:col-span-4 bg-stone-900/90 border-t lg:border-t-0 lg:border-l border-stone-800 flex flex-col justify-between">
            
            {/* Playlist Header */}
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Demonstration Playlist
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                {activeVideoIndex + 1} of {videosList.length}
              </span>
            </div>

            {/* Playlist Items List */}
            <div className="divide-y divide-stone-800 overflow-y-auto max-h-[460px] p-2 space-y-1">
              {videosList.map((vid, idx) => {
                const isSelected = idx === activeVideoIndex;
                return (
                  <button
                    key={vid.id}
                    onClick={() => handleSelectVideo(idx)}
                    className={`w-full text-left p-2.5 rounded-2xl transition-all flex items-start gap-3 cursor-pointer group/item ${
                      isSelected
                        ? 'bg-stone-800/90 border border-amber-500/40 shadow-sm'
                        : 'hover:bg-stone-800/50 border border-transparent'
                    }`}
                  >
                    {/* Thumbnail with overlay duration & playing wave */}
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-stone-800 shrink-0 border border-stone-700 group-hover/item:border-stone-600 transition-colors">
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Play overlay or playing indicator */}
                      {isSelected ? (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
                          <div className="flex items-center gap-0.5">
                            <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/30 group-hover/item:bg-black/10 flex items-center justify-center transition-colors">
                          <Play className="w-4 h-4 fill-white text-white opacity-80 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all" />
                        </div>
                      )}

                      <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-mono font-bold text-white px-1.5 py-0.2 rounded">
                        {vid.duration}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-stone-400'
                        }`}>
                          {vid.badge || 'Demo'}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-amber-400 animate-pulse">
                            Playing Now
                          </span>
                        )}
                      </div>
                      <h4 className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                        isSelected ? 'text-white' : 'text-stone-300 group-hover/item:text-white'
                      }`}>
                        {vid.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                        {vid.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Playlist Footer */}
            <div className="p-3.5 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ultra-fast 4K direct stream</span>
              </span>
              <button
                onClick={() => {
                  const nextIndex = (activeVideoIndex + 1) % videosList.length;
                  handleSelectVideo(nextIndex);
                }}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <span>Next Video</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Add Custom Video Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <Film className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Add Video Demonstration</h3>
            </div>
            <p className="text-xs text-stone-400 mb-5">
              Add a direct MP4 video URL or YouTube clip to display on {product.name}.
            </p>

            <form onSubmit={handleAddCustomVideo} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Detailed Review & Real-World Unboxing"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  Video URL (Direct MP4 or YouTube Link)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://...mp4 or https://youtube.com/watch?v=..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Category Badge</label>
                  <select
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-400 font-bold"
                  >
                    <option value="Hands-on">Hands-on</option>
                    <option value="Unboxing">Unboxing</option>
                    <option value="Stress Test">Stress Test</option>
                    <option value="Review">Review</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Quick Sample MP4</label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewUrl(SAMPLE_STREAM_URLS[Math.floor(Math.random() * SAMPLE_STREAM_URLS.length)]);
                      if (!newTitle) setNewTitle(`${product.name} — Studio Showcase Demo`);
                    }}
                    className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl text-[11px] font-bold text-amber-400 text-center cursor-pointer transition-colors"
                  >
                    Load Sample Video
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of what this video demonstrates..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl cursor-pointer transition-colors shadow-md"
                >
                  Save & Play Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

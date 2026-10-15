import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Sparkles,
  Zap,
  Flame,
  Timer,
  Check,
  Copy,
  ArrowRight,
  Gift,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ShieldCheck,
  Truck,
  Star,
  Award,
  X,
  ChevronRight,
  Headphones,
  Film,
  BadgePercent,
  MessageSquare,
  Sparkle
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* 1. PANORAMIC AD: FLASH SALE COUNTDOWN (Spans full width)                   */
/* -------------------------------------------------------------------------- */
export const FlashSalePanoramicAd: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  const { applyPromoCode, addToast, setSelectedCategory } = useShop();
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 15 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleApply = () => {
    const res = applyPromoCode('FLASH25');
    if (res.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleCopyOnly = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText('FLASH25');
    addToast('Code FLASH25 Copied', '25% discount on orders over $120', 'success');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="col-span-full my-2 sm:my-3 rounded-2xl sm:rounded-3xl overflow-hidden relative bg-stone-950 text-white border border-amber-500/30 shadow-xl transition-all">
      {/* Background glow and subtle graphic */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Dismiss Tag */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest font-black text-stone-500 bg-stone-900/80 px-2 py-0.5 rounded-full border border-stone-800">
          Sponsored Drop
        </span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss ad"
            className="w-6 h-6 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="relative z-10 p-5 sm:p-7 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left column: High-energy copy & countdown */}
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Flash Allocation Event</span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
            Take <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">25% Off</span> Everything Over $120
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Limited mid-season allocation across studio acoustic drivers, mechanical desk pieces, and ceramic stoneware. Direct checkout deduction with live priority air express dispatch.
          </p>

          {/* Real-Time Live Countdown */}
          <div className="pt-1 flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>Ends in:</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
              <div className="bg-stone-900/90 border border-stone-800 px-2 py-1 rounded-lg text-amber-300 min-w-8 text-center shadow-inner">
                {String(timeLeft.hours).padStart(2, '0')}h
              </div>
              <span className="text-amber-500 font-bold">:</span>
              <div className="bg-stone-900/90 border border-stone-800 px-2 py-1 rounded-lg text-amber-300 min-w-8 text-center shadow-inner">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </div>
              <span className="text-amber-500 font-bold">:</span>
              <div className="bg-stone-900/90 border border-stone-800 px-2 py-1 rounded-lg text-rose-400 min-w-8 text-center shadow-inner">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Action Box */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 bg-stone-900/70 p-4 sm:p-5 rounded-2xl border border-stone-800 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 bg-stone-950/80 px-4 py-2.5 rounded-xl border border-dashed border-amber-500/40">
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Use Voucher Code</div>
              <div className="text-base font-black tracking-widest text-amber-300 font-mono">FLASH25</div>
            </div>
            <button
              onClick={handleCopyOnly}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              title="Copy Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleApply}
              className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-stone-950" />
                  <span>25% Applied to Cart!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-stone-950" />
                  <span>Claim & Apply 25% Off</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Includes Complimentary Carbon-Neutral Air Freight</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. IN-GRID AD CARD: SPATIAL AUDIO & SOUND DEMO (Takes 1 grid cell)         */
/* -------------------------------------------------------------------------- */
export const SpatialAudioInGridAd: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  const { setSelectedCategory, addToast } = useShop();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeEq, setActiveEq] = useState<'neutral' | 'bass' | 'spatial'>('spatial');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const toggleSound = () => {
    try {
      if (isPlaying) {
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
          oscillatorRef.current = null;
        }
        setIsPlaying(false);
      } else {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          setIsPlaying(true);
          return;
        }
        const ctx = audioCtxRef.current || new AudioContextClass();
        audioCtxRef.current = ctx;

        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Create harmonic ambient chime chord
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const baseFreq = activeEq === 'bass' ? 120 : activeEq === 'spatial' ? 528 : 440;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

        // Harmonic shimmer
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscillatorRef.current = osc;

        setIsPlaying(true);
        addToast('Spatial Acoustic Preview', `Playing ${activeEq.toUpperCase()} acoustic chamber profile`, 'info');

        setTimeout(() => {
          setIsPlaying(false);
        }, 3200);
      }
    } catch {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="col-span-1 rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white border border-stone-800 shadow-lg flex flex-col justify-between relative overflow-hidden group">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <Headphones className="w-3 h-3" />
            <span>Interactive Ad</span>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-stone-500 hover:text-stone-300 p-1 rounded-md transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <h4 className="text-base sm:text-lg font-black tracking-tight text-white mb-1 leading-snug">
          Experience 360° Titanium Acoustic Audio
        </h4>
        <p className="text-xs text-stone-400 mb-4 line-clamp-2 leading-relaxed">
          Tested by recording engineers. Dynamic beryllium drivers tuned for zero harmonic distortion.
        </p>

        {/* Interactive Equalizer Bars */}
        <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800/80 mb-4">
          <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 mb-2">
            <span>Acoustic Frequency</span>
            <span className="text-amber-400 uppercase font-mono">{activeEq}</span>
          </div>

          <div className="flex items-end justify-between gap-1 h-10 px-2 bg-stone-900/60 rounded-lg py-1 border border-stone-800">
            {[45, 80, 60, 95, 30, 75, 100, 85, 50, 70, 90, 40].map((height, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-stone-700'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(20, (height * (i % 2 === 0 ? 1 : 0.7)))}%` : '20%',
                  animationDelay: `${i * 70}ms`
                }}
              />
            ))}
          </div>

          {/* Sound Profile Selectors */}
          <div className="grid grid-cols-3 gap-1.5 mt-2.5">
            {(['neutral', 'bass', 'spatial'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveEq(mode)}
                className={`py-1 text-[10px] font-bold rounded capitalize transition-all cursor-pointer ${
                  activeEq === mode
                    ? 'bg-amber-400 text-stone-950 font-black'
                    : 'bg-stone-900 text-stone-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={toggleSound}
          className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-stone-700/60"
        >
          {isPlaying ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isPlaying ? 'Stop Sound Demo' : 'Play Acoustic Tone'}</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategory('electronics');
            const el = document.getElementById('jabute-catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>Shop Sound Gear</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. IN-GRID AD CARD: MYSTERY LUCKY SCRATCHER (Takes 1 grid cell)            */
/* -------------------------------------------------------------------------- */
export const MysteryRewardInGridAd: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  const { applyPromoCode, addToast } = useShop();
  const [revealed, setRevealed] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleReveal = () => {
    setRevealed(true);
    addToast('Secret Voucher Unlocked!', 'Use code SECRET15 for 15% off', 'success');
  };

  const handleApply = () => {
    const res = applyPromoCode('SECRET15');
    if (res.success) {
      setApplied(true);
    }
  };

  return (
    <div className="col-span-1 rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-emerald-950 via-stone-900 to-amber-950 text-white border border-emerald-500/30 shadow-lg flex flex-col justify-between relative overflow-hidden">
      {/* Ambient background particles */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            <Gift className="w-3 h-3 text-emerald-400" />
            <span>Mystery Feed Perk</span>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-stone-500 hover:text-stone-300 p-1 rounded-md transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <h4 className="text-base sm:text-lg font-black tracking-tight text-white mb-1 leading-snug">
          Secret Scroll Reward
        </h4>
        <p className="text-xs text-stone-300 mb-4 leading-relaxed">
          Thanks for exploring our catalog! Tap below to unlock a surprise direct store discount voucher.
        </p>

        {/* Scratch Card / Mystery Box Area */}
        <div className="relative rounded-xl border border-dashed border-emerald-400/50 p-4 text-center bg-stone-950/70 backdrop-blur-xs mb-4">
          {!revealed ? (
            <button
              onClick={handleReveal}
              className="w-full py-4 flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-amber-400 text-stone-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <span className="text-xs font-black text-emerald-300 uppercase tracking-wider group-hover:text-emerald-200">
                Tap to Reveal Gift
              </span>
            </button>
          ) : (
            <div className="space-y-1.5 animate-fadeIn">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                Congratulations!
              </div>
              <div className="text-2xl font-black text-amber-300 font-mono tracking-widest">
                SECRET15
              </div>
              <div className="text-xs text-stone-300 font-semibold">
                15% Off Your Entire Cart
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        {revealed ? (
          <button
            onClick={handleApply}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-400 to-amber-400 hover:from-emerald-300 hover:to-amber-300 text-stone-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {applied ? (
              <>
                <Check className="w-4 h-4 text-stone-950" />
                <span>15% Discount Active!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-stone-950" />
                <span>Apply 15% to My Bag</span>
              </>
            )}
          </button>
        ) : (
          <div className="text-center text-[11px] text-stone-400 font-medium">
            🔒 1 instant mystery voucher per customer session
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. PANORAMIC AD: JABUTE PRIVÉ VIP MEMBERSHIP (Spans full width)            */
/* -------------------------------------------------------------------------- */
export const VipPrivePanoramicAd: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  const { applyPromoCode, addToast } = useShop();
  const [activated, setActivated] = useState(false);

  const handleActivateFreeShipping = () => {
    const res = applyPromoCode('FREESHIP');
    if (res.success) {
      setActivated(true);
      addToast('VIP Air Express Activated', 'Free expedited shipping unlocked on your order', 'success');
    }
  };

  return (
    <div className="col-span-2 md:col-span-3 my-2 sm:my-3 rounded-2xl sm:rounded-3xl overflow-hidden relative bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white border border-stone-800 shadow-xl">
      {/* Background imagery texture */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
        <img
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80"
          alt="VIP Lounge"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dismiss Tag */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest font-black text-stone-400 bg-stone-900/90 px-2 py-0.5 rounded-full border border-stone-800">
          Privé Membership
        </span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss ad"
            className="w-6 h-6 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="relative z-10 p-5 sm:p-7 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-black uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Exclusive Concierge Privileges</span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
            Complimentary Air Express & 2-Year Replacement Warranty
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Every JABUTE order qualifies for direct priority fulfillment. Enjoy direct concierge dispatch, carbon-neutral tracking, and hassle-free returns.
          </p>

          {/* 3 Perks badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="flex items-center gap-2 bg-stone-900/80 border border-stone-800 px-3 py-2 rounded-xl text-xs">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-stone-300 font-semibold text-[11px]">Next-Day Air Dispatch</span>
            </div>
            <div className="flex items-center gap-2 bg-stone-900/80 border border-stone-800 px-3 py-2 rounded-xl text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-stone-300 font-semibold text-[11px]">2-Yr Accidental Care</span>
            </div>
            <div className="flex items-center gap-2 bg-stone-900/80 border border-stone-800 px-3 py-2 rounded-xl text-xs">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="text-stone-300 font-semibold text-[11px]">Secret Member Drops</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 bg-stone-900/80 p-4 sm:p-5 rounded-2xl border border-stone-800 backdrop-blur-md">
          <button
            onClick={handleActivateFreeShipping}
            className="w-full px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            {activated ? (
              <>
                <Check className="w-4 h-4" />
                <span>Express Shipping Active!</span>
              </>
            ) : (
              <>
                <Truck className="w-4 h-4" />
                <span>Unlock Free Air Express</span>
              </>
            )}
          </button>


          <span className="text-[11px] text-center text-stone-400 pt-1">
            48,200+ members worldwide • Instant activation
          </span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. IN-GRID AD CARD: COMMUNITY SPOTLIGHT (Takes 1 grid cell)                 */
/* -------------------------------------------------------------------------- */
export const CommunitySpotlightInGridAd: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  const quotes = [
    {
      author: 'Julian M.',
      role: 'Industrial Designer, NY',
      text: 'The precision finish on the aluminum stand is unrivaled. Worth every dollar.',
      rating: 5,
    },
    {
      author: 'Elena R.',
      role: 'Architect, London',
      text: 'Fastest shipping I have ever experienced. Unboxing felt like opening a piece of modern art.',
      rating: 5,
    },
    {
      author: 'Kenji T.',
      role: 'Audio Producer, Tokyo',
      text: 'The acoustic driver clarity blew away my studio monitors. Absolute perfection.',
      rating: 5,
    },
  ];

  const current = quotes[activeQuoteIdx];

  const handleNext = () => {
    setActiveQuoteIdx((prev) => (prev + 1) % quotes.length);
  };

  return (
    <div className="col-span-1 rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-stone-900 to-stone-950 text-white border border-stone-800 shadow-lg flex flex-col justify-between relative overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>Community Choice</span>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-stone-500 hover:text-stone-300 p-1 rounded-md transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <h4 className="text-base sm:text-lg font-black tracking-tight text-white mb-1 leading-snug">
          4.9★ from 45,000+ Creators
        </h4>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-[11px] text-stone-400 font-semibold ml-1">Verified Buyers</span>
        </div>

        {/* Quote Card */}
        <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 min-h-24 flex flex-col justify-between mb-3">
          <p className="text-xs text-stone-300 italic leading-relaxed">
            "{current.text}"
          </p>
          <div className="pt-2 text-[11px] font-bold text-amber-300 flex items-center justify-between">
            <span>{current.author}</span>
            <span className="text-stone-500 font-normal">{current.role}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleNext}
          className="flex-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors cursor-pointer border border-stone-700 flex items-center justify-center gap-1"
        >
          <span>Next Story</span>
          <ChevronRight className="w-3 h-3 text-stone-400" />
        </button>

        <a
          href="#reviews-section"
          className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black transition-all shadow-md cursor-pointer"
        >
          Reviews
        </a>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. PANORAMIC AD: STUDIO CRAFT & CINEMATIC REEL (Spans full width)          */
/* -------------------------------------------------------------------------- */
export const StudioCraftPanoramicAd: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  const { setSelectedCategory } = useShop();
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="col-span-2 md:col-span-3 my-2 sm:my-3 rounded-2xl sm:rounded-3xl overflow-hidden relative bg-stone-950 text-white border border-stone-800 shadow-xl">
      {/* Background Video Reel */}
      <div className="relative aspect-[16/7] sm:aspect-[21/9] w-full overflow-hidden bg-stone-950">
        <video
          ref={videoRef}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          poster="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=80"
          loop
          muted
          playsInline
          autoPlay
          className="w-full h-full object-cover opacity-60"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/40 to-transparent" />

        {/* Dismiss and Sponsored pill */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest font-black text-stone-300 bg-stone-900/80 px-2 py-0.5 rounded-full border border-stone-700">
            Studio Film
          </span>
          {onDismiss && (
            <button
              onClick={onDismiss}
              aria-label="Dismiss ad"
              className="w-6 h-6 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Content pinned to bottom / left */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 md:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/80 border border-stone-700 text-amber-400 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
              <Film className="w-3 h-3" />
              <span>Behind The Craft • 4K Reel</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              From Raw Aerospace Alloy to Pure Living Form
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 max-w-lg">
              Explore how each audio enclosure, solid brass dial, and weighted base is machined to micron tolerances in our dedicated atelier.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleVideo}
              className="w-10 h-10 rounded-full bg-stone-900/90 hover:bg-stone-800 text-white flex items-center justify-center transition-all border border-stone-700 cursor-pointer shadow-md"
              title={isPlaying ? 'Pause Reel' : 'Play Reel'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={() => {
                setSelectedCategory('minimalist-living');
                const el = document.getElementById('jabute-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

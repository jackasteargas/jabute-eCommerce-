import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { MapPin, Navigation, X, Check, Globe, Loader2, ChevronDown, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DeliveryLocationPicker: React.FC = () => {
  const {
    deliveryLocation,
    detectUserLocation,
    isDetectingLocation,
    addToast
  } = useShop();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleAutoDetect = async () => {
    try {
      const loc = await detectUserLocation();
      addToast('Location Updated', `Delivering to ${loc.city}${loc.postalCode ? ` (${loc.postalCode})` : ''}`, 'success');
    } catch {
      addToast('Location Notice', 'Could not access precise GPS. Using detected network location.', 'info');
    }
  };

  const displayCity = deliveryLocation.city && deliveryLocation.city !== 'Detecting...'
    ? deliveryLocation.city
    : (deliveryLocation.formattedAddress || 'Detecting...');

  return (
    <>
      {/* Header Delivery Address Trigger */}
      <button
        id="delivery-location-btn"
        onClick={handleOpen}
        className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-left hover:bg-stone-100 active:bg-stone-200/80 transition-all border border-stone-200/80 hover:border-stone-300 shadow-2xs cursor-pointer group shrink-0"
        title={`Delivery to: ${displayCity} (Tap to change)`}
        aria-label="Delivery location"
      >
        <div className="relative text-amber-600 group-hover:scale-110 transition-transform shrink-0">
          <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          {isDetectingLocation && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
          )}
        </div>
        <div className="hidden sm:flex flex-col min-w-0">
          <span className="text-xs text-stone-500 font-medium leading-none flex items-center gap-0.5">
            <span>Deliver to</span>
            <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-stone-700 transition-colors" />
          </span>
          <span className="text-xs font-bold text-stone-900 leading-tight truncate max-w-[120px] lg:max-w-[150px] mt-0.5 group-hover:text-amber-700 transition-colors">
            {displayCity}
          </span>
        </div>
      </button>

      {/* Choose Delivery Address Modal - ONLY Detected Location */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-100 text-amber-700 rounded-2xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 leading-tight">
                      Detected Delivery Location
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Auto-detected device GPS & network location
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* 1. Primary Detected Location Card */}
                <div className="p-4.5 bg-gradient-to-br from-amber-50/60 via-stone-50 to-orange-50/40 rounded-2xl border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Currently Detected Location</span>
                    </span>
                    <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      {deliveryLocation.isAutoDetected ? 'GPS Auto-Detected' : 'Active Location'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-lg font-black text-stone-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>{deliveryLocation.formattedAddress || deliveryLocation.city || 'Detecting...'}</span>
                    </div>
                    {deliveryLocation.postalCode && (
                      <p className="text-xs text-stone-600 font-medium pl-7">
                        Postal Code: <strong className="text-stone-900 font-mono">{deliveryLocation.postalCode}</strong>
                      </p>
                    )}
                    {deliveryLocation.country && (
                      <p className="text-xs text-stone-600 font-medium pl-7">
                        Country: <strong className="text-stone-900">{deliveryLocation.country}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Auto-Detect / Refresh Location Button */}
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  disabled={isDetectingLocation}
                  className="w-full flex items-center justify-center gap-2.5 p-3.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white rounded-2xl font-bold text-sm transition-all shadow-sm active:scale-98 cursor-pointer"
                >
                  {isDetectingLocation ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Detecting Precise Device Location...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 text-amber-400" />
                      <span>Auto-Detect Current Location (GPS)</span>
                    </>
                  )}
                </button>
                {/* Info Note on Auto-Detected Location */}
                <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <Globe className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Your catalog pricing and shipping options are automatically optimized for this detected destination.</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Globe className="w-4 h-4 text-stone-400" /> Direct Delivery Fulfillment
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-stone-900 hover:text-stone-700 px-3 py-1 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

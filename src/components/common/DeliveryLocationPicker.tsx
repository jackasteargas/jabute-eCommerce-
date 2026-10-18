import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { MapPin, Navigation, X, Check, Globe, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const POPULAR_LOCATIONS = [
  { city: 'London', postalCode: 'SW1A 1AA', country: 'United Kingdom', countryCode: 'GB' },
  { city: 'New York', postalCode: '10001', country: 'United States', countryCode: 'US' },
  { city: 'Los Angeles', postalCode: '90012', country: 'United States', countryCode: 'US' },
  { city: 'Toronto', postalCode: 'M5V 2T6', country: 'Canada', countryCode: 'CA' },
  { city: 'Berlin', postalCode: '10115', country: 'Germany', countryCode: 'DE' },
  { city: 'Sydney', postalCode: '2000', country: 'Australia', countryCode: 'AU' },
  { city: 'Tokyo', postalCode: '100-0001', country: 'Japan', countryCode: 'JP' },
  { city: 'Paris', postalCode: '75001', country: 'France', countryCode: 'FR' }
];

export const DeliveryLocationPicker: React.FC = () => {
  const {
    deliveryLocation,
    setDeliveryLocation,
    detectUserLocation,
    isDetectingLocation,
    addToast
  } = useShop();

  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customCountry, setCustomCountry] = useState(deliveryLocation.country || 'United States');

  const handleOpen = () => {
    setCustomInput(deliveryLocation.postalCode || deliveryLocation.city || '');
    setCustomCountry(deliveryLocation.country || 'United States');
    setIsOpen(true);
  };

  const handleAutoDetect = async () => {
    try {
      const loc = await detectUserLocation();
      addToast('Location Updated', `Delivering to ${loc.city}${loc.postalCode ? ` (${loc.postalCode})` : ''}`, 'success');
      setIsOpen(false);
    } catch {
      addToast('Location Notice', 'Could not access precise GPS. Using regional location.', 'info');
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const trimmed = customInput.trim();
    // Check if input looks like a postal code or city
    const isPostal = /^[0-9A-Z\s-]{3,10}$/i.test(trimmed) && /\d/.test(trimmed);

    const newLoc = {
      city: isPostal ? deliveryLocation.city || 'Local Area' : trimmed,
      postalCode: isPostal ? trimmed : '',
      country: customCountry,
      formattedAddress: isPostal ? `${deliveryLocation.city || 'Area'}, ${trimmed}` : `${trimmed}, ${customCountry}`,
      isAutoDetected: false
    };

    setDeliveryLocation(newLoc);
    addToast('Delivery Address Updated', `Delivering to ${newLoc.formattedAddress}`, 'success');
    setIsOpen(false);
  };

  const handleSelectPopular = (loc: typeof POPULAR_LOCATIONS[0]) => {
    const newLoc = {
      city: loc.city,
      postalCode: loc.postalCode,
      country: loc.country,
      countryCode: loc.countryCode,
      formattedAddress: `${loc.city}, ${loc.postalCode}`,
      isAutoDetected: false
    };
    setDeliveryLocation(newLoc);
    addToast('Delivery Location Set', `Delivering to ${loc.city}, ${loc.country}`, 'success');
    setIsOpen(false);
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

      {/* Choose Delivery Address Modal */}
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
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 leading-tight">
                      Choose Your Delivery Location
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Delivery options & shipping rates update to your area
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* 1. Auto-Detect Button */}
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  disabled={isDetectingLocation}
                  className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-400 rounded-xl text-stone-900 font-bold text-sm transition-all shadow-2xs hover:shadow-sm cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500 text-white rounded-lg group-hover:scale-105 transition-transform">
                      {isDetectingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-stone-900 flex items-center gap-2">
                        <span>{isDetectingLocation ? 'Detecting Location...' : 'Auto-Detect My Current Location'}</span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.2 rounded uppercase">
                          GPS / IP
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-normal mt-0.5">
                        Detect automatically using your device location
                      </p>
                    </div>
                  </div>
                </button>

                {/* Current Location Badge */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-stone-700 min-w-0">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">
                      Current: <strong className="text-stone-900 font-bold">{deliveryLocation.formattedAddress || deliveryLocation.city}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                    {deliveryLocation.isAutoDetected ? 'Auto-detected' : 'Saved'}
                  </span>
                </div>

                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-stone-200 w-full" />
                  <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400 absolute">
                    or enter manually
                  </span>
                </div>

                {/* 2. Manual Form */}
                <form onSubmit={handleApplyCustom} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Postal Code or City Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="e.g. 94103, SW1A 1AA, Chicago, Paris"
                        className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
                      />
                      <button
                        type="submit"
                        disabled={!customInput.trim()}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </form>

                {/* 3. Popular Shipping Hubs */}
                <div className="pt-2">
                  <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                    Popular Destinations
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {POPULAR_LOCATIONS.map((loc) => {
                      const isSelected = deliveryLocation.city === loc.city;
                      return (
                        <button
                          key={loc.city}
                          type="button"
                          onClick={() => handleSelectPopular(loc)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/70 text-stone-900 font-bold ring-1 ring-amber-500/30'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div>
                            <span className="block font-semibold">{loc.city}</span>
                            <span className="text-[10px] text-stone-400">{loc.country}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-stone-400" /> Worldwide Express & Ground Shipping
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-stone-800 hover:text-stone-950 cursor-pointer"
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

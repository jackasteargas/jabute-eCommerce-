# Floating Navigation & Direction-Aware Category Bar Collapse

Seamless scrolling header experience for JABUTE Retail: when users scroll downward into products, the top action icons (menu, store logo, live delivery address, search, orders, wishlist, profile, and cart) stay floating cleanly at the top of the viewport with an elevated glassmorphic shadow, while the secondary "All Products" category navigation bar hides to maximize product browsing space and smoothly reappears upon scrolling back up.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your clarifying input, the navigation will dynamically adapt to the user's scrolling gesture:
> - **Top Icons Bar**: Remains pinned floating at the very top of the scrolled screen (`z-50`), providing instant access to the Store Menu (3-lines), Jabute Home button, Delivery Address, Search, Orders, Wishlist, User Profile, and Cart Bag.
> - **"All Products" Category Bar**: Collapses and hides smoothly when scrolling down to give a spacious full-screen product experience, and slides back into view when scrolling up.

- **Confirmed Decision 1**: Keep top icons pinned floating at the top of the viewport when scrolling downward.
- **Confirmed Decision 2**: Hide the "All Products" category row during downward scroll and smoothly reveal it on upward scroll with gentle CSS/Framer transitions.
- **Confirmed Decision 3**: Retain natural header layout when scrolled to the top (`scrollY === 0`) with zero clipping or layout jumps.

---

## 1. Overview & Core Concept

- **What It Does**: Enhances the storefront browsing experience by giving users maximum vertical viewport space when scrolling through products, while preserving access to essential navigation icons (Menu, Logo, Location, Cart, Search, Account) in a floating top bar.
- **Target Audience / Persona**: Shoppers exploring large catalogs on mobile and desktop devices who need uncluttered browsing with one-tap access to cart, search, and navigation.
- **Key Value**: Eliminates screen clutter during deep catalog exploration while keeping cart items, orders, delivery address, and menu immediately reachable without having to scroll all the way back to the top.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Initial Page Load / Top of Page (`scrollY < 20px`)**:
   - Full header is displayed: Sitewide Promo Banner, Main Navbar (Menu, Jabute logo, Delivery location, Search bar, Orders, Wishlist, User, Cart), and the secondary "All Products" category navigation strip.
2. **Scrolling Downward (`scrollDelta > 0` & `scrollY > 80px`)**:
   - Sitewide promo banner and the secondary "All Products" category bar smoothly slide up and fade out (`height: 0`, `opacity: 0`).
   - The primary action bar transforms into an elevated floating header: crisp white background with 95% opacity, backdrop blur (`backdrop-blur-md`), and a subtle elevated drop shadow (`shadow-md`).
   - Top icons from Menu (☰) to Delivery Address to Cart remain pinned at the top.
3. **Scrolling Upward (`scrollDelta < 0`)**:
   - The "All Products" category bar animates back down into place with a smooth easing transition (`duration-200 ease-out`), allowing the shopper to switch categories without losing their scroll position.
4. **Mobile Responsiveness**:
   - On mobile screens, the search bar toggle, hamburger menu, delivery location, and cart icon remain accessible with comfortable 44px+ touch targets and zero horizontal overflow.

### Visual Styling & Theme Tokens
- **Floating Bar Background**: `bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm transition-all duration-300`
- **Category Bar Transition**: Directional animation using Framer Motion `motion.div` with height, transform, and opacity transitions (`overflow-hidden`).
- **Icons & Buttons**: Preserves active count badges (Cart items, Orders count, Wishlist badge) and dark accent tokens (`bg-stone-900`, `text-amber-400`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Directional Scroll Detection vs. Absolute Scroll Position**
  - *Chosen Approach*: Track both `scrollY` and scroll delta direction (`up` vs. `down`) with a small hysteresis threshold (e.g. 10px buffer).
  - *Why*: Hiding the secondary bar only when actively scrolling down and restoring it when scrolling up follows modern mobile e-commerce best practices (like Amazon, Apple, and Shopify store themes) and prevents jittery flickering when tapping or making small finger micro-scrolls.
  - *Alternatives Considered*: Hiding permanently once past 200px scroll was rejected because users would have to scroll all the way to the top just to switch product categories.

- **Decision 2: Floating Bar Layout Integration**
  - *Chosen Approach*: Implement the scroll state directly in `Header.tsx` controlling the visibility and height of the secondary category strip while keeping the top bar sticky (`sticky top-0 z-40`).
  - *Why*: Prevents layout thrashing, prevents content jumping underneath the header, and maintains full accessibility for keyboard and screen reader navigation.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Window Scroll Event                      │
│        (passive scroll listener with hysteresis & rAF)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Header Component State                    │
│   • isScrolled: boolean (scrollY > 20px)                    │
│   • isScrollingDown: boolean (delta > 0 && scrollY > 80px)  │
│   • showCategoryBar: boolean (!isScrollingDown)             │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
                ▼                             ▼
┌───────────────────────────────┐ ┌───────────────────────────┐
│       Floating Top Bar        │ │   "All Products" Strip    │
│  • ☰ Menu Button              │ │  • All Products Button    │
│  • JABUTE Logo (Home)         │ │  • Category Buttons       │
│  • Delivery Location Picker   │ │  • Auth Badges / Filters  │
│  • Real-Time Search Bar       │ │  • (Collapses smoothly on │
│  • Orders, Wishlist, User     │ │     scroll down, reveals  │
│  • Cart with Items & Subtotal │ │     on scroll up)         │
│  (Always Floating at Top)     │ │                           │
└───────────────────────────────┘ └───────────────────────────┘
```

### Component & State Mapping
- **`Header.tsx`**:
  - Adds `isScrolled` and `showCategoriesOnScroll` states with an optimized `useEffect` scroll handler using `requestAnimationFrame`.
  - Wraps the secondary Category bar and Promo banner in responsive animated wrappers (`AnimatePresence` / `motion.div` or transition classes) that animate height and opacity.
  - Applies elevated floating classes (`shadow-md`, `bg-white/95`, `backdrop-blur-md`) when `isScrolled` is true.
  - Preserves all existing handlers: `openCart`, `handleLogoClick`, `setIsAppMenuOpen`, and category selection.

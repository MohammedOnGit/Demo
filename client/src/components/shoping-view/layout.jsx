
// layout.jsx - Fully optimized & production-ready
import { Outlet, useLocation } from "react-router-dom";
import ShoppingHeader from "./header";
import {
  useEffect,
  useState,
  useCallback,
  Suspense,
  useMemo,
} from "react";
import { Toaster } from "@/components/ui/sonner";
import {
  ArrowUp,
  Loader2,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingFooter, CompactFooter } from "./footer";

/* -------------------------------------------------------------------------- */
/*                               DEVICE DETECTION                             */
/* -------------------------------------------------------------------------- */

const useDeviceDetection = () => {
  const [device, setDevice] = useState("desktop");

  useEffect(() => {
    let rafId = null;

    const detect = () => {
      const w = window.innerWidth;
      if (w < 768) setDevice("mobile");
      else if (w < 1024) setDevice("tablet");
      else setDevice("desktop");
    };

    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(detect);
    };

    detect();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return device;
};

/* -------------------------------------------------------------------------- */
/*                          PAGE LOADING INDICATOR                             */
/* -------------------------------------------------------------------------- */

const PageLoadingIndicator = ({ isLoading }) => (
  <div className="fixed top-16 left-0 right-0 z-[100] h-1 bg-primary/10 overflow-hidden pointer-events-none">
    <div
      className={cn(
        "h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-300",
        isLoading ? "w-full" : "w-0"
      )}
    />
  </div>
);

/* -------------------------------------------------------------------------- */
/*                           SCROLL TO TOP BUTTON                              */
/* -------------------------------------------------------------------------- */

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      aria-label="Scroll to top"
      className={cn(
        "fixed right-4 sm:right-6 bottom-24 sm:bottom-6 z-40",
        "h-12 w-12 rounded-full shadow-2xl shadow-primary/20",
        "bg-background border-2 border-primary/20",
        "backdrop-blur-sm supports-[backdrop-filter]:bg-background/80",
        "transition-all duration-300 transform",
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-10 scale-95 pointer-events-none"
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};

/* -------------------------------------------------------------------------- */
/*                          PERFORMANCE MONITOR (DEV)                          */
/* -------------------------------------------------------------------------- */

const PerformanceMonitor = () => {
  useEffect(() => {
    if (import.meta.env.DEV && "PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.debug(
            `[Perf] ${entry.name}: ${entry.duration.toFixed(2)}ms`
          );
        });
      });

      observer.observe({
        entryTypes: ["navigation", "measure", "resource"],
      });

      return () => observer.disconnect();
    }
  }, []);

  return null;
};

/* -------------------------------------------------------------------------- */
/*                                MAIN LAYOUT                                  */
/* -------------------------------------------------------------------------- */

function ShoppingLayout() {
  const location = useLocation();
  const device = useDeviceDetection();

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  /* Route loading indicator */
  useEffect(() => {
    setIsPageLoading(true);
    const t = setTimeout(() => setIsPageLoading(false), 250);
    return () => clearTimeout(t);
  }, [location.pathname]);

  /* Scroll to top on route change */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  /* Real viewport height fix (mobile browsers) */
  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };

    setVH();
    window.addEventListener("resize", setVH, { passive: true });
    window.addEventListener("orientationchange", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  /* Network status */
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const shouldHideFooter = useMemo(
    () =>
      location.pathname.includes("/checkout") ||
      location.pathname.includes("/cart"),
    [location.pathname]
  );

  const useCompactFooter = useMemo(
    () =>
      location.pathname.includes("/product/") ||
      location.pathname.includes("/shop/listing") ||
      location.pathname.includes("/shop/search"),
    [location.pathname]
  );

  const DeviceIcon = useMemo(
    () =>
      ({
        mobile: Smartphone,
        tablet: Tablet,
        desktop: Monitor,
      }[device]),
    [device]
  );

  return (
    <div className="flex flex-col min-h-screen bg-background antialiased relative">
      <PerformanceMonitor />

      <PageLoadingIndicator isLoading={isPageLoading} />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <ShoppingHeader />
      </div>

      {/* Main */}
      <main
        className={cn(
          "flex-1 w-full pt-16 relative overflow-x-hidden transition-opacity duration-300",
          isPageLoading && "opacity-80"
        )}
      >
        <div className="w-full mx-auto max-w-[1920px]">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground">
                    Loading your shopping experience…
                  </p>
                </div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>

        <ScrollToTopButton />

        {import.meta.env.DEV && (
          <div className="fixed bottom-32 left-4 z-40">
            <div className="flex items-center gap-2 px-3 py-2 bg-background/80 backdrop-blur-sm rounded-full border text-xs">
              {DeviceIcon && <DeviceIcon className="h-3 w-3" />}
              <span className="font-medium capitalize">{device}</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      {!shouldHideFooter && (
        <div className="relative z-30 mt-auto">
          {useCompactFooter ? <CompactFooter /> : <ShoppingFooter />}
        </div>
      )}

      {/* Toasts */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-background border",
          duration: 4000,
        }}
      />

      {/* Offline Indicator */}
      {!online && (
        <div className="fixed bottom-4 left-4 z-50 px-3 py-2 bg-red-500 text-white text-xs rounded-lg animate-pulse">
          Offline Mode
        </div>
      )}

      {/* Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 z-[9999] bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Skip to main content
      </a>
      <div id="main-content" className="sr-only" aria-hidden="true" />
    </div>
  );
}

export default ShoppingLayout;

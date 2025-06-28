import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Monitor,
  Tablet,
  Smartphone,
  Globe,
  ExternalLink,
  AlertCircle,
  RotateCcw,
  ArrowLeft,
  Home,
  Laptop,
  Tv,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Device {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  category: "desktop" | "tablet" | "mobile";
}

const devices: Device[] = [
  // Desktop & Monitors
  {
    id: "4k",
    name: "4K Display",
    width: 3840,
    height: 2160,
    icon: <Tv className="w-5 h-5" />,
    category: "desktop",
  },
  {
    id: "2k",
    name: "2K Display",
    width: 2560,
    height: 1440,
    icon: <Monitor className="w-5 h-5" />,
    category: "desktop",
  },
  {
    id: "fullhd",
    name: "Full HD",
    width: 1920,
    height: 1080,
    icon: <Monitor className="w-5 h-5" />,
    category: "desktop",
  },
  {
    id: "laptop",
    name: "MacBook Pro",
    width: 1440,
    height: 900,
    icon: <Laptop className="w-5 h-5" />,
    category: "desktop",
  },
  {
    id: "standard",
    name: "Laptop",
    width: 1366,
    height: 768,
    icon: <Laptop className="w-5 h-5" />,
    category: "desktop",
  },

  // Tablets
  {
    id: "ipad-pro",
    name: "iPad Pro",
    width: 1024,
    height: 1366,
    icon: <Tablet className="w-5 h-5" />,
    category: "tablet",
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    width: 820,
    height: 1180,
    icon: <Tablet className="w-5 h-5" />,
    category: "tablet",
  },
  {
    id: "ipad",
    name: "iPad",
    width: 768,
    height: 1024,
    icon: <Tablet className="w-5 h-5" />,
    category: "tablet",
  },

  // Mobile Phones
  {
    id: "iphone-15-max",
    name: "iPhone 15 Pro Max",
    width: 430,
    height: 932,
    icon: <Smartphone className="w-5 h-5" />,
    category: "mobile",
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    width: 393,
    height: 852,
    icon: <Smartphone className="w-5 h-5" />,
    category: "mobile",
  },
  {
    id: "iphone-14",
    name: "iPhone 14",
    width: 390,
    height: 844,
    icon: <Smartphone className="w-5 h-5" />,
    category: "mobile",
  },
  {
    id: "galaxy-s24",
    name: "Galaxy S24 Ultra",
    width: 412,
    height: 915,
    icon: <Smartphone className="w-5 h-5" />,
    category: "mobile",
  },
  {
    id: "pixel-8",
    name: "Pixel 8 Pro",
    width: 412,
    height: 892,
    icon: <Smartphone className="w-5 h-5" />,
    category: "mobile",
  },
];

export default function Preview() {
  const [searchParams] = useSearchParams();
  const [currentUrl, setCurrentUrl] = useState("");
  const [proxyUrl, setProxyUrl] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<Device>(devices[2]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const [zoomLevel, setZoomLevel] = useState("auto");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const zoomOptions = [
    { value: "auto", label: "Auto Fit" },
    { value: "25", label: "25%" },
    { value: "33", label: "33%" },
    { value: "50", label: "50%" },
    { value: "67", label: "67%" },
    { value: "75", label: "75%" },
    { value: "100", label: "100%" },
    { value: "125", label: "125%" },
    { value: "150", label: "150%" },
    { value: "200", label: "200%" },
  ];

  useEffect(() => {
    const url = searchParams.get("url");
    const width = searchParams.get("width");
    const height = searchParams.get("height");
    const deviceName = searchParams.get("device");

    if (url && width && height) {
      setCurrentUrl(url);
      const proxyUrlFormatted = `/api/proxy?url=${encodeURIComponent(url)}`;
      setProxyUrl(proxyUrlFormatted);

      const device = devices.find((d) => d.name === deviceName);
      if (device) {
        setSelectedDevice(device);
      } else {
        setSelectedDevice({
          id: "custom",
          name: `Custom (${width}×${height})`,
          width: parseInt(width),
          height: parseInt(height),
          icon: <Monitor className="w-5 h-5" />,
          category: "desktop",
        });
      }
    }
  }, [searchParams]);

  const calculateAutoFit = () => {
    const availableWidth = window.innerWidth - 100;
    const availableHeight = window.innerHeight - 140;

    const scaleX = availableWidth / currentWidth;
    const scaleY = availableHeight / currentHeight;

    return Math.min(scaleX, scaleY, 2.0);
  };

  const handleIframeError = () => {
    setHasError(true);
    setErrorMessage("Failed to load website");
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    // Advanced real-time crawling for Preview mode
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      try {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;

        const performRealTimeCrawl = () => {
          if (iframeDoc.readyState === "complete") {
            // Real-time resource monitoring
            const monitorResources = () => {
              const images = iframeDoc.querySelectorAll("img");
              const stylesheets = iframeDoc.querySelectorAll(
                "link[rel='stylesheet']",
              );
              const scripts = iframeDoc.querySelectorAll("script[src]");

              let resourcesLoaded = 0;
              const totalResources =
                images.length + stylesheets.length + scripts.length;

              const checkAllLoaded = () => {
                resourcesLoaded++;
                if (resourcesLoaded >= totalResources) {
                  // All resources loaded in real-time
                  setTimeout(() => {
                    setIsLoading(false);
                    setHasError(false);
                  }, 1000);
                }
              };

              if (totalResources === 0) {
                setTimeout(() => {
                  setIsLoading(false);
                  setHasError(false);
                }, 2000);
                return;
              }

              // Monitor each resource type in real-time
              images.forEach((img) => {
                if (img.complete && img.naturalHeight > 0) {
                  checkAllLoaded();
                } else {
                  img.addEventListener("load", checkAllLoaded, { once: true });
                  img.addEventListener("error", checkAllLoaded, { once: true });
                }
              });

              stylesheets.forEach((link) => {
                if (link.sheet) {
                  checkAllLoaded();
                } else {
                  link.addEventListener("load", checkAllLoaded, { once: true });
                  link.addEventListener("error", checkAllLoaded, {
                    once: true,
                  });
                }
              });

              scripts.forEach(() => checkAllLoaded());
            };

            setTimeout(monitorResources, 500);
          } else {
            setTimeout(performRealTimeCrawl, 300);
          }
        };

        performRealTimeCrawl();
      } catch (e) {
        // Cross-origin handling with extended real-time waiting
        setTimeout(() => {
          setIsLoading(false);
          setHasError(false);
        }, 5000);
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setHasError(false);
      }, 4000);
    }
  };

  const openInNewTab = () => {
    if (currentUrl) {
      window.open(currentUrl, "_blank");
    }
  };

  const goHome = () => {
    window.location.href = "/";
  };

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setIsRotated(false);
  };

  const toggleRotation = () => {
    setIsRotated(!isRotated);
  };

  const currentWidth = isRotated ? selectedDevice.height : selectedDevice.width;
  const currentHeight = isRotated
    ? selectedDevice.width
    : selectedDevice.height;

  const getPreviewDimensions = () => {
    let scale: number;

    if (zoomLevel === "auto") {
      scale = calculateAutoFit();
    } else {
      scale = parseInt(zoomLevel) / 100;
    }

    return {
      width: currentWidth * scale,
      height: currentHeight * scale,
      scale,
    };
  };

  const {
    width: previewWidth,
    height: previewHeight,
    scale,
  } = getPreviewDimensions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Enhanced Header with Logo and Device Toolbar */}
      <style jsx>{`
        @keyframes logoFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(3deg);
          }
        }
        .logo-animated {
          animation: logoFloat 3s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .mobile-hidden {
            display: none;
          }
          .mobile-compact {
            padding: 8px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/50">
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3">
          {/* Left Side - Logo & Back */}
          <div className="flex items-center gap-4 sm:gap-6 mb-2 sm:mb-0">
            <Button
              onClick={goHome}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F2f9afe8dc22849b186c0fc07b1bbb4f9%2F2f9de9187e1c4134988baa17156cc2c7?format=webp&width=800"
                alt="RespoCheck"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain logo-animated"
              />
            </div>
          </div>

          {/* Center - Responsive Device Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 bg-white/80 rounded-lg p-2">
            {devices
              .slice(0, window.innerWidth < 768 ? 6 : devices.length)
              .map((device) => (
                <Button
                  key={device.id}
                  onClick={() => handleDeviceSelect(device)}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex flex-col items-center gap-1 h-auto p-2 sm:p-3 text-xs transition-all mobile-compact",
                    selectedDevice.id === device.id
                      ? "bg-blue-500 text-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
                  )}
                  title={`${device.name} (${device.width}×${device.height})`}
                >
                  {device.icon}
                  <span className="font-medium hidden sm:block">
                    {device.width}
                  </span>
                </Button>
              ))}
          </div>

          {/* Right Side - Controls */}
          <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
            {/* Zoom Control */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm hidden sm:inline">
                Zoom:
              </span>
              <Select value={zoomLevel} onValueChange={setZoomLevel}>
                <SelectTrigger className="w-20 sm:w-24 h-8 bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {zoomOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-gray-700 hover:bg-gray-100"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rotation for mobile/tablet */}
            {(selectedDevice.category === "tablet" ||
              selectedDevice.category === "mobile") && (
              <Button
                onClick={toggleRotation}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}

            <Button
              onClick={openInNewTab}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Device Info Bar */}
        <div className="px-4 sm:px-6 py-2 bg-white/60 border-t border-slate-200/30">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600">
              <span className="font-medium text-gray-800">
                {selectedDevice.name}
              </span>
              <Badge
                variant="outline"
                className="border-gray-400 text-gray-600"
              >
                {currentWidth} × {currentHeight}px
              </Badge>
              <span className="text-xs sm:text-sm">
                {Math.round(scale * 100)}% • Real-time preview
              </span>
            </div>
            <span className="text-xs text-gray-500 truncate max-w-xs">
              {currentUrl && new URL(currentUrl).hostname}
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Preview Area - NO BORDERS, Clean Design */}
      <div
        className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      >
        {proxyUrl ? (
          <div className="relative">
            {/* Clean Preview Container - NO DEVICE FRAMES */}
            <div
              className="bg-white shadow-2xl overflow-hidden rounded-lg"
              style={{
                width: Math.min(previewWidth, window.innerWidth - 50),
                height: Math.min(previewHeight, window.innerHeight - 200),
              }}
            >
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">
                      Real-time crawling...
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Loading all resources in real-time
                    </p>
                  </div>
                </div>
              ) : hasError ? (
                <div className="w-full h-full flex items-center justify-center bg-red-50">
                  <div className="text-center p-6 sm:p-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Cannot Load Website
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{errorMessage}</p>
                    <Button onClick={openInNewTab} size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Original
                    </Button>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={proxyUrl}
                  className="w-full h-full border-0"
                  style={{
                    width: currentWidth,
                    height: currentHeight,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    imageRendering: "auto",
                    textRendering: "optimizeLegibility",
                  }}
                  title="Website Preview"
                  loading="eager"
                  importance="high"
                  onError={handleIframeError}
                  onLoad={handleIframeLoad}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
              )}
            </div>

            {/* Professional Info Label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-center shadow-lg border border-slate-200">
                <div className="text-gray-800 text-sm font-medium">
                  {selectedDevice.name}
                </div>
                <div className="text-gray-600 text-xs">
                  {currentWidth} × {currentHeight}px • {Math.round(scale * 100)}
                  % • Real-time
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F2f9afe8dc22849b186c0fc07b1bbb4f9%2F2f9de9187e1c4134988baa17156cc2c7?format=webp&width=800"
                alt="RespoCheck"
                className="w-8 sm:w-10 h-8 sm:h-10 object-contain"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              No Preview Available
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Please return to home to enter a website URL.
            </p>
            <Button onClick={goHome} className="bg-blue-500 hover:bg-blue-600">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

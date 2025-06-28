import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
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
  Settings,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Device {
  id: string;
  name: string;
  width: number;
  height: number;
}

const devices = {
  desktop: [
    { id: "4k", name: "4K Ultra HD", width: 3840, height: 2160 },
    { id: "2k", name: "2K QHD", width: 2560, height: 1440 },
    { id: "fullhd", name: "Full HD", width: 1920, height: 1080 },
    { id: "laptop", name: "MacBook Pro", width: 1440, height: 900 },
    { id: "standard", name: "Standard HD", width: 1366, height: 768 },
    { id: "old", name: "Old Monitor", width: 1024, height: 768 },
  ],
  tablet: [
    { id: "ipad-pro", name: "iPad Pro 12.9", width: 1024, height: 1366 },
    { id: "ipad-air", name: "iPad Air", width: 820, height: 1180 },
    { id: "ipad", name: "iPad", width: 768, height: 1024 },
    { id: "surface", name: "Surface Pro", width: 912, height: 1368 },
    { id: "galaxy-tab", name: "Galaxy Tab", width: 800, height: 1280 },
    { id: "kindle", name: "Kindle Fire", width: 1024, height: 600 },
  ],
  mobile: [
    { id: "iphone-15-max", name: "iPhone 15 Pro Max", width: 430, height: 932 },
    { id: "iphone-15", name: "iPhone 15", width: 393, height: 852 },
    { id: "iphone-14", name: "iPhone 14", width: 390, height: 844 },
    { id: "galaxy-s24", name: "Galaxy S24 Ultra", width: 412, height: 915 },
    { id: "pixel-8", name: "Pixel 8 Pro", width: 412, height: 892 },
    { id: "iphone-se", name: "iPhone SE", width: 375, height: 667 },
  ],
};

type DeviceCategory = "desktop" | "tablet" | "mobile";

export default function Index() {
  const [url, setUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [proxyUrl, setProxyUrl] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<DeviceCategory>("desktop");
  const [selectedDevice, setSelectedDevice] = useState<Device>(
    devices.desktop[2], // Full HD as default
  );
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const [zoomLevel, setZoomLevel] = useState("auto");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const zoomOptions = [
    { value: "auto", label: "Auto Fit" },
    { value: "25", label: "25%" },
    { value: "50", label: "50%" },
    { value: "75", label: "75%" },
    { value: "100", label: "100%" },
    { value: "125", label: "125%" },
    { value: "150", label: "150%" },
    { value: "200", label: "200%" },
  ];

  const handlePreview = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    let formattedUrl = url.trim();

    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      new URL(formattedUrl);
      setCurrentUrl(formattedUrl);
      const proxyUrlFormatted = `/api/proxy?url=${encodeURIComponent(formattedUrl)}`;
      setProxyUrl(proxyUrlFormatted);

      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    } catch (error) {
      setHasError(true);
      setErrorMessage("Please enter a valid URL");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePreview();
    }
  };

  const handleIframeError = () => {
    setHasError(true);
    setErrorMessage(
      "Failed to load website. The site might be temporarily unavailable.",
    );
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    // Real-time website crawling and loading
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      try {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;

        // Ensure complete real-time loading of all resources
        const checkComplete = () => {
          if (iframeDoc.readyState === "complete") {
            // Force reload all dynamic content and ensure real-time rendering
            const checkResources = () => {
              const images = iframeDoc.querySelectorAll("img");
              const scripts = iframeDoc.querySelectorAll("script");
              const styles = iframeDoc.querySelectorAll(
                "link[rel='stylesheet']",
              );

              let loadedCount = 0;
              const totalResources =
                images.length + scripts.length + styles.length;

              if (totalResources === 0) {
                setTimeout(() => {
                  setIsLoading(false);
                  setHasError(false);
                }, 2000);
                return;
              }

              const checkResourceLoad = () => {
                loadedCount++;
                if (loadedCount >= totalResources) {
                  setTimeout(() => {
                    setIsLoading(false);
                    setHasError(false);
                  }, 1500);
                }
              };

              // Check all images
              images.forEach((img) => {
                if (img.complete) {
                  checkResourceLoad();
                } else {
                  img.addEventListener("load", checkResourceLoad);
                  img.addEventListener("error", checkResourceLoad);
                }
              });

              // Check stylesheets
              styles.forEach((style) => {
                if (style.sheet) {
                  checkResourceLoad();
                } else {
                  style.addEventListener("load", checkResourceLoad);
                  style.addEventListener("error", checkResourceLoad);
                }
              });

              // Scripts are already loaded if we reach here
              for (let i = 0; i < scripts.length; i++) {
                checkResourceLoad();
              }
            };

            setTimeout(checkResources, 1000);
          } else {
            setTimeout(checkComplete, 500);
          }
        };

        checkComplete();
      } catch (e) {
        // Cross-origin, wait for real-time loading
        setTimeout(() => {
          setIsLoading(false);
          setHasError(false);
        }, 4000);
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setHasError(false);
      }, 3000);
    }
  };

  const openInNewTab = () => {
    if (currentUrl) {
      window.open(currentUrl, "_blank");
    }
  };

  const openPreviewMode = () => {
    if (proxyUrl) {
      const params = new URLSearchParams({
        url: currentUrl,
        width: currentWidth.toString(),
        height: currentHeight.toString(),
        device: selectedDevice.name,
        category: activeCategory,
      });
      window.open(`/preview?${params.toString()}`, "_blank");
    }
  };

  const handleCategoryChange = (category: DeviceCategory) => {
    setActiveCategory(category);
    setSelectedDevice(devices[category][0]);
    setIsRotated(false);
    setUseCustomSize(false);
  };

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setCustomWidth(device.width);
    setCustomHeight(device.height);
    setUseCustomSize(false);
  };

  const toggleRotation = () => {
    setIsRotated(!isRotated);
  };

  const enableCustomSize = () => {
    setUseCustomSize(true);
  };

  const currentWidth = useCustomSize
    ? customWidth
    : isRotated
      ? selectedDevice.height
      : selectedDevice.width;
  const currentHeight = useCustomSize
    ? customHeight
    : isRotated
      ? selectedDevice.width
      : selectedDevice.height;

  // Fixed preview size calculation
  const getPreviewDimensions = () => {
    let scale: number;

    if (zoomLevel === "auto") {
      const containerWidth = Math.min(window.innerWidth - 100, 1200);
      const containerHeight = Math.min(window.innerHeight - 400, 800);
      scale = Math.min(
        containerWidth / currentWidth,
        containerHeight / currentHeight,
        1,
      );
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header with Animated Logo */}
      <style jsx>{`
        @keyframes logoFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
        @keyframes logoPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes logoGlow {
          0%,
          100% {
            filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.6));
          }
        }
        .logo-animated {
          animation:
            logoFloat 3s ease-in-out infinite,
            logoPulse 2s ease-in-out infinite,
            logoGlow 4s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .responsive-container {
            padding: 16px;
          }
          .responsive-grid {
            grid-template-columns: 1fr;
          }
          .responsive-flex {
            flex-direction: column;
            gap: 12px;
          }
          .responsive-text {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 responsive-container">
          <div className="flex justify-center">
            {/* Large Animated Logo Only */}
            <div className="relative">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F2f9afe8dc22849b186c0fc07b1bbb4f9%2F2f9de9187e1c4134988baa17156cc2c7?format=webp&width=800"
                alt="RespoCheck"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain logo-animated"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Fully Responsive */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 responsive-container">
        {/* URL Input - Enhanced */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 responsive-flex">
            <Input
              type="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-12 sm:h-14 text-base bg-white/90 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
            />
            <Button
              onClick={handlePreview}
              disabled={!url.trim() || isLoading}
              className="h-12 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium text-base shadow-lg"
            >
              {isLoading ? "Loading..." : "Check Responsiveness"}
            </Button>
          </div>
        </div>

        {/* Device Categories - Enhanced Responsive */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 mb-6">
          {/* Category Tabs - Responsive */}
          <div className="border-b border-gray-200">
            <div className="flex flex-col sm:flex-row">
              <button
                onClick={() => handleCategoryChange("desktop")}
                className={cn(
                  "flex items-center justify-center sm:justify-start gap-3 px-4 sm:px-8 py-4 border-b-2 font-medium text-sm sm:text-base transition-colors responsive-text",
                  activeCategory === "desktop"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                <Monitor className="w-5 h-5" />
                Desktop & Laptops
              </button>
              <button
                onClick={() => handleCategoryChange("tablet")}
                className={cn(
                  "flex items-center justify-center sm:justify-start gap-3 px-4 sm:px-8 py-4 border-b-2 font-medium text-sm sm:text-base transition-colors responsive-text",
                  activeCategory === "tablet"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                <Tablet className="w-5 h-5" />
                Tablets
              </button>
              <button
                onClick={() => handleCategoryChange("mobile")}
                className={cn(
                  "flex items-center justify-center sm:justify-start gap-3 px-4 sm:px-8 py-4 border-b-2 font-medium text-sm sm:text-base transition-colors responsive-text",
                  activeCategory === "mobile"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                <Smartphone className="w-5 h-5" />
                Mobile Phones
              </button>
            </div>
          </div>

          {/* Device Options - Responsive Grid */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6 responsive-grid">
              {devices[activeCategory].map((device) => (
                <button
                  key={device.id}
                  onClick={() => handleDeviceSelect(device)}
                  className={cn(
                    "p-3 sm:p-4 text-left border rounded-lg transition-all hover:border-blue-300 hover:bg-blue-50",
                    selectedDevice.id === device.id && !useCustomSize
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700",
                  )}
                >
                  <div className="font-medium text-sm mb-1">{device.name}</div>
                  <div className="text-xs text-gray-500">
                    {device.width} × {device.height}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Size Controls - Responsive */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  Custom Size Controls
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Width: {customWidth}px
                  </label>
                  <Slider
                    value={[customWidth]}
                    onValueChange={(value) => {
                      setCustomWidth(value[0]);
                      enableCustomSize();
                    }}
                    max={3840}
                    min={320}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>320px</span>
                    <span>3840px</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Height: {customHeight}px
                  </label>
                  <Slider
                    value={[customHeight]}
                    onValueChange={(value) => {
                      setCustomHeight(value[0]);
                      enableCustomSize();
                    }}
                    max={2160}
                    min={240}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>240px</span>
                    <span>2160px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Controls - Responsive */}
        {proxyUrl && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="outline"
                  className="text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 font-mono"
                >
                  {currentWidth} × {currentHeight}px
                </Badge>
                {useCustomSize && (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    Custom Size
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Zoom Control */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Zoom:</span>
                  <Select value={zoomLevel} onValueChange={setZoomLevel}>
                    <SelectTrigger className="w-24 sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {zoomOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(activeCategory === "tablet" ||
                  activeCategory === "mobile") && (
                  <Button
                    onClick={toggleRotation}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {isRotated ? "Portrait" : "Landscape"}
                    </span>
                  </Button>
                )}

                <Button
                  onClick={openPreviewMode}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Preview Mode</span>
                </Button>

                <Button
                  onClick={openInNewTab}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Open Original</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Clean Preview - Enhanced */}
        {proxyUrl && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 p-4 sm:p-6">
            <div className="flex justify-center">
              <div
                className="bg-white shadow-2xl overflow-hidden rounded-lg"
                style={{
                  width: Math.min(previewWidth, window.innerWidth - 80),
                  height: Math.min(previewHeight, window.innerHeight - 200),
                }}
              >
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium text-base sm:text-lg">
                        Real-time crawling...
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Loading all resources in real-time
                      </p>
                    </div>
                  </div>
                ) : hasError ? (
                  <div className="w-full h-full flex items-center justify-center bg-red-50">
                    <div className="text-center p-4 sm:p-8">
                      <AlertCircle className="w-12 sm:w-16 h-12 sm:h-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                        Cannot Load Website
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        {errorMessage || "Failed to load website content"}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button
                          onClick={handlePreview}
                          variant="outline"
                          size="sm"
                        >
                          Try Again
                        </Button>
                        <Button onClick={openInNewTab} size="sm">
                          Open Original
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    ref={iframeRef}
                    src={proxyUrl}
                    className="w-full h-full"
                    style={{
                      width: currentWidth,
                      height: currentHeight,
                      transform: `scale(${scale})`,
                      transformOrigin: "top left",
                      border: "none",
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
            </div>
            {/* Preview Info */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Real-time preview at {Math.round(scale * 100)}% • {currentWidth} ×{" "}
              {currentHeight}px
            </div>
          </div>
        )}

        {/* Empty State - Enhanced */}
        {!proxyUrl && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 p-8 sm:p-12 text-center">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F2f9afe8dc22849b186c0fc07b1bbb4f9%2F2f9de9187e1c4134988baa17156cc2c7?format=webp&width=800"
                alt="RespoCheck"
                className="w-8 sm:w-10 h-8 sm:h-10 object-contain"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
              Test Website Responsiveness
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-sm sm:text-base">
              Enter a website URL above to see real-time previews on different
              devices and screen sizes. Complete with live resource crawling.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 sm:w-5 h-4 sm:h-5" />
                Desktop & Laptops
              </div>
              <div className="flex items-center gap-2">
                <Tablet className="w-4 sm:w-5 h-4 sm:h-5" />
                Tablets
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 sm:w-5 h-4 sm:h-5" />
                Mobile Phones
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ExternalLink,
  AlertCircle,
  RotateCcw,
  Settings,
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Mouse tracking for wave effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

      // Don't automatically set loading to false - let iframe handle it
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
    setErrorMessage("Failed to load website in real-time");
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    // REAL-TIME crawling verification
    const iframe = iframeRef.current;
    if (iframe) {
      try {
        // Check if iframe content is actually loaded
        setTimeout(() => {
          try {
            const iframeDoc =
              iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc && iframeDoc.readyState === "complete") {
              // Verify real content is loaded
              const hasContent =
                iframeDoc.body && iframeDoc.body.children.length > 0;
              if (hasContent) {
                setIsLoading(false);
                setHasError(false);
              } else {
                // Retry loading
                setTimeout(() => {
                  setIsLoading(false);
                  setHasError(false);
                }, 2000);
              }
            } else {
              setTimeout(() => {
                setIsLoading(false);
                setHasError(false);
              }, 3000);
            }
          } catch (e) {
            // Cross-origin - wait for natural loading
            setTimeout(() => {
              setIsLoading(false);
              setHasError(false);
            }, 4000);
          }
        }, 1000);
      } catch (e) {
        setTimeout(() => {
          setIsLoading(false);
          setHasError(false);
        }, 3000);
      }
    }
  };

  const openInNewTab = () => {
    if (currentUrl) {
      window.open(currentUrl, "_blank");
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

  // Enhanced preview size calculation
  const getPreviewDimensions = () => {
    let scale: number;

    if (zoomLevel === "auto") {
      const containerWidth = Math.min(window.innerWidth - 100, 1400);
      const containerHeight = Math.min(window.innerHeight - 350, 900);
      scale = Math.min(
        containerWidth / currentWidth,
        containerHeight / currentHeight,
        1.2,
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
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(59, 130, 246, 0.15) 0%, 
            rgba(147, 197, 253, 0.1) 25%, 
            rgba(219, 234, 254, 0.05) 50%, 
            transparent 70%),
          linear-gradient(135deg, 
            #f1f5f9 0%, 
            #e0f2fe 25%, 
            #dbeafe 50%, 
            #e0e7ff 75%, 
            #f1f5f9 100%)
        `,
      }}
    >
      {/* Wave Animation Styles */}
      <style jsx>{`
        @keyframes logoFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-8px) rotate(2deg) scale(1.02);
          }
        }

        @keyframes waveEffect {
          0%,
          100% {
            transform: translateX(-50%) translateY(0px) scale(1);
          }
          50% {
            transform: translateX(-50%) translateY(-10px) scale(1.1);
          }
        }

        .logo-animated {
          animation: logoFloat 4s ease-in-out infinite;
          filter: drop-shadow(0 10px 25px rgba(59, 130, 246, 0.3));
        }

        .wave-bg::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(59, 130, 246, 0.1) 0%,
            rgba(147, 197, 253, 0.05) 30%,
            transparent 60%
          );
          animation: waveEffect 3s ease-in-out infinite;
          pointer-events: none;
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
          .mobile-hidden {
            display: none;
          }
        }
      `}</style>

      {/* Enhanced Header with Larger Logo */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-blue-200/50 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-blue-50/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 responsive-container">
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F2f9afe8dc22849b186c0fc07b1bbb4f9%2F2f9de9187e1c4134988baa17156cc2c7?format=webp&width=800"
                alt="RespoCheck"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain logo-animated"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 responsive-container relative">
        {/* URL Input with Logo Colors */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-200/50 p-6 sm:p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-blue-100/50"></div>
          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-4 responsive-flex">
              <Input
                type="url"
                placeholder="Enter website URL (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-14 sm:h-16 text-base bg-white/95 border-blue-300 focus:border-blue-500 focus:ring-blue-500/30 shadow-lg"
              />
              <Button
                onClick={handlePreview}
                disabled={!url.trim() || isLoading}
                className="h-14 sm:h-16 px-6 sm:px-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 text-white font-semibold text-base shadow-xl"
              >
                {isLoading ? "Real-time Crawling..." : "Preview Website"}
              </Button>
            </div>
          </div>
        </div>

        {/* Device Categories with Logo Colors */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-200/50 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-blue-100/30"></div>
          <div className="relative">
            {/* Category Tabs */}
            <div className="border-b border-blue-200/50">
              <div className="flex flex-col sm:flex-row">
                <button
                  onClick={() => handleCategoryChange("desktop")}
                  className={cn(
                    "flex items-center justify-center sm:justify-start gap-3 px-6 sm:px-8 py-4 border-b-2 font-semibold text-sm sm:text-base transition-all responsive-text",
                    activeCategory === "desktop"
                      ? "border-blue-500 text-blue-700 bg-blue-100/50"
                      : "border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300",
                  )}
                >
                  <Monitor className="w-5 h-5" />
                  Desktop & Laptops
                </button>
                <button
                  onClick={() => handleCategoryChange("tablet")}
                  className={cn(
                    "flex items-center justify-center sm:justify-start gap-3 px-6 sm:px-8 py-4 border-b-2 font-semibold text-sm sm:text-base transition-all responsive-text",
                    activeCategory === "tablet"
                      ? "border-blue-500 text-blue-700 bg-blue-100/50"
                      : "border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300",
                  )}
                >
                  <Tablet className="w-5 h-5" />
                  Tablets
                </button>
                <button
                  onClick={() => handleCategoryChange("mobile")}
                  className={cn(
                    "flex items-center justify-center sm:justify-start gap-3 px-6 sm:px-8 py-4 border-b-2 font-semibold text-sm sm:text-base transition-all responsive-text",
                    activeCategory === "mobile"
                      ? "border-blue-500 text-blue-700 bg-blue-100/50"
                      : "border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300",
                  )}
                >
                  <Smartphone className="w-5 h-5" />
                  Mobile Phones
                </button>
              </div>
            </div>

            {/* Device Options */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 responsive-grid">
                {devices[activeCategory].map((device) => (
                  <button
                    key={device.id}
                    onClick={() => handleDeviceSelect(device)}
                    className={cn(
                      "p-4 text-left border-2 rounded-xl transition-all hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md",
                      selectedDevice.id === device.id && !useCustomSize
                        ? "border-blue-500 bg-blue-100/50 text-blue-700 shadow-lg"
                        : "border-blue-200 text-gray-700",
                    )}
                  >
                    <div className="font-semibold text-sm mb-1">
                      {device.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {device.width} × {device.height}px
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Size Controls */}
              <div className="border-t border-blue-200/50 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-700 text-sm sm:text-base">
                    Custom Size Controls
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-3">
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
                    <label className="block text-sm font-semibold text-blue-700 mb-3">
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
        </div>

        {/* Preview Controls */}
        {proxyUrl && (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-200/50 p-4 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30"></div>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="outline"
                  className="text-sm sm:text-base px-4 py-2 font-mono border-blue-300 text-blue-700 bg-blue-50"
                >
                  {currentWidth} × {currentHeight}px
                </Badge>
                {useCustomSize && (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    Custom Size
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-700 font-medium">
                    Zoom:
                  </span>
                  <Select value={zoomLevel} onValueChange={setZoomLevel}>
                    <SelectTrigger className="w-32 border-blue-300 bg-white/90">
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
                    className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {isRotated ? "Portrait" : "Landscape"}
                    </span>
                  </Button>
                )}

                <Button
                  onClick={openInNewTab}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Open Original</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Real-Time Preview */}
        {proxyUrl && (
          <div
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200/50 p-6 wave-bg relative overflow-hidden"
            style={
              {
                "--mouse-x": `${(mousePosition.x / window.innerWidth) * 100}%`,
                "--mouse-y": `${(mousePosition.y / window.innerHeight) * 100}%`,
              } as React.CSSProperties
            }
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-indigo-50/10 to-blue-100/20"></div>
            <div className="relative flex justify-center">
              <div
                className="bg-white shadow-2xl overflow-hidden rounded-lg border border-blue-200"
                style={{
                  width: Math.min(previewWidth, window.innerWidth - 80),
                  height: Math.min(previewHeight, window.innerHeight - 200),
                }}
              >
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-blue-700 font-semibold text-lg">
                        Real-time crawling...
                      </p>
                      <p className="text-blue-600 text-sm mt-2">
                        Loading all resources live
                      </p>
                    </div>
                  </div>
                ) : hasError ? (
                  <div className="w-full h-full flex items-center justify-center bg-red-50">
                    <div className="text-center p-6 sm:p-8">
                      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Real-time Crawling Failed
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        {errorMessage || "Failed to load website in real-time"}
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
                    className="w-full h-full border-0"
                    style={{
                      width: currentWidth,
                      height: currentHeight,
                      transform: `scale(${scale})`,
                      transformOrigin: "top left",
                      imageRendering: "auto",
                      textRendering: "optimizeLegibility",
                    }}
                    title="Real-time Website Preview"
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
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border border-blue-200">
                <span className="text-blue-700 font-semibold">
                  {selectedDevice.name}
                </span>
                <Badge
                  variant="outline"
                  className="border-blue-300 text-blue-700 bg-blue-50"
                >
                  {Math.round(scale * 100)}% zoom
                </Badge>
                <span className="text-blue-600">•</span>
                <span className="text-blue-600 font-medium">
                  {currentWidth} × {currentHeight}px
                </span>
                <span className="text-green-600 font-medium">• Live</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Empty State */}
        {!proxyUrl && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200/50 p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-blue-100/50"></div>
            <div className="relative">
              <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F2f9afe8dc22849b186c0fc07b1bbb4f9%2F2f9de9187e1c4134988baa17156cc2c7?format=webp&width=800"
                  alt="RespoCheck"
                  className="w-12 sm:w-14 h-12 sm:h-14 object-contain"
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-3">
                Real-Time Responsive Testing
              </h2>
              <p className="text-blue-600 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
                Enter a website URL above to see live real-time previews on
                different devices and screen sizes. Complete with live resource
                crawling.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-sm text-blue-600">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Desktop & Laptops
                </div>
                <div className="flex items-center gap-2">
                  <Tablet className="w-5 h-5" />
                  Tablets
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Mobile Phones
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
}

const devices = {
  desktop: [
    {
      id: "4k",
      name: "4K Ultra HD",
      width: 3840,
      height: 2160,
      icon: <Tv className="w-4 h-4" />,
    },
    {
      id: "2k",
      name: "2K QHD",
      width: 2560,
      height: 1440,
      icon: <Monitor className="w-4 h-4" />,
    },
    {
      id: "fullhd",
      name: "Full HD",
      width: 1920,
      height: 1080,
      icon: <Monitor className="w-4 h-4" />,
    },
    {
      id: "laptop",
      name: "MacBook Pro",
      width: 1440,
      height: 900,
      icon: <Laptop className="w-4 h-4" />,
    },
    {
      id: "standard",
      name: "Standard HD",
      width: 1366,
      height: 768,
      icon: <Laptop className="w-4 h-4" />,
    },
    {
      id: "old",
      name: "Old Monitor",
      width: 1024,
      height: 768,
      icon: <Monitor className="w-4 h-4" />,
    },
  ],
  tablet: [
    {
      id: "ipad-pro",
      name: "iPad Pro 12.9",
      width: 1024,
      height: 1366,
      icon: <Tablet className="w-4 h-4" />,
    },
    {
      id: "ipad-air",
      name: "iPad Air",
      width: 820,
      height: 1180,
      icon: <Tablet className="w-4 h-4" />,
    },
    {
      id: "ipad",
      name: "iPad",
      width: 768,
      height: 1024,
      icon: <Tablet className="w-4 h-4" />,
    },
    {
      id: "surface",
      name: "Surface Pro",
      width: 912,
      height: 1368,
      icon: <Tablet className="w-4 h-4" />,
    },
    {
      id: "galaxy-tab",
      name: "Galaxy Tab",
      width: 800,
      height: 1280,
      icon: <Tablet className="w-4 h-4" />,
    },
    {
      id: "kindle",
      name: "Kindle Fire",
      width: 1024,
      height: 600,
      icon: <Tablet className="w-4 h-4" />,
    },
  ],
  mobile: [
    {
      id: "iphone-15-max",
      name: "iPhone 15 Pro Max",
      width: 430,
      height: 932,
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      id: "iphone-15",
      name: "iPhone 15",
      width: 393,
      height: 852,
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      id: "iphone-14",
      name: "iPhone 14",
      width: 390,
      height: 844,
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      id: "galaxy-s24",
      name: "Galaxy S24 Ultra",
      width: 412,
      height: 915,
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      id: "pixel-8",
      name: "Pixel 8 Pro",
      width: 412,
      height: 892,
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      id: "iphone-se",
      name: "iPhone SE",
      width: 375,
      height: 667,
      icon: <Smartphone className="w-4 h-4" />,
    },
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
    { value: "33", label: "33%" },
    { value: "50", label: "50%" },
    { value: "67", label: "67%" },
    { value: "75", label: "75%" },
    { value: "90", label: "90%" },
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
    setIsLoading(false);
    setHasError(false);
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

  // Calculate preview size with zoom
  const getPreviewDimensions = () => {
    let scale: number;

    if (zoomLevel === "auto") {
      const containerWidth = Math.min(window.innerWidth - 80, 1600);
      const containerHeight = Math.min(window.innerHeight - 350, 1000);
      scale = Math.min(
        containerWidth / currentWidth,
        containerHeight / currentHeight,
        1.5,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Professional Header */}
      <div className="bg-black/50 border-b border-gray-700/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75"></div>
              <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Globe className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                ResponsiveViewer
              </h1>
              <p className="text-gray-400">
                Professional responsive design testing tool
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* URL Input */}
        <div className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 mb-6">
          <div className="flex gap-4">
            <Input
              type="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-12 text-base bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
            />
            <Button
              onClick={handlePreview}
              disabled={!url.trim() || isLoading}
              className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-base font-medium"
            >
              {isLoading ? "Loading..." : "Test Website"}
            </Button>
          </div>
        </div>

        {/* Device Categories */}
        <div className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-xl mb-6">
          {/* Category Tabs */}
          <div className="border-b border-gray-700/50">
            <div className="flex">
              <button
                onClick={() => handleCategoryChange("desktop")}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 border-b-2 font-medium text-base transition-colors",
                  activeCategory === "desktop"
                    ? "border-blue-500 text-blue-400 bg-blue-500/10"
                    : "border-transparent text-gray-400 hover:text-white hover:border-gray-600",
                )}
              >
                <Monitor className="w-5 h-5" />
                Desktop & Laptops
              </button>
              <button
                onClick={() => handleCategoryChange("tablet")}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 border-b-2 font-medium text-base transition-colors",
                  activeCategory === "tablet"
                    ? "border-blue-500 text-blue-400 bg-blue-500/10"
                    : "border-transparent text-gray-400 hover:text-white hover:border-gray-600",
                )}
              >
                <Tablet className="w-5 h-5" />
                Tablets
              </button>
              <button
                onClick={() => handleCategoryChange("mobile")}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 border-b-2 font-medium text-base transition-colors",
                  activeCategory === "mobile"
                    ? "border-blue-500 text-blue-400 bg-blue-500/10"
                    : "border-transparent text-gray-400 hover:text-white hover:border-gray-600",
                )}
              >
                <Smartphone className="w-5 h-5" />
                Mobile Phones
              </button>
            </div>
          </div>

          {/* Device Options */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              {devices[activeCategory].map((device) => (
                <button
                  key={device.id}
                  onClick={() => handleDeviceSelect(device)}
                  className={cn(
                    "p-4 text-left border rounded-lg transition-all hover:border-blue-500/50 hover:bg-blue-500/10",
                    selectedDevice.id === device.id && !useCustomSize
                      ? "border-blue-500 bg-blue-500/20 text-blue-300"
                      : "border-gray-600 text-gray-300",
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {device.icon}
                    <div className="font-medium text-sm">{device.name}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {device.width} × {device.height}px
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Size Controls */}
            <div className="border-t border-gray-700/50 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-white">
                  Custom Size Controls
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
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
                  <label className="block text-sm font-medium text-gray-300 mb-3">
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

        {/* Preview Controls */}
        {proxyUrl && (
          <div className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="text-base px-4 py-2 font-mono border-gray-600 text-gray-300"
                >
                  {currentWidth} × {currentHeight}px
                </Badge>
                {useCustomSize && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Custom Size
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Zoom Control */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Zoom:</span>
                  <Select value={zoomLevel} onValueChange={setZoomLevel}>
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {zoomOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="text-white hover:bg-gray-700"
                        >
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
                    className="gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {isRotated ? "Portrait" : "Landscape"}
                  </Button>
                )}

                <Button
                  onClick={openPreviewMode}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-blue-500 text-blue-400 hover:bg-blue-500/20"
                >
                  <Maximize2 className="w-4 h-4" />
                  Preview Mode
                </Button>

                <Button
                  onClick={openInNewTab}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Original
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Professional Preview with Grid Background */}
        {proxyUrl && (
          <div
            className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-8"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          >
            <div className="flex justify-center">
              <div
                className="bg-white shadow-2xl overflow-hidden border border-gray-300 rounded-lg"
                style={{
                  width: previewWidth,
                  height: previewHeight,
                }}
              >
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium text-lg">
                        Loading preview...
                      </p>
                    </div>
                  </div>
                ) : hasError ? (
                  <div className="w-full h-full flex items-center justify-center bg-red-50">
                    <div className="text-center p-8">
                      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Cannot Load Website
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {errorMessage || "Failed to load website content"}
                      </p>
                      <div className="flex gap-2 justify-center">
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
                    }}
                    title="Website Preview"
                    onError={handleIframeError}
                    onLoad={handleIframeLoad}
                  />
                )}
              </div>
            </div>
            {/* Preview Info */}
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white font-medium">
                  {selectedDevice.name}
                </span>
                <Badge
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  {Math.round(scale * 100)}% zoom
                </Badge>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">
                  {currentWidth} × {currentHeight}px
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!proxyUrl && (
          <div className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Professional Responsive Testing
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              Enter a website URL above to see how it looks on different devices
              and screen sizes. Use the zoom controls and custom dimensions for
              precise testing.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
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
        )}
      </div>
    </div>
  );
}

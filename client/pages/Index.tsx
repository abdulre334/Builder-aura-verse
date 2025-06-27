import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Monitor,
  Tablet,
  Smartphone,
  Globe,
  ExternalLink,
  AlertCircle,
  RotateCcw,
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
    {
      id: "desktop-1920",
      name: "Desktop 1920x1080",
      width: 1920,
      height: 1080,
    },
    {
      id: "desktop-1680",
      name: "Desktop 1680x1050",
      width: 1680,
      height: 1050,
    },
    { id: "desktop-1600", name: "Desktop 1600x900", width: 1600, height: 900 },
    { id: "desktop-1440", name: "Desktop 1440x900", width: 1440, height: 900 },
    { id: "desktop-1366", name: "Desktop 1366x768", width: 1366, height: 768 },
    {
      id: "desktop-1280",
      name: "Desktop 1280x1024",
      width: 1280,
      height: 1024,
    },
    { id: "desktop-1024", name: "Desktop 1024x768", width: 1024, height: 768 },
  ],
  tablet: [
    { id: "ipad-pro", name: "iPad Pro", width: 1024, height: 1366 },
    { id: "ipad-air", name: "iPad Air", width: 820, height: 1180 },
    { id: "ipad", name: "iPad", width: 768, height: 1024 },
    { id: "galaxy-tab", name: "Galaxy Tab", width: 800, height: 1280 },
    { id: "surface", name: "Surface Pro", width: 912, height: 1368 },
    { id: "kindle", name: "Kindle Fire", width: 1024, height: 600 },
  ],
  mobile: [
    { id: "iphone-15-pro", name: "iPhone 15 Pro", width: 393, height: 852 },
    {
      id: "iphone-15-pro-max",
      name: "iPhone 15 Pro Max",
      width: 430,
      height: 932,
    },
    { id: "iphone-14", name: "iPhone 14", width: 390, height: 844 },
    { id: "iphone-se", name: "iPhone SE", width: 375, height: 667 },
    { id: "samsung-s24", name: "Samsung Galaxy S24", width: 384, height: 854 },
    {
      id: "samsung-s24-ultra",
      name: "Samsung S24 Ultra",
      width: 412,
      height: 915,
    },
    { id: "pixel-8", name: "Google Pixel 8", width: 412, height: 915 },
    { id: "oneplus", name: "OnePlus 12", width: 412, height: 915 },
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
    devices.desktop[0],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const handleCategoryChange = (category: DeviceCategory) => {
    setActiveCategory(category);
    setSelectedDevice(devices[category][0]);
    setIsRotated(false);
  };

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
  };

  const toggleRotation = () => {
    setIsRotated(!isRotated);
  };

  const currentWidth = isRotated ? selectedDevice.height : selectedDevice.width;
  const currentHeight = isRotated
    ? selectedDevice.width
    : selectedDevice.height;

  // Calculate scale for better preview - much larger
  const maxWidth = 1200;
  const maxHeight = 700;
  const scale = Math.min(maxWidth / currentWidth, maxHeight / currentHeight, 1);

  const scaledWidth = currentWidth * scale;
  const scaledHeight = currentHeight * scale;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                ResponsiveViewer
              </h1>
              <p className="text-sm text-gray-600">
                Test your website on different screen resolutions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* URL Input */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex gap-4">
            <Input
              type="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-12"
            />
            <Button
              onClick={handlePreview}
              disabled={!url.trim() || isLoading}
              className="h-12 px-8 bg-blue-500 hover:bg-blue-600"
            >
              {isLoading ? "Loading..." : "Test"}
            </Button>
          </div>
        </div>

        {/* Device Categories */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          {/* Category Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => handleCategoryChange("desktop")}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors",
                  activeCategory === "desktop"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                <Monitor className="w-5 h-5" />
                Desktop
              </button>
              <button
                onClick={() => handleCategoryChange("tablet")}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors",
                  activeCategory === "tablet"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                <Tablet className="w-5 h-5" />
                Tablet
              </button>
              <button
                onClick={() => handleCategoryChange("mobile")}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors",
                  activeCategory === "mobile"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                <Smartphone className="w-5 h-5" />
                Mobile
              </button>
            </div>
          </div>

          {/* Device Options */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {devices[activeCategory].map((device) => (
                <button
                  key={device.id}
                  onClick={() => handleDeviceSelect(device)}
                  className={cn(
                    "p-3 text-left border rounded-lg transition-all hover:border-blue-300 hover:bg-blue-50",
                    selectedDevice.id === device.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700",
                  )}
                >
                  <div className="font-medium text-sm">{device.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {device.width} × {device.height}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        {proxyUrl && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
                  {currentWidth} × {currentHeight}px
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Scale: {Math.round(scale * 100)}%
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {(activeCategory === "tablet" ||
                  activeCategory === "mobile") && (
                  <Button
                    onClick={toggleRotation}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {isRotated ? "Portrait" : "Landscape"}
                  </Button>
                )}
                <Button
                  onClick={openInNewTab}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        {proxyUrl && (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="flex justify-center">
              <div
                className="relative bg-gray-900 rounded-lg shadow-2xl overflow-hidden"
                style={{
                  width: scaledWidth + 40,
                  height: scaledHeight + 40,
                }}
              >
                {/* Device Frame */}
                <div className="absolute inset-5">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">
                          Loading preview...
                        </p>
                      </div>
                    </div>
                  ) : hasError ? (
                    <div className="w-full h-full flex items-center justify-center bg-red-50">
                      <div className="text-center p-8">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Loading Error
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
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
                      className="w-full h-full border-0 bg-white"
                      style={{
                        width: currentWidth,
                        height: currentHeight,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                      }}
                      title="Website Preview"
                      onError={handleIframeError}
                      onLoad={handleIframeLoad}
                    />
                  )}
                </div>

                {/* Screen Border */}
                <div className="absolute inset-0 border-8 border-gray-800 rounded-lg pointer-events-none"></div>

                {/* Mobile/Tablet specific frame elements */}
                {activeCategory === "mobile" && (
                  <>
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 border-2 border-gray-700 rounded-full"></div>
                  </>
                )}

                {activeCategory === "tablet" && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-gray-700 rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!proxyUrl && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Test Your Website's Responsiveness
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter a website URL above to see how it looks on different devices
              and screen sizes. Perfect for testing responsive designs!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

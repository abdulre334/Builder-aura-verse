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

export default function Preview() {
  const [searchParams] = useSearchParams();
  const [currentUrl, setCurrentUrl] = useState("");
  const [proxyUrl, setProxyUrl] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<DeviceCategory>("desktop");
  const [selectedDevice, setSelectedDevice] = useState<Device>(
    devices.desktop[2],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const [zoomLevel, setZoomLevel] = useState("100");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const zoomOptions = [
    { value: "25", label: "25%" },
    { value: "50", label: "50%" },
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
    const category = searchParams.get("category") as DeviceCategory;

    if (url && width && height) {
      setCurrentUrl(url);
      const proxyUrlFormatted = `/api/proxy?url=${encodeURIComponent(url)}`;
      setProxyUrl(proxyUrlFormatted);

      if (category) {
        setActiveCategory(category);
        const device = devices[category].find((d) => d.name === deviceName);
        if (device) {
          setSelectedDevice(device);
        } else {
          setSelectedDevice({
            id: "custom",
            name: `Custom (${width}×${height})`,
            width: parseInt(width),
            height: parseInt(height),
          });
        }
      }
    }
  }, [searchParams]);

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

  const goHome = () => {
    window.location.href = "/";
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

  // Calculate preview size with zoom
  const scale = parseInt(zoomLevel) / 100;
  const previewWidth = currentWidth * scale;
  const previewHeight = currentHeight * scale;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">ResponsiveViewer</h1>
              <p className="text-sm text-gray-600">Preview Mode</p>
            </div>
          </div>
          <Button
            onClick={goHome}
            variant="outline"
            size="sm"
            className="w-full gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Device Categories */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">
              Device Categories
            </h3>
            <div className="space-y-2 mb-6">
              <button
                onClick={() => handleCategoryChange("desktop")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                  activeCategory === "desktop"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50",
                )}
              >
                <Monitor className="w-4 h-4" />
                Desktop & Laptops
              </button>
              <button
                onClick={() => handleCategoryChange("tablet")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                  activeCategory === "tablet"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50",
                )}
              >
                <Tablet className="w-4 h-4" />
                Tablets
              </button>
              <button
                onClick={() => handleCategoryChange("mobile")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                  activeCategory === "mobile"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50",
                )}
              >
                <Smartphone className="w-4 h-4" />
                Mobile Phones
              </button>
            </div>

            <h3 className="font-medium text-gray-900 mb-3">
              {activeCategory === "desktop"
                ? "Desktop & Laptops"
                : activeCategory === "tablet"
                  ? "Tablets"
                  : "Mobile Phones"}
            </h3>
            <div className="space-y-2 mb-6">
              {devices[activeCategory].map((device) => (
                <button
                  key={device.id}
                  onClick={() => handleDeviceSelect(device)}
                  className={cn(
                    "w-full p-3 text-left border rounded-lg transition-all hover:border-blue-300 hover:bg-blue-50",
                    selectedDevice.id === device.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700",
                  )}
                >
                  <div className="font-medium text-sm mb-1">{device.name}</div>
                  <div className="text-xs text-gray-500">
                    {device.width} × {device.height}px
                  </div>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoom Level
                </label>
                <Select value={zoomLevel} onValueChange={setZoomLevel}>
                  <SelectTrigger className="w-full">
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

              {(activeCategory === "tablet" || activeCategory === "mobile") && (
                <Button
                  onClick={toggleRotation}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  {isRotated ? "Portrait" : "Landscape"}
                </Button>
              )}

              <Button
                onClick={openInNewTab}
                variant="outline"
                size="sm"
                className="w-full gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open Original
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-center">
            <Badge variant="outline" className="font-mono">
              {currentWidth} × {currentHeight}px
            </Badge>
            <p className="text-xs text-gray-500 mt-2">
              Showing at {zoomLevel}%
            </p>
          </div>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-medium text-gray-900">
                {selectedDevice.name}
              </h2>
              <Badge variant="outline">{activeCategory}</Badge>
            </div>
            <div className="text-sm text-gray-500">
              {currentUrl && new URL(currentUrl).hostname}
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-100">
          {proxyUrl ? (
            <div
              className="bg-white shadow-xl overflow-hidden border border-gray-300"
              style={{
                width: previewWidth,
                height: previewHeight,
              }}
            >
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">
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
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No Preview Available
              </h3>
              <p className="text-gray-600">
                Please return to home to enter a website URL.
              </p>
              <Button onClick={goHome} className="mt-4">
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

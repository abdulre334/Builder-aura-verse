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
  Globe,
  Maximize2,
  Minimize2,
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
    devices.desktop[2],
  );
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const [zoomLevel, setZoomLevel] = useState("auto");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
      const proxyUrlFormatted = `/api/proxy?url=${encodeURIComponent(formattedUrl)}&t=${Date.now()}`;
      setProxyUrl(proxyUrlFormatted);

      // Ultra-fast loading - stop loading after 2 seconds max
      setTimeout(() => {
        setIsLoading(false);
        setHasError(false);
      }, 2000);
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
    // Ultra-fast loading - stop loading immediately
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
    setUseCustomSize(false);

    // Auto-reload when switching categories
    if (currentUrl) {
      setIsLoading(true);
      setHasError(false);
      const freshProxyUrl = `/api/proxy?url=${encodeURIComponent(currentUrl)}&t=${Date.now()}`;
      setProxyUrl(freshProxyUrl);
      setTimeout(() => {
        setIsLoading(false);
        setHasError(false);
      }, 1500);
    }
  };

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setCustomWidth(device.width);
    setCustomHeight(device.height);
    setUseCustomSize(false);

    // Auto-reload when switching devices
    if (currentUrl) {
      setIsLoading(true);
      setHasError(false);
      const freshProxyUrl = `/api/proxy?url=${encodeURIComponent(currentUrl)}&t=${Date.now()}`;
      setProxyUrl(freshProxyUrl);
      setTimeout(() => {
        setIsLoading(false);
        setHasError(false);
      }, 1500);
    }
  };

  const toggleRotation = () => {
    setIsRotated(!isRotated);

    // Auto-reload when rotating
    if (currentUrl) {
      setIsLoading(true);
      setHasError(false);
      const freshProxyUrl = `/api/proxy?url=${encodeURIComponent(currentUrl)}&t=${Date.now()}`;
      setProxyUrl(freshProxyUrl);
      setTimeout(() => {
        setIsLoading(false);
        setHasError(false);
      }, 1500);
    }
  };

  const enableCustomSize = () => {
    setUseCustomSize(true);

    // Auto-reload when using custom size
    if (currentUrl) {
      setIsLoading(true);
      setHasError(false);
      const freshProxyUrl = `/api/proxy?url=${encodeURIComponent(currentUrl)}&t=${Date.now()}`;
      setProxyUrl(freshProxyUrl);
      setTimeout(() => {
        setIsLoading(false);
        setHasError(false);
      }, 1500);
    }
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

  const getPreviewDimensions = () => {
    let scale: number;
    const sidebarWidth = sidebarCollapsed ? 60 : 320;
    const availableWidth = window.innerWidth - sidebarWidth - 40;
    const availableHeight = window.innerHeight - 140;

    if (zoomLevel === "auto") {
      scale = Math.min(
        availableWidth / currentWidth,
        availableHeight / currentHeight,
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
    <div className="h-screen flex bg-slate-50">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-lg",
          sidebarCollapsed ? "w-16" : "w-80",
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <a
                href="https://respocheck.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center flex-1"
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F2f9afe8dc22849b186c0fc07b1bbb4f9%2F2f9de9187e1c4134988baa17156cc2c7?format=webp&width=800"
                  alt="Website Logo"
                  className="w-16 h-16 object-contain hover:scale-105 transition-transform cursor-pointer"
                />
              </a>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2"
            >
              {sidebarCollapsed ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* URL Input */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-slate-200">
            <div className="space-y-3">
              <Input
                type="url"
                placeholder="Enter website URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-10 text-sm border-blue-200 focus:border-blue-400"
              />
              <Button
                onClick={handlePreview}
                disabled={!url.trim() || isLoading}
                className="w-full h-9 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm"
              >
                {isLoading ? "Loading..." : "Preview"}
              </Button>
            </div>
          </div>
        )}

        {/* Device Categories */}
        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto">
            {/* Desktop */}
            <div className="border-b border-slate-100">
              <button
                onClick={() => handleCategoryChange("desktop")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors",
                  activeCategory === "desktop"
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                    : "text-slate-700",
                )}
              >
                <Monitor className="w-5 h-5" />
                <span className="font-medium">Desktop</span>
              </button>
              {activeCategory === "desktop" && (
                <div className="bg-slate-50">
                  {devices.desktop.map((device) => (
                    <button
                      key={device.id}
                      onClick={() => handleDeviceSelect(device)}
                      className={cn(
                        "w-full px-8 py-2 text-left text-sm hover:bg-blue-50 transition-colors",
                        selectedDevice.id === device.id && !useCustomSize
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-slate-600",
                      )}
                    >
                      <div className="truncate">{device.name}</div>
                      <div className="text-xs text-slate-500">
                        {device.width} × {device.height}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tablet */}
            <div className="border-b border-slate-100">
              <button
                onClick={() => handleCategoryChange("tablet")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors",
                  activeCategory === "tablet"
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                    : "text-slate-700",
                )}
              >
                <Tablet className="w-5 h-5" />
                <span className="font-medium">Tablet</span>
              </button>
              {activeCategory === "tablet" && (
                <div className="bg-slate-50">
                  {devices.tablet.map((device) => (
                    <button
                      key={device.id}
                      onClick={() => handleDeviceSelect(device)}
                      className={cn(
                        "w-full px-8 py-2 text-left text-sm hover:bg-blue-50 transition-colors",
                        selectedDevice.id === device.id && !useCustomSize
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-slate-600",
                      )}
                    >
                      <div className="truncate">{device.name}</div>
                      <div className="text-xs text-slate-500">
                        {device.width} × {device.height}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile */}
            <div className="border-b border-slate-100">
              <button
                onClick={() => handleCategoryChange("mobile")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors",
                  activeCategory === "mobile"
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                    : "text-slate-700",
                )}
              >
                <Smartphone className="w-5 h-5" />
                <span className="font-medium">Mobile</span>
              </button>
              {activeCategory === "mobile" && (
                <div className="bg-slate-50">
                  {devices.mobile.map((device) => (
                    <button
                      key={device.id}
                      onClick={() => handleDeviceSelect(device)}
                      className={cn(
                        "w-full px-8 py-2 text-left text-sm hover:bg-blue-50 transition-colors",
                        selectedDevice.id === device.id && !useCustomSize
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-slate-600",
                      )}
                    >
                      <div className="truncate">{device.name}</div>
                      <div className="text-xs text-slate-500">
                        {device.width} × {device.height}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Size */}
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Settings className="w-4 h-4" />
                Custom Size
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
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
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 truncate max-w-md">
                    {currentUrl}
                  </span>
                </div>
              )}
              {proxyUrl && (
                <Badge variant="outline" className="text-xs">
                  {currentWidth} × {currentHeight}px
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {proxyUrl && (
                <>
                  <Select value={zoomLevel} onValueChange={setZoomLevel}>
                    <SelectTrigger className="w-24 h-8 text-xs">
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
                  {(activeCategory === "tablet" ||
                    activeCategory === "mobile") && (
                    <Button
                      onClick={toggleRotation}
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      {isRotated ? "Portrait" : "Landscape"}
                    </Button>
                  )}
                  <Button
                    onClick={openInNewTab}
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-slate-100 p-4 overflow-auto">
          {proxyUrl ? (
            <div className="flex justify-center items-start min-h-full">
              <div
                className="bg-white shadow-lg rounded-lg overflow-hidden"
                style={{
                  width: Math.min(
                    previewWidth,
                    window.innerWidth - (sidebarCollapsed ? 120 : 360),
                  ),
                  height: Math.min(previewHeight, window.innerHeight - 180),
                }}
              >
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-blue-700 font-medium">
                        Real-time crawling...
                      </p>
                      <p className="text-slate-500 text-sm">
                        Loading all resources
                      </p>
                    </div>
                  </div>
                ) : hasError ? (
                  <div className="w-full h-full flex items-center justify-center bg-red-50">
                    <div className="text-center p-6">
                      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-slate-800 mb-2">
                        Loading Failed
                      </h3>
                      <p className="text-slate-600 mb-4 text-sm">
                        {errorMessage || "Failed to load website"}
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={handlePreview}
                          variant="outline"
                          size="sm"
                        >
                          Retry
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
                    }}
                    title="Website Preview"
                    onError={handleIframeError}
                    onLoad={handleIframeLoad}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F2f9afe8dc22849b186c0fc07b1bbb4f9%2F2f9de9187e1c4134988baa17156cc2c7?format=webp&width=800"
                    alt="RespoCheck"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                  Real-Time Responsive Testing
                </h2>
                <p className="text-slate-600 max-w-md mx-auto">
                  Enter a website URL in the sidebar to see live previews across
                  different devices and screen sizes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Status Bar */}
        {proxyUrl && (
          <div className="bg-white border-t border-slate-200 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <span>Device: {selectedDevice.name}</span>
                <span>Scale: {Math.round(scale * 100)}%</span>
                {useCustomSize && (
                  <Badge variant="secondary" className="text-xs">
                    Custom
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live Preview</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

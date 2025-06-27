import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  Frame,
  ExternalLink,
  AlertCircle,
  Zap,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Device {
  id: string;
  name: string;
  category: "desktop" | "laptop" | "tablet" | "mobile";
  width: number;
  height: number;
  icon: React.ReactNode;
  popular?: boolean;
}

const devices: Device[] = [
  // Desktop Monitors
  {
    id: "4k-monitor",
    name: "4K Monitor",
    category: "desktop",
    width: 3840,
    height: 2160,
    icon: <Monitor className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "2k-monitor",
    name: "2K Monitor",
    category: "desktop",
    width: 2560,
    height: 1440,
    icon: <Monitor className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "full-hd",
    name: "Full HD (1080p)",
    category: "desktop",
    width: 1920,
    height: 1080,
    icon: <Monitor className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "hd-ready",
    name: "HD Ready",
    category: "desktop",
    width: 1366,
    height: 768,
    icon: <Monitor className="w-4 h-4" />,
  },
  {
    id: "old-monitor",
    name: "Standard Monitor",
    category: "desktop",
    width: 1024,
    height: 768,
    icon: <Monitor className="w-4 h-4" />,
  },

  // Laptops
  {
    id: "macbook-pro-16",
    name: 'MacBook Pro 16"',
    category: "laptop",
    width: 3456,
    height: 2234,
    icon: <Monitor className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "macbook-pro-14",
    name: 'MacBook Pro 14"',
    category: "laptop",
    width: 3024,
    height: 1964,
    icon: <Monitor className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "macbook-air-13",
    name: 'MacBook Air 13"',
    category: "laptop",
    width: 2560,
    height: 1664,
    icon: <Monitor className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "surface-laptop",
    name: "Surface Laptop",
    category: "laptop",
    width: 2256,
    height: 1504,
    icon: <Monitor className="w-4 h-4" />,
  },
  {
    id: "chromebook",
    name: "Chromebook",
    category: "laptop",
    width: 1366,
    height: 768,
    icon: <Monitor className="w-4 h-4" />,
  },

  // Tablets
  {
    id: "ipad-pro-12-9",
    name: 'iPad Pro 12.9"',
    category: "tablet",
    width: 1024,
    height: 1366,
    icon: <Tablet className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "ipad-pro-11",
    name: 'iPad Pro 11"',
    category: "tablet",
    width: 834,
    height: 1194,
    icon: <Tablet className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    category: "tablet",
    width: 820,
    height: 1180,
    icon: <Tablet className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "ipad",
    name: "iPad",
    category: "tablet",
    width: 810,
    height: 1080,
    icon: <Tablet className="w-4 h-4" />,
  },
  {
    id: "surface-pro",
    name: "Surface Pro",
    category: "tablet",
    width: 1368,
    height: 912,
    icon: <Tablet className="w-4 h-4" />,
  },
  {
    id: "galaxy-tab-s9",
    name: "Galaxy Tab S9",
    category: "tablet",
    width: 1600,
    height: 2560,
    icon: <Tablet className="w-4 h-4" />,
  },

  // Mobile Phones
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    category: "mobile",
    width: 430,
    height: 932,
    icon: <Smartphone className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    category: "mobile",
    width: 393,
    height: 852,
    icon: <Smartphone className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    category: "mobile",
    width: 393,
    height: 852,
    icon: <Smartphone className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "iphone-14-pro-max",
    name: "iPhone 14 Pro Max",
    category: "mobile",
    width: 430,
    height: 932,
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    id: "iphone-14",
    name: "iPhone 14",
    category: "mobile",
    width: 390,
    height: 844,
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    id: "iphone-se",
    name: "iPhone SE",
    category: "mobile",
    width: 375,
    height: 667,
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    id: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    category: "mobile",
    width: 412,
    height: 915,
    icon: <Smartphone className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "galaxy-s24",
    name: "Galaxy S24",
    category: "mobile",
    width: 384,
    height: 854,
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    id: "pixel-8-pro",
    name: "Pixel 8 Pro",
    category: "mobile",
    width: 412,
    height: 892,
    icon: <Smartphone className="w-4 h-4" />,
    popular: true,
  },
  {
    id: "pixel-8",
    name: "Pixel 8",
    category: "mobile",
    width: 412,
    height: 915,
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    id: "oneplus-12",
    name: "OnePlus 12",
    category: "mobile",
    width: 412,
    height: 915,
    icon: <Smartphone className="w-4 h-4" />,
  },
];

export default function Index() {
  const [url, setUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [proxyUrl, setProxyUrl] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<Device>(
    devices.find((d) => d.id === "full-hd") || devices[2],
  );
  const [showDeviceFrame, setShowDeviceFrame] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [useCustomDimensions, setUseCustomDimensions] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePreview = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    let formattedUrl = url.trim();

    // Add protocol if missing
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      // Validate URL first
      new URL(formattedUrl);

      setCurrentUrl(formattedUrl);
      const proxyUrlFormatted = `/api/proxy?url=${encodeURIComponent(formattedUrl)}`;
      setProxyUrl(proxyUrlFormatted);

      // Small delay to show loading
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

  const handleDeviceChange = (deviceId: string) => {
    if (deviceId === "custom") {
      setUseCustomDimensions(true);
    } else {
      setUseCustomDimensions(false);
      const device = devices.find((d) => d.id === deviceId);
      if (device) {
        setSelectedDevice(device);
      }
    }
  };

  const handleCustomDimensions = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);

    if (width > 0 && height > 0) {
      setSelectedDevice({
        id: "custom",
        name: `Custom (${width}×${height})`,
        category: "desktop",
        width,
        height,
        icon: <Settings className="w-4 h-4" />,
      });
    }
  };

  const getScaleForPreview = () => {
    // Make previews much bigger - use more screen space
    const containerWidth = Math.min(window.innerWidth - 80, 1400);
    const containerHeight = Math.min(window.innerHeight - 280, 900);

    const scaleX = containerWidth / selectedDevice.width;
    const scaleY = containerHeight / selectedDevice.height;

    // Increased minimum scale from 0.8 to allow bigger previews
    return Math.min(scaleX, scaleY, 1.2);
  };

  const scale = getScaleForPreview();
  const scaledWidth = selectedDevice.width * scale;
  const scaledHeight = selectedDevice.height * scale;

  const popularDevices = devices.filter((d) => d.popular);
  const devicesByCategory = {
    desktop: devices.filter((d) => d.category === "desktop"),
    laptop: devices.filter((d) => d.category === "laptop"),
    tablet: devices.filter((d) => d.category === "tablet"),
    mobile: devices.filter((d) => d.category === "mobile"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>

      {/* Header */}
      <div className="relative bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur-lg opacity-75"></div>
                <div className="relative p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  ResponsiveViewer
                </h1>
                <p className="text-gray-400 text-sm">
                  Preview websites across all devices instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* URL Input Section */}
        <div className="mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border-white/20 shadow-2xl">
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  Enter website URL
                </label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20 text-lg"
                    />
                  </div>
                  <Button
                    onClick={handlePreview}
                    disabled={!url.trim() || isLoading}
                    className="h-14 px-8 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg shadow-lg shadow-purple-500/25"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      "Preview"
                    )}
                  </Button>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                {/* Device Selector */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Select Device
                    </label>
                    <Select
                      value={useCustomDimensions ? "custom" : selectedDevice.id}
                      onValueChange={handleDeviceChange}
                    >
                      <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-80">
                        <SelectItem value="custom">
                          <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Custom Dimensions
                          </div>
                        </SelectItem>
                        <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Popular Devices
                        </div>
                        {popularDevices.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            <div className="flex items-center gap-2">
                              {device.icon}
                              <span>{device.name}</span>
                              <Badge variant="secondary" className="ml-auto">
                                {device.width}×{device.height}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Desktop & Monitors
                        </div>
                        {devicesByCategory.desktop.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            <div className="flex items-center gap-2">
                              {device.icon}
                              <span>{device.name}</span>
                              <Badge variant="secondary" className="ml-auto">
                                {device.width}×{device.height}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Laptops
                        </div>
                        {devicesByCategory.laptop.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            <div className="flex items-center gap-2">
                              {device.icon}
                              <span>{device.name}</span>
                              <Badge variant="secondary" className="ml-auto">
                                {device.width}×{device.height}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Tablets
                        </div>
                        {devicesByCategory.tablet.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            <div className="flex items-center gap-2">
                              {device.icon}
                              <span>{device.name}</span>
                              <Badge variant="secondary" className="ml-auto">
                                {device.width}×{device.height}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Mobile Phones
                        </div>
                        {devicesByCategory.mobile.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            <div className="flex items-center gap-2">
                              {device.icon}
                              <span>{device.name}</span>
                              <Badge variant="secondary" className="ml-auto">
                                {device.width}×{device.height}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Dimensions */}
                  {useCustomDimensions && (
                    <div>
                      <label className="block text-white font-medium mb-3">
                        Custom Dimensions
                      </label>
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          placeholder="Width"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                        <span className="flex items-center text-white">×</span>
                        <Input
                          type="number"
                          placeholder="Height"
                          value={customHeight}
                          onChange={(e) => setCustomHeight(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                        <Button
                          onClick={handleCustomDimensions}
                          disabled={!customWidth || !customHeight}
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Controls */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Device Frame Toggle */}
                  <Button
                    variant={showDeviceFrame ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowDeviceFrame(!showDeviceFrame)}
                    className={cn(
                      "h-10 px-4 gap-2 font-medium transition-all",
                      showDeviceFrame
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30",
                    )}
                  >
                    <Frame className="w-4 h-4" />
                    Device Frame
                  </Button>

                  {/* Current dimensions */}
                  <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 flex items-center gap-2">
                    {selectedDevice.icon}
                    {selectedDevice.width} × {selectedDevice.height}px
                  </Badge>

                  {/* Scale info */}
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
                    Scale: {Math.round(scale * 100)}%
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview Section */}
        {proxyUrl && (
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div
                className={cn(
                  "relative transition-all duration-500 ease-out",
                  showDeviceFrame &&
                    selectedDevice.category === "mobile" &&
                    "p-8",
                  showDeviceFrame &&
                    selectedDevice.category === "tablet" &&
                    "p-6",
                )}
                style={{
                  width:
                    scaledWidth +
                    (showDeviceFrame &&
                    (selectedDevice.category === "mobile" ||
                      selectedDevice.category === "tablet")
                      ? 64
                      : 0),
                  height:
                    scaledHeight +
                    (showDeviceFrame &&
                    (selectedDevice.category === "mobile" ||
                      selectedDevice.category === "tablet")
                      ? 64
                      : 0),
                }}
              >
                {/* Device Frame */}
                {showDeviceFrame && selectedDevice.category === "mobile" && (
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl border border-gray-600">
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-20 h-1.5 bg-gray-600 rounded-full"></div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-14 h-14 border-2 border-gray-600 rounded-full bg-gray-800"></div>
                  </div>
                )}

                {showDeviceFrame && selectedDevice.category === "tablet" && (
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600">
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-10 border-2 border-gray-600 rounded-full bg-gray-800"></div>
                  </div>
                )}

                {/* Preview Container */}
                <div
                  className={cn(
                    "bg-white rounded-lg shadow-2xl overflow-hidden relative border border-gray-300",
                    showDeviceFrame &&
                      selectedDevice.category === "mobile" &&
                      "mx-8 my-20 rounded-3xl border-0",
                    showDeviceFrame &&
                      selectedDevice.category === "tablet" &&
                      "mx-6 my-14 rounded-2xl border-0",
                  )}
                  style={{
                    width: scaledWidth,
                    height: scaledHeight,
                  }}
                >
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">
                          Loading preview...
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Fetching website content
                        </p>
                      </div>
                    </div>
                  ) : hasError ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                      <div className="text-center p-8">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Loading Error
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {errorMessage || "Failed to load website content"}
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={handlePreview}
                            variant="outline"
                            className="gap-2"
                          >
                            Try Again
                          </Button>
                          <Button
                            onClick={openInNewTab}
                            className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open Original
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <iframe
                        ref={iframeRef}
                        src={proxyUrl}
                        className="w-full h-full border-0"
                        style={{
                          width: selectedDevice.width,
                          height: selectedDevice.height,
                          transform: `scale(${scale})`,
                          transformOrigin: "top left",
                        }}
                        title="Website Preview"
                        onError={handleIframeError}
                        onLoad={handleIframeLoad}
                      />
                      {/* Overlay for better UX */}
                      <div className="absolute top-4 right-4 z-10">
                        <Button
                          onClick={openInNewTab}
                          size="sm"
                          className="bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!proxyUrl && (
          <div className="text-center py-20">
            <div className="relative mx-auto w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-2xl opacity-50"></div>
              <div className="relative w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Globe className="w-16 h-16 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Preview Any Website
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Enter a website URL above to see how it looks across different
              screen sizes and devices. Choose from the latest devices or set
              custom dimensions.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Desktop & Laptops
              </div>
              <div className="flex items-center gap-2">
                <Tablet className="w-4 h-4" />
                Tablets
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Mobile Phones
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
  Watch,
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
    const availableWidth = window.innerWidth - 80;
    const availableHeight = window.innerHeight - 120;

    const scaleX = availableWidth / currentWidth;
    const scaleY = availableHeight / currentHeight;

    return Math.min(scaleX, scaleY, 1.5);
  };

  const handleIframeError = () => {
    setHasError(true);
    setErrorMessage("Failed to load website");
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    // Wait for all resources to load completely (CSS, images, icons, fonts)
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      try {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;

        // Check if document and all resources are fully loaded
        if (iframeDoc.readyState === "complete") {
          // Extra delay to ensure CSS, fonts, and icons are fully rendered
          setTimeout(() => {
            setIsLoading(false);
            setHasError(false);
          }, 2000); // Longer delay for complete rendering
        } else {
          // Document not ready, wait longer
          setTimeout(() => {
            setIsLoading(false);
            setHasError(false);
          }, 3000);
        }
      } catch (e) {
        // Cross-origin restrictions, use longer timeout
        setTimeout(() => {
          setIsLoading(false);
          setHasError(false);
        }, 3000);
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setHasError(false);
      }, 2500);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black overflow-hidden">
      {/* Professional Header with Device Toolbar */}
      <div className="bg-black/50 border-b border-gray-700/50 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left Side - Logo & Back */}
          <div className="flex items-center gap-6">
            <Button
              onClick={goHome}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold">ResponsiveViewer</h1>
              </div>
            </div>
          </div>

          {/* Center - Device Toolbar */}
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2">
            {devices.map((device) => (
              <Button
                key={device.id}
                onClick={() => handleDeviceSelect(device)}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center gap-1 h-auto p-3 text-xs transition-all",
                  selectedDevice.id === device.id
                    ? "bg-blue-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/10",
                )}
                title={`${device.name} (${device.width}×${device.height})`}
              >
                {device.icon}
                <span className="font-medium">{device.width}</span>
              </Button>
            ))}
          </div>

          {/* Right Side - Controls */}
          <div className="flex items-center gap-4">
            {/* Zoom Control */}
            <div className="flex items-center gap-2">
              <span className="text-gray-300 text-sm">Zoom:</span>
              <Select value={zoomLevel} onValueChange={setZoomLevel}>
                <SelectTrigger className="w-24 h-8 bg-gray-800 border-gray-600 text-white">
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

            {/* Rotation for mobile/tablet */}
            {(selectedDevice.category === "tablet" ||
              selectedDevice.category === "mobile") && (
              <Button
                onClick={toggleRotation}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}

            <Button
              onClick={openInNewTab}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Device Info Bar */}
        <div className="px-6 py-2 bg-gray-800/30 border-t border-gray-700/30">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-gray-300">
              <span className="font-medium text-white">
                {selectedDevice.name}
              </span>
              <Badge
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                {currentWidth} × {currentHeight}px
              </Badge>
              <span>
                {Math.round(scale * 100)}% •{" "}
                {currentUrl && new URL(currentUrl).hostname}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Preview Area with Grid Background */}
      <div
        className="flex-1 flex items-center justify-center p-8 relative overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      >
        {proxyUrl ? (
          <div className="relative">
            {/* Realistic Device Frame */}
            <div
              className={cn(
                "relative overflow-hidden shadow-2xl",
                selectedDevice.category === "mobile" &&
                  "bg-gray-900 rounded-[2.5rem] p-4",
                selectedDevice.category === "tablet" &&
                  "bg-gray-800 rounded-2xl p-3",
                selectedDevice.category === "desktop" &&
                  "bg-gray-700 rounded-lg",
              )}
              style={{
                width:
                  selectedDevice.category === "desktop"
                    ? previewWidth + 20
                    : previewWidth + 40,
                height:
                  selectedDevice.category === "desktop"
                    ? previewHeight + 20
                    : previewHeight + 50,
              }}
            >
              {/* Mobile Device Details */}
              {selectedDevice.category === "mobile" && (
                <>
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-black rounded-full z-20"></div>
                  {/* Home Indicator */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full z-20"></div>
                  {/* Power Button */}
                  <div className="absolute -right-1 top-24 w-1 h-12 bg-gray-600 rounded-l"></div>
                  {/* Volume Buttons */}
                  <div className="absolute -left-1 top-20 w-1 h-8 bg-gray-600 rounded-r"></div>
                  <div className="absolute -left-1 top-32 w-1 h-8 bg-gray-600 rounded-r"></div>
                </>
              )}

              {/* Tablet Device Details */}
              {selectedDevice.category === "tablet" && (
                <>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-12 border-2 border-gray-600 rounded-full bg-gray-800"></div>
                </>
              )}

              {/* Preview Content */}
              <div
                className={cn(
                  "bg-white overflow-hidden relative",
                  selectedDevice.category === "mobile" && "rounded-3xl m-3",
                  selectedDevice.category === "tablet" && "rounded-xl m-2",
                  selectedDevice.category === "desktop" && "rounded m-2",
                )}
                style={{
                  width: previewWidth,
                  height: previewHeight,
                }}
              >
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
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
                      <p className="text-gray-600 mb-4">{errorMessage}</p>
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
                    }}
                    title="Website Preview"
                    onError={handleIframeError}
                    onLoad={handleIframeLoad}
                  />
                )}
              </div>
            </div>

            {/* Professional Info Label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                <div className="text-white text-sm font-medium">
                  {selectedDevice.name}
                </div>
                <div className="text-gray-300 text-xs">
                  {currentWidth} × {currentHeight}px • {Math.round(scale * 100)}
                  %
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Preview Available
            </h3>
            <p className="text-gray-400 mb-6">
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

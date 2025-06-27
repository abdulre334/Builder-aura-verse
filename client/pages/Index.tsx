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
  Frame,
  ExternalLink,
  AlertCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Breakpoint {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  label: string;
}

const breakpoints: Breakpoint[] = [
  {
    name: "desktop-xl",
    width: 1920,
    height: 1080,
    icon: <Monitor className="w-4 h-4" />,
    label: "Desktop XL",
  },
  {
    name: "desktop",
    width: 1366,
    height: 768,
    icon: <Monitor className="w-4 h-4" />,
    label: "Desktop",
  },
  {
    name: "tablet",
    width: 768,
    height: 1024,
    icon: <Tablet className="w-4 h-4" />,
    label: "Tablet",
  },
  {
    name: "mobile",
    width: 375,
    height: 667,
    icon: <Smartphone className="w-4 h-4" />,
    label: "Mobile",
  },
];

export default function Index() {
  const [url, setUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [selectedBreakpoint, setSelectedBreakpoint] = useState(breakpoints[1]);
  const [showDeviceFrame, setShowDeviceFrame] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePreview = () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setHasError(false);

    let formattedUrl = url.trim();

    // Add protocol if missing
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setCurrentUrl(formattedUrl);

    // Simulate loading time and handle potential errors
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePreview();
    }
  };

  const handleIframeError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const openInNewTab = () => {
    if (currentUrl) {
      window.open(currentUrl, "_blank");
    }
  };

  const getScaleForPreview = () => {
    const containerWidth = Math.min(window.innerWidth - 120, 1000);
    const containerHeight = Math.min(window.innerHeight - 400, 700);

    const scaleX = containerWidth / selectedBreakpoint.width;
    const scaleY = containerHeight / selectedBreakpoint.height;

    return Math.min(scaleX, scaleY, 0.8);
  };

  const scale = getScaleForPreview();
  const scaledWidth = selectedBreakpoint.width * scale;
  const scaledHeight = selectedBreakpoint.height * scale;

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
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
                {/* Breakpoint Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">Device Size:</span>
                  <div className="flex gap-2">
                    {breakpoints.map((breakpoint) => (
                      <Button
                        key={breakpoint.name}
                        variant={
                          selectedBreakpoint.name === breakpoint.name
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedBreakpoint(breakpoint)}
                        className={cn(
                          "h-10 px-4 gap-2 font-medium transition-all",
                          selectedBreakpoint.name === breakpoint.name
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                            : "bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30",
                        )}
                      >
                        {breakpoint.icon}
                        {breakpoint.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Device Frame Toggle */}
                <div className="flex items-center gap-3">
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
                </div>

                {/* Current dimensions */}
                <Badge className="bg-white/10 text-white border-white/20 px-3 py-1">
                  {selectedBreakpoint.width} × {selectedBreakpoint.height}px
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview Section */}
        {currentUrl && (
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div
                className={cn(
                  "relative transition-all duration-500 ease-out",
                  showDeviceFrame &&
                    selectedBreakpoint.name === "mobile" &&
                    "p-8",
                  showDeviceFrame &&
                    selectedBreakpoint.name === "tablet" &&
                    "p-6",
                )}
                style={{
                  width:
                    scaledWidth +
                    (showDeviceFrame &&
                    (selectedBreakpoint.name === "mobile" ||
                      selectedBreakpoint.name === "tablet")
                      ? 64
                      : 0),
                  height:
                    scaledHeight +
                    (showDeviceFrame &&
                    (selectedBreakpoint.name === "mobile" ||
                      selectedBreakpoint.name === "tablet")
                      ? 64
                      : 0),
                }}
              >
                {/* Device Frame */}
                {showDeviceFrame && selectedBreakpoint.name === "mobile" && (
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl border border-gray-600">
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-20 h-1.5 bg-gray-600 rounded-full"></div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-14 h-14 border-2 border-gray-600 rounded-full bg-gray-800"></div>
                  </div>
                )}

                {showDeviceFrame && selectedBreakpoint.name === "tablet" && (
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600">
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-10 border-2 border-gray-600 rounded-full bg-gray-800"></div>
                  </div>
                )}

                {/* Preview Container */}
                <div
                  className={cn(
                    "bg-white rounded-lg shadow-2xl overflow-hidden relative border border-gray-300",
                    showDeviceFrame &&
                      selectedBreakpoint.name === "mobile" &&
                      "mx-8 my-20 rounded-3xl border-0",
                    showDeviceFrame &&
                      selectedBreakpoint.name === "tablet" &&
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
                          This may take a moment
                        </p>
                      </div>
                    </div>
                  ) : hasError ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                      <div className="text-center p-8">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Preview Blocked
                        </h3>
                        <p className="text-gray-600 mb-4">
                          This website cannot be displayed in a frame due to
                          security restrictions.
                        </p>
                        <Button
                          onClick={openInNewTab}
                          className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open in New Tab
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <iframe
                        ref={iframeRef}
                        src={currentUrl}
                        className="w-full h-full border-0"
                        style={{
                          width: selectedBreakpoint.width,
                          height: selectedBreakpoint.height,
                          transform: `scale(${scale})`,
                          transformOrigin: "top left",
                        }}
                        title="Website Preview"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-links allow-popups"
                        onError={handleIframeError}
                        onLoad={() => {
                          // Check if iframe loaded successfully
                          try {
                            if (iframeRef.current?.contentDocument === null) {
                              handleIframeError();
                            }
                          } catch (e) {
                            handleIframeError();
                          }
                        }}
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
        {!currentUrl && (
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
              screen sizes and devices. Get instant previews with realistic
              device frames.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Desktop
              </div>
              <div className="flex items-center gap-2">
                <Tablet className="w-4 h-4" />
                Tablet
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Mobile
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

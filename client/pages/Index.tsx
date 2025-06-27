import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Monitor, Tablet, Smartphone, Globe, Frame } from "lucide-react";
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

  const handlePreview = () => {
    if (!url.trim()) return;

    setIsLoading(true);
    let formattedUrl = url.trim();

    // Add protocol if missing
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setCurrentUrl(formattedUrl);

    // Simulate loading time
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePreview();
    }
  };

  const getScaleForPreview = () => {
    const containerWidth = Math.min(window.innerWidth - 64, 1200);
    const containerHeight = Math.min(window.innerHeight - 300, 800);

    const scaleX = containerWidth / selectedBreakpoint.width;
    const scaleY = containerHeight / selectedBreakpoint.height;

    return Math.min(scaleX, scaleY, 1);
  };

  const scale = getScaleForPreview();
  const scaledWidth = selectedBreakpoint.width * scale;
  const scaledHeight = selectedBreakpoint.height * scale;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  ResponsiveViewer
                </h1>
                <p className="text-sm text-slate-600">
                  Preview websites across all devices
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* URL Input Section */}
        <div className="mb-8">
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-slate-200/50 shadow-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enter website URL
                </label>
                <div className="flex gap-3">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-white/80 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <Button
                    onClick={handlePreview}
                    disabled={!url.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8"
                  >
                    {isLoading ? "Loading..." : "Preview"}
                  </Button>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200">
                {/* Breakpoint Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Size:
                  </span>
                  <div className="flex gap-1">
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
                          "h-8 px-3 text-xs gap-1.5",
                          selectedBreakpoint.name === breakpoint.name
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-white/80 hover:bg-slate-50 text-slate-700 border-slate-300",
                        )}
                      >
                        {breakpoint.icon}
                        {breakpoint.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Device Frame Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={showDeviceFrame ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowDeviceFrame(!showDeviceFrame)}
                    className={cn(
                      "h-8 px-3 text-xs gap-1.5",
                      showDeviceFrame
                        ? "bg-slate-700 hover:bg-slate-800 text-white"
                        : "bg-white/80 hover:bg-slate-50 text-slate-700 border-slate-300",
                    )}
                  >
                    <Frame className="w-3 h-3" />
                    Device Frame
                  </Button>
                </div>

                {/* Current dimensions */}
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-700"
                >
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
                  "relative transition-all duration-300 ease-in-out",
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
                  <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem] shadow-2xl">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-slate-600 rounded-full"></div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 border-2 border-slate-600 rounded-full"></div>
                  </div>
                )}

                {showDeviceFrame && selectedBreakpoint.name === "tablet" && (
                  <div className="absolute inset-0 bg-slate-900 rounded-3xl shadow-2xl">
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-slate-600 rounded-full"></div>
                  </div>
                )}

                {/* Preview Container */}
                <div
                  className={cn(
                    "bg-white rounded-lg shadow-xl overflow-hidden relative",
                    showDeviceFrame &&
                      selectedBreakpoint.name === "mobile" &&
                      "mx-8 my-16 rounded-3xl",
                    showDeviceFrame &&
                      selectedBreakpoint.name === "tablet" &&
                      "mx-6 my-12 rounded-2xl",
                  )}
                  style={{
                    width: scaledWidth,
                    height: scaledHeight,
                  }}
                >
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading preview...</p>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      src={currentUrl}
                      className="w-full h-full border-0"
                      style={{
                        width: selectedBreakpoint.width,
                        height: selectedBreakpoint.height,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                      }}
                      title="Website Preview"
                      sandbox="allow-same-origin allow-scripts allow-forms allow-links"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!currentUrl && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
              <Globe className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Preview Any Website
            </h2>
            <p className="text-slate-600 max-w-md mx-auto">
              Enter a website URL above to see how it looks across different
              screen sizes and devices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

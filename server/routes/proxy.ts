import { RequestHandler } from "express";

export const handleProxy: RequestHandler = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL parameter is required" });
    }

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    // Enhanced headers to mimic real browser and get all resources
    const response = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        DNT: "1",
        Connection: "keep-alive",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch website: ${response.statusText}`,
      });
    }

    let content = await response.text();

    // Advanced content processing for better resource loading
    content = content
      // Remove all frame-busting headers and meta tags
      .replace(
        /<meta[^>]*http-equiv=['"](X-Frame-Options|x-frame-options)['"'][^>]*>/gi,
        "",
      )
      .replace(
        /<meta[^>]*http-equiv=['"](Content-Security-Policy|content-security-policy)['"'][^>]*>/gi,
        "",
      )

      // Fix all relative URLs to absolute URLs (including CSS, JS, images)
      .replace(/src=['"]([^'"]*)['"]/gi, (match, src) => {
        if (src.startsWith("//")) {
          return `src="${targetUrl.protocol}${src}"`;
        } else if (src.startsWith("/")) {
          return `src="${targetUrl.origin}${src}"`;
        } else if (!src.startsWith("http")) {
          return `src="${targetUrl.origin}/${src}"`;
        }
        return match;
      })
      .replace(/href=['"]([^'"]*)['"]/gi, (match, href) => {
        if (href.startsWith("//")) {
          return `href="${targetUrl.protocol}${href}"`;
        } else if (href.startsWith("/")) {
          return `href="${targetUrl.origin}${href}"`;
        } else if (
          !href.startsWith("http") &&
          !href.startsWith("#") &&
          !href.startsWith("mailto:") &&
          !href.startsWith("tel:")
        ) {
          return `href="${targetUrl.origin}/${href}"`;
        }
        return match;
      })
      .replace(/url\(['"]([^'"]*)['"]\)/gi, (match, url) => {
        if (url.startsWith("//")) {
          return `url('${targetUrl.protocol}${url}')`;
        } else if (url.startsWith("/")) {
          return `url('${targetUrl.origin}${url}')`;
        } else if (!url.startsWith("http")) {
          return `url('${targetUrl.origin}/${url}')`;
        }
        return match;
      })

      // Fix action attributes for forms
      .replace(/action=['"]([^'"]*)['"]/gi, (match, action) => {
        if (action.startsWith("/")) {
          return `action="${targetUrl.origin}${action}"`;
        }
        return match;
      })

      // Add base href for proper resource loading
      .replace(/<head>/i, `<head><base href="${targetUrl.origin}/">`)

      // Inject enhanced script to handle frame restrictions and improve compatibility
      .replace(
        /<\/head>/i,
        `
        <script>
          (function() {
            // Remove frame-busting scripts
            try {
              if (window.top !== window.self) {
                // Disable frame-busting
                window.top = window.self;
                window.parent = window.self;
                
                // Remove problematic scripts
                document.querySelectorAll('script').forEach(function(script) {
                  var content = script.innerHTML || script.textContent || '';
                  if (content.includes('top.location') || 
                      content.includes('parent.location') ||
                      content.includes('frameElement') ||
                      content.includes('window.top') ||
                      content.includes('break out') ||
                      content.includes('breakout')) {
                    script.remove();
                  }
                });
                
                // Override location changes
                Object.defineProperty(window, 'location', {
                  value: window.location,
                  writable: false
                });
              }
              
              // Ensure all fonts and resources load properly
              document.addEventListener('DOMContentLoaded', function() {
                // Force font loading
                if (document.fonts && document.fonts.ready) {
                  document.fonts.ready.then(function() {
                    // Fonts loaded
                  });
                }
                
                // Ensure all images load
                var images = document.querySelectorAll('img');
                images.forEach(function(img) {
                  if (!img.complete) {
                    img.addEventListener('load', function() {
                      // Image loaded
                    });
                  }
                });
              });
              
            } catch (e) {
              // Ignore errors
            }
          })();
        </script>
        </head>`,
      )

      // Additional script before closing body to ensure full rendering
      .replace(
        /<\/body>/i,
        `
        <script>
          // Final compatibility fixes
          try {
            // Remove any remaining frame-busting attempts
            window.addEventListener('beforeunload', function(e) {
              e.preventDefault();
              return null;
            });
            
            // Ensure proper CSS rendering
            var style = document.createElement('style');
            style.innerHTML = '* { box-sizing: border-box; } body { margin: 0; padding: 0; }';
            document.head.appendChild(style);
            
          } catch (e) {}
        </script>
        </body>`,
      );

    // Set headers for better iframe compatibility and resource loading
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.setHeader("Access-Control-Allow-Headers", "*");

    // Remove frame-busting headers
    res.removeHeader("X-Frame-Options");

    // Cache headers for better performance
    res.setHeader("Cache-Control", "public, max-age=300");

    res.send(content);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Failed to fetch website content",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

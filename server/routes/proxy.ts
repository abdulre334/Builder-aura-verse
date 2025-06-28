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

    // Enhanced real-time crawling headers to mimic real browser behavior
    const response = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        DNT: "1",
        Connection: "keep-alive",
        "Sec-CH-UA":
          '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        "Sec-CH-UA-Mobile": "?0",
        "Sec-CH-UA-Platform": '"Windows"',
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch website: ${response.statusText}`,
      });
    }

    let content = await response.text();

    // Advanced real-time content processing for live crawling
    content = content
      // Remove ALL frame-busting headers and restrictions
      .replace(
        /<meta[^>]*http-equiv=['"](X-Frame-Options|x-frame-options)['"'][^>]*>/gi,
        "",
      )
      .replace(
        /<meta[^>]*http-equiv=['"](Content-Security-Policy|content-security-policy)['"'][^>]*>/gi,
        "",
      )
      .replace(
        /<meta[^>]*name=['"](referrer)['"'][^>]*>/gi,
        '<meta name="referrer" content="no-referrer-when-downgrade">',
      )

      // Enhanced URL fixing for ALL resources (real-time crawling)
      .replace(/src=['"]([^'"]*)['"]/gi, (match, src) => {
        if (src.startsWith("data:")) return match;
        if (src.startsWith("//")) {
          return `src="${targetUrl.protocol}${src}"`;
        } else if (src.startsWith("/")) {
          return `src="${targetUrl.origin}${src}"`;
        } else if (!src.startsWith("http") && !src.startsWith("blob:")) {
          const baseDir = targetUrl.pathname.endsWith("/")
            ? targetUrl.pathname
            : targetUrl.pathname.substring(
                0,
                targetUrl.pathname.lastIndexOf("/") + 1,
              );
          return `src="${targetUrl.origin}${baseDir}${src}"`;
        }
        return match;
      })

      .replace(/href=['"]([^'"]*)['"]/gi, (match, href) => {
        if (href.startsWith("data:") || href.startsWith("javascript:"))
          return match;
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
          const baseDir = targetUrl.pathname.endsWith("/")
            ? targetUrl.pathname
            : targetUrl.pathname.substring(
                0,
                targetUrl.pathname.lastIndexOf("/") + 1,
              );
          return `href="${targetUrl.origin}${baseDir}${href}"`;
        }
        return match;
      })

      // Fix CSS background images and @import statements for real-time loading
      .replace(/url\(['"]?([^'"]*?)['"]?\)/gi, (match, url) => {
        if (url.startsWith("data:") || url.startsWith("blob:")) return match;
        if (url.startsWith("//")) {
          return `url('${targetUrl.protocol}${url}')`;
        } else if (url.startsWith("/")) {
          return `url('${targetUrl.origin}${url}')`;
        } else if (!url.startsWith("http")) {
          const baseDir = targetUrl.pathname.endsWith("/")
            ? targetUrl.pathname
            : targetUrl.pathname.substring(
                0,
                targetUrl.pathname.lastIndexOf("/") + 1,
              );
          return `url('${targetUrl.origin}${baseDir}${url}')`;
        }
        return match;
      })

      // Fix @import statements in CSS
      .replace(/@import\s+['"]([^'"]*)['"]/gi, (match, importUrl) => {
        if (importUrl.startsWith("//")) {
          return `@import '${targetUrl.protocol}${importUrl}'`;
        } else if (importUrl.startsWith("/")) {
          return `@import '${targetUrl.origin}${importUrl}'`;
        } else if (!importUrl.startsWith("http")) {
          const baseDir = targetUrl.pathname.endsWith("/")
            ? targetUrl.pathname
            : targetUrl.pathname.substring(
                0,
                targetUrl.pathname.lastIndexOf("/") + 1,
              );
          return `@import '${targetUrl.origin}${baseDir}${importUrl}'`;
        }
        return match;
      })

      // Add base href for comprehensive resource loading
      .replace(/<head>/i, `<head><base href="${targetUrl.origin}/">`)

      // Inject comprehensive real-time crawling and compatibility script
      .replace(
        /<\/head>/i,
        `
        <style>
          /* Ensure proper rendering in iframe */
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; overflow-x: auto; }
          html { width: 100%; height: 100%; }
        </style>
        <script>
          (function() {
            // Real-time compatibility and frame-busting removal
            try {
              // Override frame-busting attempts
              if (window.top !== window.self) {
                Object.defineProperty(window, 'top', { value: window.self, writable: false });
                Object.defineProperty(window, 'parent', { value: window.self, writable: false });
                Object.defineProperty(window, 'frameElement', { value: null, writable: false });
                
                // Remove frame-busting scripts in real-time
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                        const content = node.innerHTML || node.textContent || '';
                        if (content.includes('top.location') || 
                            content.includes('parent.location') ||
                            content.includes('frameElement') ||
                            content.includes('window.top') ||
                            content.includes('top!=self') ||
                            content.includes('top!=window')) {
                          node.remove();
                        }
                      }
                    });
                  });
                });
                
                observer.observe(document, { childList: true, subtree: true });
                
                // Override location changing
                const originalReplace = window.location.replace;
                const originalAssign = window.location.assign;
                window.location.replace = function() { return false; };
                window.location.assign = function() { return false; };
              }
              
              // Real-time resource loading optimization
              document.addEventListener('DOMContentLoaded', function() {
                // Force load all images
                const images = document.querySelectorAll('img[data-src], img[data-lazy-src]');
                images.forEach(function(img) {
                  if (img.dataset.src) {
                    img.src = img.dataset.src;
                  }
                  if (img.dataset.lazySrc) {
                    img.src = img.dataset.lazySrc;
                  }
                });
                
                // Force load all lazy CSS
                const lazyStyles = document.querySelectorAll('link[data-href]');
                lazyStyles.forEach(function(link) {
                  link.href = link.dataset.href;
                });
                
                // Trigger any lazy loading scripts
                window.dispatchEvent(new Event('scroll'));
                window.dispatchEvent(new Event('resize'));
              });
              
            } catch (e) {
              // Ignore errors but continue
            }
          })();
        </script>
        </head>`,
      )

      // Final script for complete real-time rendering
      .replace(
        /<\/body>/i,
        `
        <script>
          // Final real-time optimizations
          try {
            // Prevent any remaining navigation attempts
            window.addEventListener('beforeunload', function(e) {
              e.preventDefault();
              e.stopPropagation();
              return null;
            });
            
            // Override console errors that might break rendering
            const originalError = console.error;
            console.error = function() {
              // Suppress frame-related errors
              const args = Array.from(arguments);
              if (!args.some(arg => typeof arg === 'string' && 
                  (arg.includes('frame') || arg.includes('X-Frame') || arg.includes('SecurityError')))) {
                originalError.apply(console, arguments);
              }
            };
            
            // Force final rendering pass
            setTimeout(function() {
              // Trigger any remaining load events
              window.dispatchEvent(new Event('load'));
              document.dispatchEvent(new Event('DOMContentLoaded'));
            }, 100);
            
          } catch (e) {}
        </script>
        </body>`,
      );

    // Set enhanced headers for real-time iframe compatibility
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader(
      "Content-Security-Policy",
      "frame-ancestors *; default-src *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'",
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");

    // Remove any restrictive headers
    res.removeHeader("X-Frame-Options");

    // Cache for better performance
    res.setHeader(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=60",
    );

    res.send(content);
  } catch (error) {
    console.error("Real-time crawling error:", error);
    res.status(500).json({
      error: "Failed to crawl website in real-time",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

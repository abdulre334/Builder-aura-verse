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

    console.log(`🔍 Real-time crawling: ${targetUrl.toString()}`);

    // ENHANCED FAST crawling with optimized attempts
    let response: Response;
    let attempts = 0;
    const maxAttempts = 2; // Reduced for speed

    while (attempts < maxAttempts) {
      try {
        response = await fetch(targetUrl.toString(), {
          headers: {
            // Optimized browser headers for speed
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Cache-Control": "max-age=0",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            Connection: "keep-alive",
            "Sec-CH-UA":
              '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            "Sec-CH-UA-Mobile": "?0",
            "Sec-CH-UA-Platform": '"Windows"',
          },
          redirect: "follow",
          signal: AbortSignal.timeout(15000), // Reduced timeout for speed
        });

        if (response.ok) {
          break;
        }

        attempts++;
        if (attempts < maxAttempts) {
          console.log(`⚠️ Fast retry ${attempts}...`);
          await new Promise((resolve) => setTimeout(resolve, 500)); // Faster retry
        }
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error;
        }
        console.log(`⚠️ Fast retry ${attempts} after error...`);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Faster retry
      }
    }

    if (!response.ok) {
      console.error(`❌ Failed to crawl after ${maxAttempts} attempts`);
      return res.status(response.status).json({
        error: `Real-time crawling failed: ${response.statusText}`,
      });
    }

    console.log(
      `✅ Successfully crawled: ${response.status} ${response.statusText}`,
    );

    let content = await response.text();

    if (!content || content.length < 100) {
      throw new Error("Received empty or invalid content");
    }

    console.log(`📄 Content length: ${content.length} characters`);

    // AGGRESSIVE content processing for real crawling
    content = content
      // Remove ALL iframe blocking mechanisms
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
        '<meta name="referrer" content="unsafe-url">',
      )

      // Fix ALL resource URLs for real-time loading
      .replace(/src=['"]([^'"]*)['"]/gi, (match, src) => {
        if (
          src.startsWith("data:") ||
          src.startsWith("blob:") ||
          src.startsWith("javascript:")
        )
          return match;

        try {
          if (src.startsWith("//")) {
            return `src="${targetUrl.protocol}${src}"`;
          } else if (src.startsWith("/")) {
            return `src="${targetUrl.origin}${src}"`;
          } else if (!src.startsWith("http")) {
            const absoluteUrl = new URL(src, targetUrl.href);
            return `src="${absoluteUrl.href}"`;
          }
        } catch (e) {
          console.warn(`⚠️ Failed to resolve src: ${src}`);
        }
        return match;
      })

      .replace(/href=['"]([^'"]*)['"]/gi, (match, href) => {
        if (
          href.startsWith("data:") ||
          href.startsWith("javascript:") ||
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:")
        )
          return match;

        try {
          if (href.startsWith("//")) {
            return `href="${targetUrl.protocol}${href}"`;
          } else if (href.startsWith("/")) {
            return `href="${targetUrl.origin}${href}"`;
          } else if (!href.startsWith("http")) {
            const absoluteUrl = new URL(href, targetUrl.href);
            return `href="${absoluteUrl.href}"`;
          }
        } catch (e) {
          console.warn(`⚠️ Failed to resolve href: ${href}`);
        }
        return match;
      })

      // Fix CSS URLs
      .replace(/url\(['"]?([^'"]*?)['"]?\)/gi, (match, url) => {
        if (url.startsWith("data:") || url.startsWith("blob:")) return match;

        try {
          if (url.startsWith("//")) {
            return `url("${targetUrl.protocol}${url}")`;
          } else if (url.startsWith("/")) {
            return `url("${targetUrl.origin}${url}")`;
          } else if (!url.startsWith("http")) {
            const absoluteUrl = new URL(url, targetUrl.href);
            return `url("${absoluteUrl.href}")`;
          }
        } catch (e) {
          console.warn(`⚠️ Failed to resolve CSS url: ${url}`);
        }
        return match;
      })

      // Add comprehensive base tag
      .replace(/<head>/i, `<head><base href="${targetUrl.origin}/">`)

      // Inject REAL-TIME compatibility script
      .replace(
        /<\/head>/i,
        `
        <style>
          /* Force proper rendering */
          * { box-sizing: border-box !important; }
          html, body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: auto !important;
          }
          /* Hide loading indicators that might interfere */
          .loading, .loader, .spinner, .preloader { display: none !important; }
        </style>
        <script>
          (function() {
            console.log('🚀 RespoCheck Real-time Crawling Active');

            // Override ALL frame-busting attempts
            try {
              if (window.top !== window.self) {
                // Block frame-busting
                Object.defineProperty(window, 'top', {
                  value: window.self,
                  writable: false,
                  configurable: false
                });
                Object.defineProperty(window, 'parent', {
                  value: window.self,
                  writable: false,
                  configurable: false
                });
                Object.defineProperty(window, 'frameElement', {
                  value: null,
                  writable: false,
                  configurable: false
                });

                // Monitor and remove frame-busting scripts
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.nodeType === 1) {
                        if (node.tagName === 'SCRIPT') {
                          const content = node.textContent || node.innerHTML || '';
                          if (content.match(/(top\s*[!=]=|parent\s*[!=]=|frameElement|location\s*=|window\.open)/)) {
                            console.log('🚫 Blocked frame-busting script');
                            node.remove();
                          }
                        }
                        // Also check child scripts
                        const scripts = node.querySelectorAll ? node.querySelectorAll('script') : [];
                        scripts.forEach(script => {
                          const content = script.textContent || script.innerHTML || '';
                          if (content.match(/(top\s*[!=]=|parent\s*[!=]=|frameElement|location\s*=)/)) {
                            console.log('🚫 Blocked nested frame-busting script');
                            script.remove();
                          }
                        });
                      }
                    });
                  });
                });

                observer.observe(document, {
                  childList: true,
                  subtree: true,
                  attributes: false,
                  characterData: false
                });

                // Override dangerous functions
                const noop = function() { return false; };
                window.location.replace = noop;
                window.location.assign = noop;
                if (window.location.reload) window.location.reload = noop;
              }

              // Force load lazy content
              document.addEventListener('DOMContentLoaded', function() {
                console.log('📋 DOM Content Loaded - Forcing resource loading');

                // Load lazy images
                const lazyImages = document.querySelectorAll('img[data-src], img[data-lazy-src], img[loading="lazy"]');
                lazyImages.forEach(function(img) {
                  if (img.dataset.src) img.src = img.dataset.src;
                  if (img.dataset.lazySrc) img.src = img.dataset.lazySrc;
                  img.loading = 'eager';
                });

                // Load lazy iframes
                const lazyIframes = document.querySelectorAll('iframe[data-src], iframe[loading="lazy"]');
                lazyIframes.forEach(function(iframe) {
                  if (iframe.dataset.src) iframe.src = iframe.dataset.src;
                  iframe.loading = 'eager';
                });

                // Force trigger scroll events for lazy loading
                setTimeout(() => {
                  window.dispatchEvent(new Event('scroll'));
                  window.dispatchEvent(new Event('resize'));
                  window.dispatchEvent(new Event('load'));
                }, 500);
              });

            } catch (e) {
              console.warn('⚠️ Frame compatibility script error:', e);
            }
          })();
        </script>
        </head>`,
      )

      // Final cleanup script
      .replace(
        /<\/body>/i,
        `
        <script>
          try {
            // Final anti-frame-busting measures
            ['beforeunload', 'unload', 'pagehide'].forEach(event => {
              window.addEventListener(event, function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return null;
              }, true);
            });

            // Suppress frame-related console errors
            const originalError = console.error;
            console.error = function(...args) {
              const message = args.join(' ');
              if (!message.match(/(frame|X-Frame|SecurityError|cross-origin)/i)) {
                originalError.apply(console, args);
              }
            };

            // Mark as successfully loaded
            setTimeout(() => {
              console.log('✅ RespoCheck: Real-time crawling complete');
              window.dispatchEvent(new CustomEvent('respocheck-loaded'));
            }, 1000);

          } catch (e) {
            console.warn('⚠️ Final script error:', e);
          }
        </script>
        </body>`,
      );

    console.log(`🔧 Content processed and enhanced for iframe compatibility`);

    // Set optimal headers for iframe embedding
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Referrer-Policy", "unsafe-url");
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Remove restrictive headers
    res.removeHeader("X-Frame-Options");
    res.removeHeader("Content-Security-Policy");

    // Cache for performance
    res.setHeader(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=60",
    );
    res.setHeader("Vary", "Accept-Encoding");

    console.log(`📤 Sending ${content.length} characters to client`);

    res.send(content);
  } catch (error) {
    console.error("💥 Real-time crawling error:", error);
    res.status(500).json({
      error: "Real-time crawling failed",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
};

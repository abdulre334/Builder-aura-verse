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

    console.log(`🔍 Ultra-fast crawling: ${targetUrl.toString()}`);

    // ULTRA-FAST crawling for 4-second loading
    let response: Response;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      try {
        response = await fetch(targetUrl.toString(), {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Cache-Control": "max-age=0",
            Connection: "keep-alive",
          },
          redirect: "follow",
          signal: AbortSignal.timeout(8000), // Longer timeout for complete loading
        });

        if (response.ok) {
          break;
        }

        attempts++;
        if (attempts < maxAttempts) {
          console.log(`⚠️ Ultra-fast retry ${attempts}...`);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error;
        }
        console.log(`⚠️ Ultra-fast retry ${attempts} after error...`);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    if (!response.ok) {
      console.error(`❌ Failed to crawl after ${maxAttempts} attempts`);
      return res.status(response.status).json({
        error: `Ultra-fast crawling failed: ${response.statusText}`,
      });
    }

    console.log(
      `✅ Ultra-fast crawl success: ${response.status} ${response.statusText}`,
    );

    let content = await response.text();

    if (!content || content.length < 50) {
      throw new Error("Received empty or invalid content");
    }

    console.log(`📄 Content length: ${content.length} characters`);

    // FULL PAGE RENDERING like real responsive checkers
    content = content
      // Remove frame blocking
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

      // Fix ALL resource URLs for complete rendering
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

<<<<<<< HEAD
      // Inject responsive testing compatibility script for full page rendering
      .replace(
        /<\/head>/i,
        `
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          /* Full page rendering optimizations */
          html, body {
            overflow-x: auto !important;
            overflow-y: auto !important;
=======
      // Inject full page rendering compatibility script
      .replace(
        /<\/head>/i,
        `
        <style>
          /* Full page rendering styles */
          * { box-sizing: border-box !important; }
          html, body {
>>>>>>> 45f282d50f42da766e4853922f290700ba8564dc
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
<<<<<<< HEAD
          }

          /* Responsive testing viewport simulation */
          * {
            box-sizing: border-box !important;
          }

          /* Ensure full content visibility */
          img {
            max-width: 100% !important;
            height: auto !important;
          }

          /* Performance optimizations for real-time viewing */
=======
            overflow-x: auto !important;
          }
          /* Ensure fonts load properly */
>>>>>>> 45f282d50f42da766e4853922f290700ba8564dc
          * {
            -webkit-font-smoothing: antialiased !important;
            text-rendering: optimizeLegibility !important;
          }
        </style>
        <script>
          (function() {
            try {
<<<<<<< HEAD
              console.log('🔥 RespoCheck: Full Page Rendering Active');

              // Professional responsive testing frame protection
=======
              // Full frame-busting protection
>>>>>>> 45f282d50f42da766e4853922f290700ba8564dc
              if (window.top !== window.self) {
                Object.defineProperty(window, 'top', { value: window.self, writable: false });
                Object.defineProperty(window, 'parent', { value: window.self, writable: false });
                Object.defineProperty(window, 'frameElement', { value: null, writable: false });
              }

<<<<<<< HEAD
              // Full page rendering - force load all content
              document.addEventListener('DOMContentLoaded', function() {
                console.log('📱 Viewport Simulation: Loading all resources');

                // Force load lazy images for full page rendering
=======
              // Force load all lazy content for full page rendering
              document.addEventListener('DOMContentLoaded', function() {
                // Load lazy images
>>>>>>> 45f282d50f42da766e4853922f290700ba8564dc
                const lazyImages = document.querySelectorAll('img[data-src], img[data-lazy-src], img[loading="lazy"]');
                lazyImages.forEach(function(img) {
                  if (img.dataset.src) img.src = img.dataset.src;
                  if (img.dataset.lazySrc) img.src = img.dataset.lazySrc;
                  img.loading = 'eager';
                  img.removeAttribute('loading');
                });

                // Force load lazy iframes
                const lazyIframes = document.querySelectorAll('iframe[data-src], iframe[loading="lazy"]');
                lazyIframes.forEach(function(iframe) {
                  if (iframe.dataset.src) iframe.src = iframe.dataset.src;
                  iframe.loading = 'eager';
                });

                // Trigger responsive design updates
                setTimeout(() => {
                  window.dispatchEvent(new Event('resize'));
                  window.dispatchEvent(new Event('scroll'));
                  window.dispatchEvent(new Event('orientationchange'));
                }, 100);

                // Monitor for new content (like professional tools)
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.nodeType === 1) {
                        // Load any new lazy content
                        const newLazyImages = node.querySelectorAll ? node.querySelectorAll('img[data-src], img[loading="lazy"]') : [];
                        newLazyImages.forEach(function(img) {
                          if (img.dataset.src) img.src = img.dataset.src;
                          img.loading = 'eager';
                        });
                      }
                    });
                  });
                });

                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                });

                // Load lazy iframes
                const lazyIframes = document.querySelectorAll('iframe[data-src], iframe[loading="lazy"]');
                lazyIframes.forEach(function(iframe) {
                  if (iframe.dataset.src) iframe.src = iframe.dataset.src;
                  iframe.loading = 'eager';
                });

                // Force trigger scroll and resize events for responsive behavior
                setTimeout(() => {
                  window.dispatchEvent(new Event('scroll'));
                  window.dispatchEvent(new Event('resize'));
                  window.dispatchEvent(new Event('load'));
                }, 100);
              });

              // Complete loading enhancement - don't stop until everything loads
              window.addEventListener('load', function() {
                console.log('✅ Initial Page Load Complete - Continuing full resource loading');

                // Continue loading all resources
                setTimeout(() => {
                  // Force load any remaining lazy content
                  const allImages = document.querySelectorAll('img');
                  allImages.forEach(img => {
                    if (!img.complete || img.naturalWidth === 0) {
                      img.loading = 'eager';
                      if (img.dataset.src) img.src = img.dataset.src;
                    }
                  });

                  // Force responsive layout recalculation
                  const elements = document.querySelectorAll('*');
                  elements.forEach(el => {
                    if (el.style.width === 'auto' || el.style.maxWidth) {
                      el.style.width = el.style.width;
                    }
                  });

                  // Trigger additional load events for complete loading
                  window.dispatchEvent(new Event('resize'));
                  window.dispatchEvent(new Event('DOMContentLoaded'));

                  console.log('🔥 Complete Website Loading Finished - All Resources Loaded');
                }, 500);
              });

            } catch (e) {
              console.warn('⚠️ Responsive testing script error:', e);
            }
          })();
        </script>
        </head>`,
      );

    console.log(`🔧 Minimal processing complete`);

    // Optimal headers for iframe embedding
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Referrer-Policy", "unsafe-url");

    // Remove restrictive headers
    res.removeHeader("X-Frame-Options");
    res.removeHeader("Content-Security-Policy");

    // Fast cache settings
    res.setHeader("Cache-Control", "public, max-age=300");

    console.log(`📤 Sending ${content.length} characters ultra-fast`);

    res.send(content);
  } catch (error) {
    console.error("💥 Ultra-fast crawling error:", error);
    res.status(500).json({
      error: "Ultra-fast crawling failed",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
};

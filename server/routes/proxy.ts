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
          signal: AbortSignal.timeout(3000), // Ultra-fast 3 second timeout
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

      // Inject full page rendering compatibility script
      .replace(
        /<\/head>/i,
        `
        <style>
          /* Full page rendering styles */
          * { box-sizing: border-box !important; }
          html, body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: auto !important;
          }
          /* Ensure fonts load properly */
          * {
            -webkit-font-smoothing: antialiased !important;
            text-rendering: optimizeLegibility !important;
          }
        </style>
        <script>
          (function() {
            try {
              // Full frame-busting protection
              if (window.top !== window.self) {
                Object.defineProperty(window, 'top', { value: window.self, writable: false });
                Object.defineProperty(window, 'parent', { value: window.self, writable: false });
                Object.defineProperty(window, 'frameElement', { value: null, writable: false });
              }

              // Force load all lazy content for full page rendering
              document.addEventListener('DOMContentLoaded', function() {
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

                // Force trigger scroll and resize events for responsive behavior
                setTimeout(() => {
                  window.dispatchEvent(new Event('scroll'));
                  window.dispatchEvent(new Event('resize'));
                  window.dispatchEvent(new Event('load'));
                }, 100);
              });
            } catch (e) {}
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

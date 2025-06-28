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

    // MINIMAL processing for maximum speed
    content = content
      // Remove frame blocking only
      .replace(
        /<meta[^>]*http-equiv=['"](X-Frame-Options|x-frame-options)['"'][^>]*>/gi,
        "",
      )
      .replace(
        /<meta[^>]*http-equiv=['"](Content-Security-Policy|content-security-policy)['"'][^>]*>/gi,
        "",
      )
      // Add base tag for resource resolution
      .replace(/<head>/i, `<head><base href="${targetUrl.origin}/">`)

      // Inject minimal compatibility script
      .replace(
        /<\/head>/i,
        `
        <script>
          (function() {
            try {
              // Minimal frame-busting protection
              if (window.top !== window.self) {
                Object.defineProperty(window, 'top', { value: window.self, writable: false });
                Object.defineProperty(window, 'parent', { value: window.self, writable: false });
              }
              
              // Quick lazy loading fix
              document.addEventListener('DOMContentLoaded', function() {
                const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
                lazyImages.forEach(function(img) {
                  if (img.dataset.src) img.src = img.dataset.src;
                  img.loading = 'eager';
                });
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

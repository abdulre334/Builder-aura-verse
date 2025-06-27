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

    // Fetch the website content
    const response = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch website: ${response.statusText}`,
      });
    }

    let content = await response.text();

    // Remove or modify headers that prevent iframe embedding
    content = content
      // Remove X-Frame-Options
      .replace(
        /<meta[^>]*http-equiv=['"](X-Frame-Options|x-frame-options)['"'][^>]*>/gi,
        "",
      )
      // Remove CSP frame-ancestors
      .replace(
        /<meta[^>]*http-equiv=['"](Content-Security-Policy|content-security-policy)['"'][^>]*frame-ancestors[^>]*>/gi,
        "",
      )
      // Fix relative URLs to absolute URLs
      .replace(/src=['"](\/[^'"]*)['"]/gi, `src="${targetUrl.origin}$1"`)
      .replace(/href=['"](\/[^'"]*)['"]/gi, `href="${targetUrl.origin}$1"`)
      .replace(/action=['"](\/[^'"]*)['"]/gi, `action="${targetUrl.origin}$1"`)
      // Fix protocol-relative URLs
      .replace(/src=['"]\/\/([^'"]*)['"]/gi, `src="${targetUrl.protocol}//$1"`)
      .replace(
        /href=['"]\/\/([^'"]*)['"]/gi,
        `href="${targetUrl.protocol}//$1"`,
      )
      // Add base href to handle relative URLs
      .replace(/<head>/i, `<head><base href="${targetUrl.origin}/">`)
      // Inject script to allow iframe communication
      .replace(
        /<\/body>/i,
        `
        <script>
          // Allow iframe communication
          if (window.top !== window.self) {
            try {
              // Remove any remaining frame-busting scripts
              document.querySelectorAll('script').forEach(script => {
                if (script.innerHTML.includes('top.location') || 
                    script.innerHTML.includes('parent.location') ||
                    script.innerHTML.includes('frameElement')) {
                  script.remove();
                }
              });
            } catch (e) {}
          }
        </script>
      </body>`,
      );

    // Set appropriate headers
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *");

    // Remove any existing frame-busting headers
    res.removeHeader("X-Frame-Options");

    res.send(content);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Failed to fetch website content",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

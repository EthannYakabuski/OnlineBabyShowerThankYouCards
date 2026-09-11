#!/usr/bin/env python3
"""
Local dev server for this GitHub Pages thank-you-card site.

It serves real files normally, but falls back to 404.html for clean routes
like /sample-guest and /sample-guest/. This matches how the site works
with GitHub Pages + 404.html fallback.

Run from the repo root:
  python dev-server.py

Then open:
  http://localhost:8000/sample-guest
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

PORT = 8000
ROOT = Path(__file__).resolve().parent

class SpaFallbackHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):
        requested_path = urlsplit(self.path).path
        file_path = Path(self.translate_path(self.path))

        # Serve real files/directories normally.
        if file_path.exists():
            return super().send_head()

        # Let obviously missing static assets 404 instead of returning HTML.
        if Path(requested_path).suffix:
            return super().send_head()

        # Use the same shell as Pages so trailing-slash links resolve assets.
        self.path = "/404.html"
        return super().send_head()

if __name__ == "__main__":
    print(f"Serving {ROOT} at http://localhost:{PORT}")
    print(f"Try http://localhost:{PORT}/sample-guest")
    ThreadingHTTPServer(("localhost", PORT), SpaFallbackHandler).serve_forever()

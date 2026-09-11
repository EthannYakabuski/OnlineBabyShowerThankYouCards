"""Exercise the preview server with real local HTTP requests."""
import importlib.util
from pathlib import Path
import threading
import unittest
from urllib.error import HTTPError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("dev_server", ROOT / "dev-server.py")
dev_server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(dev_server)


class PreviewServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = dev_server.ThreadingHTTPServer(("127.0.0.1", 0), dev_server.SpaFallbackHandler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = f"http://127.0.0.1:{cls.server.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def test_root_and_assets(self):
        for path, filename in [("/", "index.html"), ("/styles.css", "styles.css"), ("/app.js", "app.js")]:
            with self.subTest(path=path), urlopen(self.base + path) as response:
                self.assertEqual(response.status, 200)
                self.assertEqual(response.read(), (ROOT / filename).read_bytes())

    def test_guest_routes_use_pages_fallback(self):
        for path in ["/example-guest", "/example-guest/", "/example-guest/?from=card"]:
            with self.subTest(path=path), urlopen(self.base + path) as response:
                self.assertEqual(response.status, 200)
                self.assertEqual(response.read(), (ROOT / "404.html").read_bytes())

    def test_head_uses_same_fallback(self):
        with urlopen(Request(self.base + "/example-guest/", method="HEAD")) as response:
            self.assertEqual(response.status, 200)
            self.assertEqual(int(response.headers["Content-Length"]), (ROOT / "404.html").stat().st_size)
            self.assertEqual(response.read(), b"")

    def test_missing_photo_returns_404(self):
        with self.assertRaises(HTTPError) as error:
            urlopen(self.base + "/assets/photos/missing-example.jpg")
        self.assertEqual(error.exception.code, 404)


if __name__ == "__main__":
    unittest.main()

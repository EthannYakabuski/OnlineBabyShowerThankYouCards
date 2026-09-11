const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

const root = join(__dirname, "..");
const code = readFileSync(join(root, "app.js"), "utf8");
const entries = {
  "example-guest": {
    displayName: "Example & Guest",
    note: "A sample note.",
    photos: [{ src: "assets/photos/example.svg" }]
  },
  default: { displayName: "Friend", photos: [] }
};

// Execute the actual HTML bootstrap and app in a minimal browser context.
// This catches both route selection and assets loading from the wrong folder.
function loadPage(url, shell, data = entries) {
  const html = readFileSync(join(root, shell), "utf8");
  const app = { innerHTML: "" };
  let baseUrl = url;
  const document = {
    getElementById: () => app,
    createElement: () => ({}),
    head: { appendChild: (element) => { baseUrl = element.href; } },
    querySelectorAll: () => [],
    title: ""
  };
  const context = vm.createContext({
    URL,
    console,
    document,
    window: { location: new URL(url), THANK_YOUS: data }
  });
  for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    vm.runInContext(match[1], context);
  }
  document.currentScript = { src: new URL("./app.js", baseUrl).href };
  vm.runInContext(code, context);
  const assets = [...html.matchAll(/(?:src|href)="(\.\/[^"\s]+)"/g)]
    .map((match) => new URL(match[1], baseUrl).href);
  return { context, app, document, assets };
}

for (const base of [
  "https://example.github.io/cards/",
  "https://example.github.io/",
  "https://cards.example.com/",
  "http://localhost:8000/"
]) {
  for (const path of ["", "index.html", "example-guest", "example-guest/"]) {
    test(`correct note and assets at ${base}${path}`, () => {
      const isGuest = path.startsWith("example-guest");
      const page = loadPage(base + path, isGuest ? "404.html" : "index.html");
      assert.equal(vm.runInContext("getPersonSlug()", page.context), isGuest ? "example-guest" : "default");
      assert.deepEqual(page.assets, ["styles.css", "thank-yous.js", "app.js"].map((asset) => base + asset));
      assert.equal(page.document.title, isGuest ? "Thank You, Example & Guest 💕" : "Thank You, Friend 💕");
      assert.equal(page.app.innerHTML.includes('class="photo-section"'), isGuest);
      if (isGuest) {
        assert.ok(page.app.innerHTML.includes(base + "assets/photos/example.svg"));
        assert.ok(page.app.innerHTML.includes("Example &amp; Guest"));
      }
    });
  }
}

test("query strings and fragments do not become part of the guest key", () => {
  const page = loadPage("https://example.github.io/cards/example-guest/?from=card#message", "404.html");
  assert.equal(vm.runInContext("getPersonSlug()", page.context), "example-guest");
  assert.ok(page.app.innerHTML.includes("https://example.github.io/cards/assets/photos/example.svg"));
});

for (const slug of ["unknown-guest", "constructor"]) {
  test(`${slug} uses the default entry`, () => {
    const page = loadPage(`https://example.github.io/cards/${slug}`, "404.html");
    assert.equal(page.document.title, "Thank You, Friend 💕");
    assert.equal(vm.runInContext("getEntry().isFallback", page.context), true);
  });
}

test("the built-in default still works without a data file", () => {
  const page = loadPage("https://example.github.io/cards/", "index.html", null);
  assert.equal(page.document.title, "Thank You, Friend 💕");
  assert.ok(!page.app.innerHTML.includes('class="photo-section"'));
});

test("opening index.html directly resolves photos beside the app", () => {
  const page = loadPage("file:///C:/sample/cards/index.html", "index.html");
  assert.equal(vm.runInContext("getPersonSlug()", page.context), "default");
  assert.equal(vm.runInContext('assetUrl("assets/photos/example.svg")', page.context), "file:///C:/sample/cards/assets/photos/example.svg");
});

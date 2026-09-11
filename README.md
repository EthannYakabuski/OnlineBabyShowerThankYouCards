# Baby Shower Thank-You Pages

A small template for personalized baby shower thank-you cards, hosted for free on GitHub Pages from a public repository. Each guest gets a link to their own note, with an optional gallery of captioned cards that flip to reveal photos.

The site uses plain HTML, CSS, and JavaScript. No build tools, database, API keys, or paid services are required. The included notes and illustration are generic examples.

**Privacy:** This is a public website with no sign-in or access control. Every note in `thank-yous.js` and every uploaded photo can be read or downloaded by anyone. Guest links are personalization, not private invitations. Only publish text and photos you are comfortable sharing publicly.

## Create your copy

1. Select **Use this template → Create a new repository** on GitHub.
2. Choose a repository name, such as `baby-shower-thanks`, and select **Public** for free GitHub Pages hosting. Leave **Include all branches** unchecked.
3. Create the repository. Edit its files on GitHub, or clone it to your computer.

A repository created from a template starts with a single commit. See GitHub's [template instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) and [Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Personalize the notes

Edit `thank-yous.js`. Keep the `default` entry, then replace or copy the `sample-guest` and `sample-family` entries for your recipients. Each key is the guest's URL slug.

Add entries **inside the existing `window.THANK_YOUS` object**, separated by commas. For example:

```js
"sample-guest": {
  displayName: "[Guest name]",
  gift: "the thoughtful baby gift",
  note: "Thank you for celebrating with us and for your thoughtful gift. We are so grateful for your kindness and support.",
  signature: "With love, [Your names]",
  photos: [
    {
      src: "assets/photos/placeholder.svg",
      alt: "An illustrated placeholder for a family photo",
      captionFront: "A little moment to share",
      captionBack: "Thank you for being part of this special time."
    }
  ]
}
```

| Field | What to change |
| --- | --- |
| Entry key | A unique slug, such as `sample-guest`; use lowercase letters, numbers, and hyphens. Quote keys containing hyphens. |
| `displayName` | The name shown in the heading and browser title. |
| `gift` | The gift or gesture, shown after “For”. |
| `note` | The thank-you message, rendered as plain text. |
| `signature` | Your closing and names. |
| `photos` | An array of photo objects, or `[]` for a note without photos. |

The site root and unknown guest slugs show the `default` entry, so personalize it too. Remove unused sample entries before sharing your site. Text fields are not HTML; escape double quotes inside JavaScript strings as `\"`, or use single quotes around those strings.

### Add photos

1. Put your images in `assets/photos/`.
2. Replace `src` with a path such as `assets/photos/photo-1.jpg`. Keep the path relative, with no leading `/`, so it works under a GitHub project URL.
3. Write descriptive `alt` text and captions for each card. Copy the photo object to add more images, with commas between objects.
4. Use `photos: []` to hide the photo gallery. The included `placeholder.svg` can remain as a sample illustration.

Filenames and paths are case-sensitive on GitHub Pages. Resize large images before uploading; roughly 1200 pixels wide is a useful starting point. Review photos for personal information and location metadata before publishing. A missing image displays an “Add photo here” placeholder.

### Adjust the appearance

Edit `styles.css` for colors, typography, spacing, and animations. Shared page wording is in `app.js`; page metadata and font links are in `index.html` and `404.html`. Keep shared content in both HTML files in sync, while preserving the routing code in `404.html`. The template loads fonts from Google Fonts and uses fallback fonts if they are unavailable.

## Preview locally

Install Python 3 if needed. Open a terminal in the repository folder and run:

```sh
python dev-server.py
```

On Windows, `py -3 dev-server.py` also works; some systems use `python3 dev-server.py`. Open these URLs in your browser:

```text
http://localhost:8000/
http://localhost:8000/sample-guest
http://localhost:8000/sample-family
```

Stop the server with **Ctrl+C**. Use the included server for clean guest URLs: a basic `python -m http.server` does not provide the required route fallback. Python is only a local preview tool and is not needed on GitHub Pages.

## Publish on GitHub Pages

1. Commit and push your edited files to your repository's default branch, usually `main`. Keep `index.html` at the top level of the repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select the branch containing your files and the **`/(root)`** folder, then select **Save**.
5. Wait for the Pages deployment to finish. Check the **Actions** tab for progress or errors, then use **Visit site** under **Settings → Pages**.
6. Open the default page and every guest link before sharing them. Future commits to the selected branch publish automatically.

The included `.nojekyll` file tells Pages to serve the static files without a Jekyll build. See GitHub's [publishing source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) and [site creation guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Share guest links

For a typical project repository, links look like:

```text
https://YOUR-USERNAME.github.io/YOUR-REPO/
https://YOUR-USERNAME.github.io/YOUR-REPO/sample-guest
https://YOUR-USERNAME.github.io/YOUR-REPO/sample-family
```

Replace the username, repository name, and guest slug with your own. A user or organization site uses a repository named `YOUR-USERNAME.github.io` and omits the repository segment from its URL. A site configured at a custom domain's root also omits that segment. GitHub explains these [site URL formats](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

Each guest slug occupies one path segment. A trailing slash on a guest link is supported. An unknown slug shows the default note and a setup message identifying the missing entry.

### How clean URLs work

There is no separate HTML file for each guest. GitHub Pages serves `404.html` for a path such as `/sample-guest`, and the JavaScript renders the matching note. Keep `404.html` in the publishing folder. This uses GitHub's [custom 404 page support](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site).

These clean links still return HTTP status **404**, even when the card renders correctly. Link checkers and some social previews may treat them as missing pages. The local development server returns **200** for its fallback, so it does not reproduce that HTTP status behavior.

## Troubleshooting

- **The page stays on “Loading”:** Check the browser's developer console and confirm `app.js` loaded from the published site.
- **The wrong note appears:** Match the link's slug to the entry key, and check that your latest changes have deployed. Unknown slugs use `default`. Also check the browser console for errors in `thank-yous.js`: missing commas, unescaped quotes, or an unquoted key containing a hyphen will prevent the guest data from loading.
- **An image is missing:** Check its committed filename, capitalization, and `src` path.
- **GitHub's error page appears instead of a card:** Check the Pages branch and `/(root)` selection, the deployment result, and that `404.html` is included.
- **Changes are not visible:** Check the latest Pages deployment and refresh the browser after it completes. GitHub says publishing can take up to ten minutes in its [site creation guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Files

```text
index.html                     Main page
404.html                       App shell for direct guest URLs on Pages
app.js                         Guest selection, rendering, and interactions
thank-yous.js                   Editable example notes and photo references
styles.css                     Theme and animations
assets/photos/placeholder.svg  Generic sample illustration
dev-server.py                  Local preview with clean-route fallback
LICENSE                        Apache License 2.0 terms
.nojekyll                      Disable Jekyll processing on Pages
tests/                         Routing and local preview regression checks
```

## Developer checks

These optional checks require Node.js 18 or newer and Python 3. Neither Node.js nor an extra package installation is needed to run or publish the site.

```sh
node --test tests/routing.test.js
python -m unittest discover -s tests
```

The checks cover root and guest URLs, trailing slashes, photo paths, default notes, and the local preview server. Before publishing, also try your cards on a phone and with keyboard navigation.

## License

This project is licensed under the [Apache License, Version 2.0](LICENSE). See the `LICENSE` file for the full terms and conditions.

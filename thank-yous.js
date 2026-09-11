/*
  Template examples only: replace the names, gifts, notes, and captions below.

  Each key becomes a guest URL, e.g. /sample-guest or /sample-family.
  Use lowercase letters, numbers, and hyphens; quote keys containing hyphens.
  Keep "default" for the home page and unrecognized guest links.

  Put your photos in assets/photos/ and use repo-relative paths without a
  leading slash. The included SVG is a generic placeholder, not a family photo.
  Use photos: [] for a note without photo cards.

  All entries and uploaded photos are public on GitHub Pages, even if you
  share a guest's link with only that guest. See README.md before publishing.
*/

window.THANK_YOUS = {
  default: {
    displayName: "Friends & Family",
    gift: "your love and support",
    note: "Thank you for celebrating our growing family. Your kindness means so much to us, and we are grateful to share this special time with you.",
    signature: "With love, [Your names]",
    photos: []
  },

  "sample-guest": {
    displayName: "Sample Guest",
    gift: "the thoughtful baby gift",
    note: "Thank you so much for your thoughtful gift and for celebrating with us. We appreciate your kindness and look forward to sharing many happy moments together.",
    signature: "With love, [Your names]",
    photos: [
      {
        src: "assets/photos/placeholder.svg",
        alt: "Illustrated placeholder for your own photo",
        captionFront: "A little moment to share",
        captionBack: "Thank you for being part of our story."
      },
      {
        src: "assets/photos/placeholder.svg",
        alt: "Illustrated placeholder for another photo",
        captionFront: "Made with love",
        captionBack: "We are grateful for your love and support."
      }
    ]
  },

  "sample-family": {
    displayName: "Sample Family",
    gift: "celebrating with us",
    note: "Thank you for helping us welcome our little one. Having your love and encouragement means so much to our growing family.",
    signature: "With love, [Your names]",
    photos: []
  }
};

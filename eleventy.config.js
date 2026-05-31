import { feedPlugin } from "@11ty/eleventy-plugin-rss";

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css/*");
  eleventyConfig.addPassthroughCopy("fonts/*");
  eleventyConfig.addCollection("topics", async () => {
    return [
      {
        name: "Tech",
        url: "/tech",
      },
      {
        name: "Esoterica",
        url: "/esoterica",
      },
      {
        name: "Art",
        url: "/art",
      },
      {
        name: "Now",
        url: "/now",
      },
    ];
  });
  eleventyConfig.addCollection("links", async () => {
    return [
      {
        name: "Github",
        url: "https://www.github.com/smilepl0x",
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/danny-faught",
      },
      {
        name: "RSS",
        url: "/feed.xml",
      },
    ];
  });
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: {
      name: "posts",
      limit: 20,
    },
    metadata: {
      language: "en",
      title: "shb",
      subtitle: "Blog, portfolio, social stuff, etc.",
      base: "https://shibby.tech/",
      author: {
        name: "Danny",
        email: "",
      },
    },
  });
}

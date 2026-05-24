export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css/*")
  eleventyConfig.addPassthroughCopy("fonts/*")
  eleventyConfig.addCollection("topics", async () => {
    return [
      {
        name: "Tech",
        url: "/tech"
      },
      {
        name: "Esoterica",
        url: "/esoterica"
      },
      {
        name: "Art",
        url: "/art"
      },
      {
        name: "Now",
        url: "/now"
      }
    ]
  })
  eleventyConfig.addCollection("links", async () => {
    return [
      {
        name: "Github",
        url: "https://www.github.com/smilepl0x"
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/danny-faught"
      }
    ]
  })
};

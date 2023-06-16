const { normalizeURL, getURLsFromHTML, crawlPage } = require("./crawl.js");

const main = async () => {
  // if # cli arguments !== 1, print error, exit
  if (process.argv.length !== 3) {
    console.log(process.argv);
    console.error(
      "Sorry, I can only accept one URL at this time. Please try the program again.",
    );
  }

  const baseURL = process.argv[2];

  const pageCounts = await crawlPage(baseURL, baseURL, {});
  console.log(pageCounts);

  // const argument = require("readline").createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });

  // readline.question(
  //   "Which URL would you like to parse for its links? ",
  //   (url) => {
  //     getURLsFromHTML()
  //     console.log();
  //   },
  // );
};

main();

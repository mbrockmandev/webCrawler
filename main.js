const { crawlPage } = require("./crawl.js");
const { printReport } = require("./report.js");

const main = async () => {
  // if # cli arguments !== 1, print error, exit
  if (process.argv.length !== 3) {
    console.log(process.argv);
    console.error(
      "Sorry, I can only accept one URL at this time. Please try the program again.",
    );
  }

  const baseURL = process.argv[2];

  const pages = await crawlPage(baseURL, baseURL, {});
  printReport(pages);
};

main();

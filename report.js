const printReport = (pages) => {
  console.log("***REPORT***");
  const pagesArr = Object.entries(pages);
  const sortedPagesArr = pagesArr.sort((a, b) => b[1] - a[1]);

  for (let page of sortedPagesArr) {
    [url, count] = page;
    console.log(`Found ${count} internal links to ${url}`);
  }
};

module.exports = {
  printReport,
};

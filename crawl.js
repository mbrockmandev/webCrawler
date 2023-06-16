const { JSDOM } = require("jsdom");

/** @param {string} urlString */
const normalizeURL = (urlString) => {
  try {
    // make new URL object, contains some normalization
    let normalURL = new URL(urlString.toLowerCase());
    normalURL.hostname = normalURL.hostname.toLowerCase();

    if (normalURL.protocol !== "https:") {
      throw new Error("Invalid protocol.");
    }
    normalURL.protocol = "https:";
    normalURL.port = "";

    if (!normalURL.pathname.startsWith("/")) {
      normalURL.pathname = "/" + normalURL.pathname;
    }

    if (normalURL.pathname.endsWith("/")) {
      normalURL.pathname = normalURL.pathname.slice(0, -1);
    }

    normalURL.pathname = normalURL.pathname
      .split("/")
      .filter((s) => s !== "")
      .join("/");

    // check the search params and sort them
    if (normalURL.search) {
      let params = Array.from(normalURL.searchParams.entries());
      params.sort();
      normalURL.search = "?" + new URLSearchParams(params.toString());
    }

    // remove hash property
    normalURL.hash = "";

    // return full URL
    return normalURL.href;
  } catch (error) {
    console.error(error);
  }
};

/**
 * @param {string} htmlBody
 * @param {string} baseURL
 * @returns {NodeListOf<HTMLAnchorElement>}
 */
const getURLsFromHTML = (htmlBody, baseURL) => {
  const dom = new JSDOM(htmlBody, {
    url: baseURL,
  });

  const allLinks = dom.window.document.querySelectorAll("a");
  const urls = [...allLinks].map((a) => a.href);

  return urls;
};

/**
 * @param {string} baseURL
 * @param {string} currentURL
 * @param {object} pages
 */
const crawlPage = async (baseURL, currentURL, pages) => {
  //1 check domain of current and base URLs
  // if not on same domain, return pages (don't crawl the whole internet)
  const baseDomain = new URL(baseURL).hostname;
  const currentDomain = new URL(currentURL).hostname;

  if (baseDomain !== currentDomain) {
    return pages;
  }

  //2 get normalized version of currentURL
  const normalCurrentURL = normalizeURL(currentURL);

  //3 if pages already has an entry for that normalized version
  // increment count and return pages
  if (pages[normalCurrentURL]) {
    pages[normalCurrentURL].count++;
    return pages;
  }

  pages[normalCurrentURL] = 1;

  //4 if we got here, this is a new URL and needs to be requested
  // console.log this so you can watch it crawl
  const validStatuses = [200, 201, 202, 203, 204];

  console.log(normalCurrentURL);
  try {
    const res = await fetch(normalCurrentURL);

    // invalid status (not 200-204)
    if (!validStatuses.includes(res.status)) {
      throw new Error(
        `Something went wrong, here's a status code: ${res.status}`,
      );
    }

    // not html!
    if (!res.headers.get("Content-Type").includes("text/html")) {
      throw new Error(
        `UH-OH, Wrong Content-Type: ${res.headers.get("Content-Type")}`,
      );
    }

    // get html content
    const html = await res.text();
    //5 get all URLs from response body HTML
    const urls = getURLsFromHTML(html, baseURL);
    for (let url of urls) {
      //6 recurse, crawling all URLs on page and update pages for the counts
      pages = await crawlPage(baseURL, url, pages);
    }

    //7 finally, return pages
    return pages;
  } catch (error) {
    console.error(error);
    return pages;
  }
};

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};

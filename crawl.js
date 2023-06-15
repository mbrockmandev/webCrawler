/** @param {string} urlString */
const normalizeURL = (urlString) => {
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
};

module.exports = {
  normalizeURL,
};

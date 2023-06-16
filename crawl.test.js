const { normalizeURL, getURLsFromHTML } = require("./crawl");

test("should normalize url", () => {
  const url = "https://TEST.com/";
  expect(normalizeURL(url)).toEqual("https://test.com/");
  expect(normalizeURL("https://wagsLane.Dev/path")).toEqual(
    "https://wagslane.dev/path",
  );
});

test("should catch an error", () => {
  try {
    normalizeURL("ftp://wagslane.com/");
    expect(true).toBe(false);
  } catch (error) {
    expect(error.message).toEqual("Invalid protocol.");
  }
});

test("should remove redundant slashes in the path", () => {
  expect(normalizeURL("https://google.com//path")).toBe(
    "https://google.com/path",
  );
});

test("should return relative URLs from absolute URLs", () => {
  const testHTMLBody = `<html><body><a href="/about/"><span>Go to Boot.dev</span></a></body></html>`;
  const baseURL = "https://boot.dev";
  const htmlLink = "https://boot.dev/about/";
  expect(getURLsFromHTML(testHTMLBody, baseURL)).toStrictEqual([htmlLink]);
});

test("should return the link tags for a given html body", () => {
  const testHTMLBody = `<html><body><a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
  <a href="https://blog.bootie.devs"></a><a href="/about/"></a><span>Go to Boot.dev</span></a></body></html>`;
  const baseURL = "https://boot.dev";
  const links = [
    "https://blog.boot.dev/",
    "https://blog.bootie.devs/",
    "https://boot.dev/about/",
  ];
  expect(getURLsFromHTML(testHTMLBody, baseURL)).toStrictEqual(links);
});

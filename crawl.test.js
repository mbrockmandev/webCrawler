const { normalizeURL } = require("./crawl");

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

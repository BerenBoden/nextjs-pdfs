//You could probably use axios and cheerio for this, but puppeteer was already installed.
import puppeteer from "puppeteer";
import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://nextjs.org/sitemap.xml");

  const urls = await page.evaluate(() => {
    let urls = [];
    let elements = document.querySelectorAll("loc");
    for (let element of elements) {
      let url = element.textContent;
      //Include what you want to filter, use "/docs/pages" to get the docs for the older version of Next.js.
      if (url.includes("/docs/app")) {
        urls.push({ url });
      }
    }
    return urls;
  });

  fs.writeFile(
    path.join(__dirname, "urls.json"),
    JSON.stringify(urls, null, 2),
    (err) => {
      if (err) throw err;
      console.log("URLs written to file");
    }
  );

  await browser.close();
})();

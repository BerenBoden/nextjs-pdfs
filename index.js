import puppeteer from "puppeteer";
import fs from "node:fs";
import { PDFDocument } from "pdf-lib";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const urls = JSON.parse(fs.readFileSync("utils/urls.json", "utf8"));
  // Generate a PDF for each URL
  for (let i = 0; i < urls.length; i++) {
    console.log(`Processing URL ${i + 1}/${urls.length}: ${urls[i].url}`);
    await page.goto(urls[i].url);
    // Remove the footer elements
    await page.evaluate(() => {
      let elements = document.querySelectorAll(
        "nav.pagination_pagination__ymuwv, form.flex.justify-center.mt-10"
      );
      for (let element of elements) {
        element.parentNode.removeChild(element);
      }
    });
    await page.evaluate(() => {
      let element = document.querySelector(".footer_root__cGO9d");
      if (element) element.parentNode.removeChild(element);
    });
    await page.pdf({ path: `docs/output${i}.pdf`, format: "A4" });
  }
  // Merge the PDFs
  const mergedPdf = await PDFDocument.create();
  for (let i = 0; i < urls.length; i++) {
    const pdfBytes = fs.readFileSync(`docs/output${i}.pdf`);
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    for (const page of pages) {
      mergedPdf.addPage(page);
    }
  }
  // Save the merged PDF
  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync("output.pdf", mergedPdfBytes);

  await browser.close();
  console.log("Done!");
})();

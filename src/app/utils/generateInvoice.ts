/* eslint-disable @typescript-eslint/no-explicit-any */
import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";

export const generateInvoicePDF = async (data: any) => {
  const templatePath = path.join(__dirname, "../templates/invoice.ejs");

  const html = (await ejs.renderFile(templatePath, data)) as string;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfPath = `invoice-${Date.now()}.pdf`;

  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdfPath;
};

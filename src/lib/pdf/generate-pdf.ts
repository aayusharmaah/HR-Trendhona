import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { CompanySettings } from "@/types/company";
import { Block, TextRun, parseHtmlToBlocks } from "@/lib/pdf/html-to-blocks";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const BOTTOM_MARGIN = 66;
const TOP_MARGIN_NEXT = 74;

const BODY_SIZE = 10.5;
const LINE_HEIGHT = 15.5;
const PARA_GAP = 8;

const BRAND_PURPLE = rgb(124 / 255, 58 / 255, 237 / 255);
const INK = rgb(0.11, 0.08, 0.14);
const MUTED = rgb(0.44, 0.4, 0.47);
const BORDER = rgb(0.85, 0.82, 0.87);

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
  boldItalic: PDFFont;
}

interface Word {
  text: string;
  bold: boolean;
  italic: boolean;
  forceBreak?: boolean;
}

function fontFor(fonts: Fonts, bold: boolean, italic: boolean): PDFFont {
  if (bold && italic) return fonts.boldItalic;
  if (bold) return fonts.bold;
  if (italic) return fonts.italic;
  return fonts.regular;
}

function runsToWords(runs: TextRun[]): Word[] {
  const words: Word[] = [];
  for (const run of runs) {
    if (run.text === "\n") {
      words.push({ text: "", bold: run.bold, italic: run.italic, forceBreak: true });
      continue;
    }
    const parts = run.text.split(/\s+/).filter(Boolean);
    for (const p of parts) words.push({ text: p, bold: run.bold, italic: run.italic });
  }
  return words;
}

function wrapWords(
  words: Word[],
  maxWidth: number,
  size: number,
  fonts: Fonts
): Word[][] {
  const lines: Word[][] = [];
  let current: Word[] = [];
  let cursor = 0;
  const spaceWidth = fonts.regular.widthOfTextAtSize(" ", size);

  for (const word of words) {
    if (word.forceBreak) {
      lines.push(current);
      current = [];
      cursor = 0;
      continue;
    }
    const w = fontFor(fonts, word.bold, word.italic).widthOfTextAtSize(word.text, size);
    if (current.length > 0 && cursor + spaceWidth + w > maxWidth) {
      lines.push(current);
      current = [word];
      cursor = w;
    } else {
      if (current.length > 0) cursor += spaceWidth;
      current.push(word);
      cursor += w;
    }
  }
  if (current.length > 0 || lines.length === 0) lines.push(current);
  return lines;
}

function lineWidth(line: Word[], size: number, fonts: Fonts): number {
  const spaceWidth = fonts.regular.widthOfTextAtSize(" ", size);
  return line.reduce((sum, w, i) => {
    const ww = fontFor(fonts, w.bold, w.italic).widthOfTextAtSize(w.text, size);
    return sum + ww + (i > 0 ? spaceWidth : 0);
  }, 0);
}

class Layout {
  doc: PDFDocument;
  fonts: Fonts;
  pages: PDFPage[] = [];
  page: PDFPage;
  y = 0;
  company: CompanySettings;
  docTitle: string;
  logoImage: Awaited<ReturnType<PDFDocument["embedPng"]>> | null = null;
  logoDims = { width: 0, height: 0 };

  constructor(doc: PDFDocument, fonts: Fonts, company: CompanySettings, docTitle: string) {
    this.doc = doc;
    this.fonts = fonts;
    this.company = company;
    this.docTitle = docTitle;
    this.page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.pages.push(this.page);
  }

  newPage(withHeader = true) {
    this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.pages.push(this.page);
    this.y = PAGE_HEIGHT - TOP_MARGIN_NEXT;
    if (withHeader) this.drawContinuationHeader();
  }

  ensureSpace(height: number) {
    if (this.y - height < BOTTOM_MARGIN) {
      this.newPage();
    }
  }

  drawContinuationHeader() {
    const { company, docTitle } = this;
    this.page.drawText(company.companyName || "Company", {
      x: MARGIN_X,
      y: PAGE_HEIGHT - 46,
      size: 9,
      font: this.fonts.bold,
      color: MUTED,
    });
    const rightText = docTitle;
    const w = this.fonts.regular.widthOfTextAtSize(rightText, 9);
    this.page.drawText(rightText, {
      x: PAGE_WIDTH - MARGIN_X - w,
      y: PAGE_HEIGHT - 46,
      size: 9,
      font: this.fonts.regular,
      color: MUTED,
    });
    this.page.drawLine({
      start: { x: MARGIN_X, y: PAGE_HEIGHT - 54 },
      end: { x: PAGE_WIDTH - MARGIN_X, y: PAGE_HEIGHT - 54 },
      thickness: 0.75,
      color: BORDER,
    });
  }

  async drawLetterhead() {
    const { company, docTitle } = this;
    let cursorX = MARGIN_X;
    const topY = PAGE_HEIGHT - 60;

    if (this.logoImage) {
      const h = 34;
      const w = (this.logoDims.width / this.logoDims.height) * h;
      this.page.drawImage(this.logoImage, { x: cursorX, y: topY - h + 8, width: w, height: h });
      cursorX += w + 12;
    }

    this.page.drawText(company.companyName || "Company Name", {
      x: cursorX,
      y: topY,
      size: 17,
      font: this.fonts.bold,
      color: INK,
    });

    const contactLine = [company.officeAddress, company.companyEmail, company.website]
      .filter(Boolean)
      .join("  •  ");
    if (contactLine) {
      this.page.drawText(contactLine, {
        x: cursorX,
        y: topY - 18,
        size: 8.5,
        font: this.fonts.regular,
        color: MUTED,
        maxWidth: CONTENT_WIDTH,
      });
    }

    this.page.drawLine({
      start: { x: MARGIN_X, y: topY - 34 },
      end: { x: PAGE_WIDTH - MARGIN_X, y: topY - 34 },
      thickness: 1.4,
      color: BRAND_PURPLE,
    });

    const titleWidth = this.fonts.bold.widthOfTextAtSize(docTitle.toUpperCase(), 12.5);
    this.page.drawText(docTitle.toUpperCase(), {
      x: (PAGE_WIDTH - titleWidth) / 2,
      y: topY - 60,
      size: 12.5,
      font: this.fonts.bold,
      color: BRAND_PURPLE,
    });

    this.y = topY - 90;
  }

  drawWordsLine(line: Word[], x: number, y: number, size: number, align: "left" | "center" | "right") {
    const width = lineWidth(line, size, this.fonts);
    let startX = x;
    if (align === "center") startX = x + (CONTENT_WIDTH - width) / 2;
    if (align === "right") startX = x + (CONTENT_WIDTH - width);

    let cursor = startX;
    const spaceWidth = this.fonts.regular.widthOfTextAtSize(" ", size);
    for (const word of line) {
      const font = fontFor(this.fonts, word.bold, word.italic);
      this.page.drawText(word.text, { x: cursor, y, size, font, color: INK });
      cursor += font.widthOfTextAtSize(word.text, size) + spaceWidth;
    }
  }

  drawParagraphRuns(runs: TextRun[], align: "left" | "center" | "right", size = BODY_SIZE, indent = 0) {
    const words = runsToWords(runs);
    const lines = wrapWords(words, CONTENT_WIDTH - indent, size, this.fonts);
    for (const line of lines) {
      this.ensureSpace(LINE_HEIGHT);
      this.drawWordsLine(line, MARGIN_X + indent, this.y, size, align);
      this.y -= LINE_HEIGHT;
    }
  }

  drawBlock(block: Block) {
    if (block.type === "rule") {
      this.ensureSpace(PARA_GAP);
      this.y -= PARA_GAP * 0.6;
      return;
    }

    if (block.type === "heading") {
      const size = block.level === 1 ? 15 : block.level === 2 ? 12.5 : 11;
      this.ensureSpace(size + 14);
      this.y -= 4;
      const words = runsToWords(block.runs).map((w) => ({ ...w, bold: true }));
      const lines = wrapWords(words, CONTENT_WIDTH, size, this.fonts);
      for (const line of lines) {
        this.ensureSpace(size + 4);
        this.drawWordsLine(line, MARGIN_X, this.y, size, block.align);
        this.y -= size + 4;
      }
      this.y -= 4;
      return;
    }

    if (block.type === "paragraph") {
      this.drawParagraphRuns(block.runs, block.align);
      this.y -= PARA_GAP;
      return;
    }

    if (block.type === "list") {
      for (let i = 0; i < block.items.length; i++) {
        const marker = block.ordered ? `${i + 1}.` : "•";
        this.ensureSpace(LINE_HEIGHT);
        this.page.drawText(marker, {
          x: MARGIN_X,
          y: this.y,
          size: BODY_SIZE,
          font: this.fonts.bold,
          color: BRAND_PURPLE,
        });
        const words = runsToWords(block.items[i]);
        const indent = 16;
        const lines = wrapWords(words, CONTENT_WIDTH - indent, BODY_SIZE, this.fonts);
        lines.forEach((line, li) => {
          if (li > 0) this.ensureSpace(LINE_HEIGHT);
          this.drawWordsLine(line, MARGIN_X + indent, this.y, BODY_SIZE, "left");
          this.y -= LINE_HEIGHT;
        });
      }
      this.y -= PARA_GAP * 0.5;
      return;
    }

    if (block.type === "table") {
      const numCols = Math.max(...block.rows.map((r) => r.length));
      const colWidth = CONTENT_WIDTH / numCols;
      const cellPad = 6;
      const fontSize = 9.5;

      for (const row of block.rows) {
        const cellLines: Word[][][] = row.map((cellRuns) =>
          wrapWords(runsToWords(cellRuns), colWidth - cellPad * 2, fontSize, this.fonts)
        );
        const rowLineCount = Math.max(1, ...cellLines.map((l) => l.length));
        const rowHeight = rowLineCount * (fontSize + 4) + cellPad * 2;

        this.ensureSpace(rowHeight);
        const rowTop = this.y;
        const rowBottom = this.y - rowHeight;

        for (let c = 0; c < numCols; c++) {
          const cellX = MARGIN_X + c * colWidth;
          this.page.drawRectangle({
            x: cellX,
            y: rowBottom,
            width: colWidth,
            height: rowHeight,
            borderColor: BORDER,
            borderWidth: 0.75,
          });
          const lines = cellLines[c] || [];
          let ty = rowTop - cellPad - fontSize + 2;
          for (const line of lines) {
            let cursor = cellX + cellPad;
            for (const w of line) {
              const font = fontFor(this.fonts, w.bold, w.italic);
              this.page.drawText(w.text, { x: cursor, y: ty, size: fontSize, font, color: INK });
              cursor += font.widthOfTextAtSize(w.text, fontSize) + this.fonts.regular.widthOfTextAtSize(" ", fontSize);
            }
            ty -= fontSize + 4;
          }
        }
        this.y = rowBottom;
      }
      this.y -= PARA_GAP;
      return;
    }
  }

  drawFootersOnAllPages() {
    const total = this.pages.length;
    this.pages.forEach((page, i) => {
      page.drawLine({
        start: { x: MARGIN_X, y: 46 },
        end: { x: PAGE_WIDTH - MARGIN_X, y: 46 },
        thickness: 0.75,
        color: BORDER,
      });
      const left = [this.company.companyName, this.company.website].filter(Boolean).join(" • ");
      page.drawText(left, { x: MARGIN_X, y: 32, size: 8, font: this.fonts.regular, color: MUTED });

      const right = `Page ${i + 1} of ${total}`;
      const w = this.fonts.regular.widthOfTextAtSize(right, 8);
      page.drawText(right, {
        x: PAGE_WIDTH - MARGIN_X - w,
        y: 32,
        size: 8,
        font: this.fonts.regular,
        color: MUTED,
      });
    });
  }
}

function base64ToBytes(dataUrl: string): { bytes: Uint8Array; isPng: boolean } {
  const isPng = dataUrl.startsWith("data:image/png");
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { bytes, isPng };
}

export interface GeneratePdfOptions {
  documentName: string;
  candidateName: string;
  bodyHtml: string;
  company: CompanySettings;
}

export async function generateDocumentPdf(opts: GeneratePdfOptions): Promise<Uint8Array> {
  const { documentName, bodyHtml, company } = opts;
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`${documentName} - ${opts.candidateName}`);
  pdfDoc.setProducer("Trendhona HR Document Generator");
  pdfDoc.setCreator("Trendhona HR");

  const fonts: Fonts = {
    regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
    bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    italic: await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
    boldItalic: await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique),
  };

  const layout = new Layout(pdfDoc, fonts, company, documentName);

  if (company.logoDataUrl) {
    try {
      const { bytes, isPng } = base64ToBytes(company.logoDataUrl);
      const image = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
      layout.logoImage = image;
      layout.logoDims = { width: image.width, height: image.height };
    } catch {
      layout.logoImage = null;
    }
  }

  await layout.drawLetterhead();

  const blocks = parseHtmlToBlocks(bodyHtml);
  for (const block of blocks) layout.drawBlock(block);

  layout.drawFootersOnAllPages();

  return pdfDoc.save();
}

export function downloadPdfBytes(bytes: Uint8Array, fileName: string) {
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

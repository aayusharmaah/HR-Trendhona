export type Align = "left" | "center" | "right";

export interface TextRun {
  text: string;
  bold: boolean;
  italic: boolean;
}

export interface ParagraphBlock {
  type: "paragraph";
  align: Align;
  runs: TextRun[];
}

export interface HeadingBlock {
  type: "heading";
  level: 1 | 2 | 3;
  align: Align;
  runs: TextRun[];
}

export interface ListBlock {
  type: "list";
  ordered: boolean;
  items: TextRun[][];
}

export interface TableBlock {
  type: "table";
  rows: TextRun[][][]; // rows -> cells -> runs
}

export interface RuleBlock {
  type: "rule";
}

export type Block = ParagraphBlock | HeadingBlock | ListBlock | TableBlock | RuleBlock;

function getAlign(el: Element): Align {
  const style = el.getAttribute("style") || "";
  if (/text-align:\s*center/.test(style) || el.getAttribute("align") === "center") return "center";
  if (/text-align:\s*right/.test(style) || el.getAttribute("align") === "right") return "right";
  return "left";
}

/** Recursively walks inline children, producing plain-text runs with bold/italic flags. */
function extractRuns(node: Node, bold = false, italic = false): TextRun[] {
  const runs: TextRun[] = [];
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? "";
      if (text.length > 0) runs.push({ text, bold, italic });
      return;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) return;
    const el = child as Element;
    const tag = el.tagName.toLowerCase();
    if (tag === "br") {
      runs.push({ text: "\n", bold, italic });
      return;
    }
    const nextBold = bold || tag === "strong" || tag === "b";
    const nextItalic = italic || tag === "em" || tag === "i";
    runs.push(...extractRuns(el, nextBold, nextItalic));
  });
  return runs;
}

export function parseHtmlToBlocks(html: string): Block[] {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") return [];
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return [];

  const blocks: Block[] = [];

  root.childNodes.forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    if (tag === "h1" || tag === "h2" || tag === "h3") {
      const level = tag === "h1" ? 1 : tag === "h2" ? 2 : 3;
      blocks.push({ type: "heading", level, align: getAlign(el), runs: extractRuns(el) });
      return;
    }

    if (tag === "p" || tag === "blockquote") {
      const runs = extractRuns(el);
      const hasText = runs.some((r) => r.text.trim().length > 0);
      if (!hasText) {
        blocks.push({ type: "rule" } as RuleBlock); // treat empty <p> as a small vertical gap marker
        return;
      }
      blocks.push({ type: "paragraph", align: getAlign(el), runs });
      return;
    }

    if (tag === "ul" || tag === "ol") {
      const items: TextRun[][] = [];
      el.querySelectorAll(":scope > li").forEach((li) => {
        items.push(extractRuns(li));
      });
      blocks.push({ type: "list", ordered: tag === "ol", items });
      return;
    }

    if (tag === "table") {
      const rows: TextRun[][][] = [];
      el.querySelectorAll("tr").forEach((tr) => {
        const cells: TextRun[][] = [];
        tr.querySelectorAll("td, th").forEach((cell) => {
          cells.push(extractRuns(cell));
        });
        if (cells.length) rows.push(cells);
      });
      if (rows.length) blocks.push({ type: "table", rows });
      return;
    }

    if (tag === "hr") {
      blocks.push({ type: "rule" });
      return;
    }

    // Fallback: treat unknown block-level containers as a paragraph
    const runs = extractRuns(el);
    if (runs.some((r) => r.text.trim().length > 0)) {
      blocks.push({ type: "paragraph", align: getAlign(el), runs });
    }
  });

  return blocks;
}

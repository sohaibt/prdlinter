import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Polyfill browser globals that pdfjs-dist expects but don't exist in Node.js
const g = globalThis as Record<string, unknown>;
if (!g.DOMMatrix) {
  // Minimal DOMMatrix polyfill — pdfjs only needs basic matrix ops for text extraction
  class DOMMatrixPoly {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    isIdentity = true;
    constructor(init?: string | number[]) {
      if (Array.isArray(init) && init.length >= 6) {
        [this.a, this.b, this.c, this.d, this.e, this.f] = init;
        this.isIdentity = false;
      }
    }
    translate() { return new DOMMatrixPoly(); }
    scale() { return new DOMMatrixPoly(); }
    multiply() { return new DOMMatrixPoly(); }
    inverse() { return new DOMMatrixPoly(); }
    transformPoint() { return { x: 0, y: 0 }; }
  }
  g.DOMMatrix = DOMMatrixPoly;
}
if (!g.Path2D) {
  g.Path2D = class Path2D { addPath() {} closePath() {} moveTo() {} lineTo() {} bezierCurveTo() {} rect() {} };
}
if (!g.ImageData) {
  g.ImageData = class ImageData { width = 0; height = 0; data = new Uint8ClampedArray(); constructor(w: number, h: number) { this.width = w; this.height = h; this.data = new Uint8ClampedArray(w * h * 4); } };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(buffer);

    // Pre-load the worker into globalThis so pdfjs-dist uses it inline
    // instead of trying to dynamically import a worker file (which fails in
    // serverless / bundled environments like Netlify).
    // @ts-expect-error -- no type declarations for the worker bundle
    const workerModule = await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
    (globalThis as Record<string, unknown>).pdfjsWorker = workerModule;

    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const doc = await pdfjsLib.getDocument({
      data: uint8,
      useSystemFonts: true,
    }).promise;
    const pages: string[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items
        .filter(
          (item: unknown) =>
            typeof (item as { str?: string }).str === "string"
        )
        .map((item: unknown) => (item as { str: string }).str);
      pages.push(strings.join(" "));
    }

    const text = pages.join("\n\n");

    return NextResponse.json({ text });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("PDF parse error:", message, error);
    return NextResponse.json(
      { error: `Failed to parse PDF: ${message}` },
      { status: 500 }
    );
  }
}

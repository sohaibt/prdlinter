import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

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

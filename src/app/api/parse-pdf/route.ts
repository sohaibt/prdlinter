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

    // Dynamically import pdfjs-dist to avoid bundling issues
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const doc = await pdfjsLib.getDocument({ data: uint8 }).promise;
    const pages: string[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items
        .filter((item: unknown) => typeof (item as { str?: string }).str === "string")
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

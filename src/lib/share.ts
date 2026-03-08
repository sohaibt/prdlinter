import type { AnalysisResult } from "./llm";

/**
 * Compress an AnalysisResult into a URL-safe base64 string using
 * the browser's built-in CompressionStream (deflate-raw).
 */
export async function encodeResult(result: AnalysisResult): Promise<string> {
  const json = JSON.stringify(result);
  const encoded = new TextEncoder().encode(json);

  const cs = new CompressionStream("deflate-raw");
  const writer = cs.writable.getWriter();
  writer.write(encoded);
  writer.close();

  const chunks: Uint8Array[] = [];
  const reader = cs.readable.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const compressed = new Uint8Array(
    chunks.reduce((acc, c) => acc + c.length, 0)
  );
  let offset = 0;
  for (const chunk of chunks) {
    compressed.set(chunk, offset);
    offset += chunk.length;
  }

  // Convert to base64url (URL-safe)
  let binaryStr = "";
  for (let i = 0; i < compressed.length; i++) {
    binaryStr += String.fromCharCode(compressed[i]);
  }
  const b64 = btoa(binaryStr)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return b64;
}

/**
 * Decode a base64url-compressed string back into an AnalysisResult.
 */
export async function decodeResult(encoded: string): Promise<AnalysisResult> {
  // Restore standard base64
  const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const compressed = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    compressed[i] = binary.charCodeAt(i);
  }

  const ds = new DecompressionStream("deflate-raw");
  const writer = ds.writable.getWriter();
  writer.write(compressed);
  writer.close();

  const chunks: Uint8Array[] = [];
  const reader = ds.readable.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const decompressed = new Uint8Array(
    chunks.reduce((acc, c) => acc + c.length, 0)
  );
  let offset = 0;
  for (const chunk of chunks) {
    decompressed.set(chunk, offset);
    offset += chunk.length;
  }

  const json = new TextDecoder().decode(decompressed);
  return JSON.parse(json) as AnalysisResult;
}

/**
 * Generate a shareable URL containing the compressed analysis result.
 */
export async function generateShareUrl(result: AnalysisResult): Promise<string> {
  const encoded = await encodeResult(result);
  const url = new URL(window.location.origin);
  url.searchParams.set("r", encoded);
  return url.toString();
}

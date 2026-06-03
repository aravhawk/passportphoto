// Canvas exports carry no physical-resolution metadata, so a 600x600 file prints
// at whatever size the printer guesses. These helpers stamp 300 DPI into the
// encoded bytes (PNG pHYs chunk / JPEG JFIF density) so prints come out true 2x2".

import { DPI } from "./passport";

const PIXELS_PER_METER = Math.round(DPI / 0.0254); // 300 dpi -> 11811 ppm

let crcTable: Uint32Array | null = null;
function getCrcTable(): Uint32Array {
  if (crcTable) return crcTable;
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  crcTable = table;
  return table;
}

function crc32(bytes: Uint8Array): number {
  const table = getCrcTable();
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = table[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Builds a complete PNG pHYs chunk (length + type + data + CRC).
function buildPhysChunk(): Uint8Array {
  const type = new Uint8Array([0x70, 0x48, 0x59, 0x73]); // "pHYs"
  const data = new Uint8Array(9);
  const dv = new DataView(data.buffer);
  dv.setUint32(0, PIXELS_PER_METER);
  dv.setUint32(4, PIXELS_PER_METER);
  data[8] = 1; // unit specifier: 1 = meters

  const typeAndData = new Uint8Array(type.length + data.length);
  typeAndData.set(type, 0);
  typeAndData.set(data, type.length);

  const chunk = new Uint8Array(4 + typeAndData.length + 4);
  const cdv = new DataView(chunk.buffer);
  cdv.setUint32(0, data.length);
  chunk.set(typeAndData, 4);
  cdv.setUint32(4 + typeAndData.length, crc32(typeAndData));
  return chunk;
}

// Inserts pHYs immediately after IHDR (where it must legally appear, before IDAT).
function patchPngDpi(bytes: Uint8Array): Uint8Array {
  // 8-byte signature, then IHDR: length(4)+type(4)+data(13)+crc(4) = 25 bytes.
  const insertAt = 8 + 25;
  const isPng =
    bytes.length > insertAt &&
    bytes[12] === 0x49 && bytes[13] === 0x48 && bytes[14] === 0x44 && bytes[15] === 0x52; // "IHDR"
  if (!isPng) return bytes;

  const chunk = buildPhysChunk();
  const out = new Uint8Array(bytes.length + chunk.length);
  out.set(bytes.subarray(0, insertAt), 0);
  out.set(chunk, insertAt);
  out.set(bytes.subarray(insertAt), insertAt + chunk.length);
  return out;
}

// Rewrites density fields in the JFIF APP0 segment that canvas JPEGs include.
function patchJpegDpi(bytes: Uint8Array): Uint8Array {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return bytes; // not a JPEG
  let i = 2;
  while (i + 1 < bytes.length) {
    if (bytes[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = bytes[i + 1];
    if (marker === 0xd9 || marker === 0xda) break; // EOI / start of scan
    if (marker === 0xe0 && i + 17 < bytes.length) {
      const isJfif =
        bytes[i + 4] === 0x4a && bytes[i + 5] === 0x46 &&
        bytes[i + 6] === 0x49 && bytes[i + 7] === 0x46; // "JFIF"
      if (isJfif) {
        const out = bytes.slice();
        out[i + 11] = 1; // density units: 1 = dots per inch
        out[i + 12] = (DPI >> 8) & 0xff;
        out[i + 13] = DPI & 0xff;
        out[i + 14] = (DPI >> 8) & 0xff;
        out[i + 15] = DPI & 0xff;
        return out;
      }
    }
    const len = (bytes[i + 2] << 8) | bytes[i + 3];
    if (len < 2) break;
    i += 2 + len;
  }
  return bytes;
}

export function stampDpi(bytes: Uint8Array, mime: string): Uint8Array {
  if (mime === "image/png") return patchPngDpi(bytes);
  if (mime === "image/jpeg") return patchJpegDpi(bytes);
  return bytes;
}

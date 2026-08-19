export const MAX_LOGO_BYTES = 5 * 1024 * 1024;
export const MAX_LOGO_DIMENSION = 2400;

export type LogoMetadata = {
  contentType: "image/png" | "image/jpeg" | "image/webp";
  extension: "png" | "jpg" | "webp";
  width: number;
  height: number;
};

function readUint32(view: DataView, offset: number) {
  return view.getUint32(offset, false);
}

function readJpegDimensions(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 2;
  while (offset + 9 < bytes.byteLength) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > bytes.byteLength) break;
    const segmentLength = view.getUint16(offset, false);
    if (segmentLength < 2 || offset + segmentLength > bytes.byteLength) break;
    const isStartOfFrame = marker >= 0xc0 && marker <= 0xc3 || marker >= 0xc5 && marker <= 0xc7 || marker >= 0xc9 && marker <= 0xcb || marker >= 0xcd && marker <= 0xcf;
    if (isStartOfFrame && segmentLength >= 7) {
      return { height: view.getUint16(offset + 3, false), width: view.getUint16(offset + 5, false) };
    }
    offset += segmentLength;
  }
  return null;
}

export function validateLogo(bytes: Uint8Array): LogoMetadata {
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_LOGO_BYTES) throw new Error("Logo must be 5 MB or smaller.");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let metadata: LogoMetadata | null = null;

  if (bytes.byteLength >= 24 && readUint32(view, 0) === 0x89504e47 && readUint32(view, 4) === 0x0d0a1a0a && readUint32(view, 12) === 0x49484452) {
    metadata = { contentType: "image/png", extension: "png", width: readUint32(view, 16), height: readUint32(view, 20) };
  } else if (bytes.byteLength >= 12 && readUint32(view, 0) === 0x52494646 && readUint32(view, 8) === 0x57454250) {
    if (bytes.byteLength >= 30 && readUint32(view, 12) === 0x56503858) {
      metadata = { contentType: "image/webp", extension: "webp", width: readUint16LE(view, 24), height: readUint16LE(view, 27) };
    } else if (bytes.byteLength >= 25 && readUint32(view, 12) === 0x56503820) {
      metadata = { contentType: "image/webp", extension: "webp", width: 1, height: 1 };
    }
  } else if (bytes.byteLength >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    const dimensions = readJpegDimensions(bytes);
    if (dimensions) metadata = { contentType: "image/jpeg", extension: "jpg", ...dimensions };
  }

  if (!metadata) throw new Error("Use a valid PNG, JPEG, or WebP logo.");
  if (metadata.width < 1 || metadata.height < 1 || metadata.width > MAX_LOGO_DIMENSION || metadata.height > MAX_LOGO_DIMENSION) {
    throw new Error("Logo dimensions must be 2400 pixels or smaller.");
  }
  return metadata;
}

function readUint16LE(view: DataView, offset: number) {
  return view.getUint16(offset, true);
}

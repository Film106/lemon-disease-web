import { writeFileSync, mkdirSync } from 'fs';
import { deflateSync } from 'zlib';

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function writeUInt32BE(buf, value, offset) {
  buf[offset] = (value >>> 24) & 0xFF;
  buf[offset + 1] = (value >>> 16) & 0xFF;
  buf[offset + 2] = (value >>> 8) & 0xFF;
  buf[offset + 3] = value & 0xFF;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  writeUInt32BE(lenBuf, data.length, 0);
  const crcData = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.alloc(4);
  writeUInt32BE(crcBuf, crc32(crcData), 0);
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
}

function createPNG(size, r, g, b) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  writeUInt32BE(ihdrData, size, 0);
  writeUInt32BE(ihdrData, size, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type: RGB
  ihdrData[10] = 0; // compression method
  ihdrData[11] = 0; // filter method
  ihdrData[12] = 0; // interlace method

  // Raw image data: filter byte (0) + RGB pixels per row
  const rowSize = size * 3;
  const rawData = Buffer.alloc(size * (rowSize + 1));
  for (let y = 0; y < size; y++) {
    rawData[y * (rowSize + 1)] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const offset = y * (rowSize + 1) + 1 + x * 3;
      rawData[offset] = r;
      rawData[offset + 1] = g;
      rawData[offset + 2] = b;
    }
  }

  const compressed = deflateSync(rawData, { level: 6 });

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdrData),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Ensure public directory exists
try { mkdirSync('public', { recursive: true }); } catch (_) {}

// #2D5A27 = rgb(45, 90, 39)
writeFileSync('public/icon-192.png', createPNG(192, 45, 90, 39));
writeFileSync('public/icon-512.png', createPNG(512, 45, 90, 39));

console.log('Icons generated: public/icon-192.png and public/icon-512.png');

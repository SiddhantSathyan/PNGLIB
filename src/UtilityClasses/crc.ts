const crc32Table = new Array(256);

// Pre-generate crc32 polynomial table
for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
        if (crc & 1) {
            crc = (crc >>> 1) ^ 0xEDB88320;
        } else {
            crc >>>= 1;
        }
    }
    crc32Table[i] = crc;
}

export function crc32(data: Buffer): Buffer {
    let crc = -1; // Begin with all bits set (0xffffffff)
    for (let i = 0; i < data.length; i++) {
        crc = (crc >>> 8) ^ crc32Table[(crc ^ data[i]) & 0xFF];
    }
    crc ^= -1; // Finalize by inverting all bits

    // Return as a Buffer
    return Buffer.from([crc >>> 24, crc >>> 16, crc >>> 8, crc]);
}
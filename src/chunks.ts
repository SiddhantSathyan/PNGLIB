import { ColorDepthType } from "./UtilityClasses/constants";
import { crc32 } from "./UtilityClasses/crc";
import zlib from 'zlib';


export class PNGChunk {
    constructor(private type: string | Uint8Array, private data: Buffer) {}

    writeStream(stream: { write: (arg0: Buffer) => void; }) {
        const Buffertype = Buffer.from(this.type);
        let chunk = Buffer.concat([Buffer.alloc(4), Buffertype, this.data, crc32(Buffer.concat([Buffertype, this.data]))]);
        chunk.writeUInt32BE(this.data.length, 0);
        stream.write(chunk);
    }
    getBufferRepresentation() {
        const chunkBuffer =Buffer.concat([Buffer.alloc(4), Buffer.from(this.type), this.data, crc32(Buffer.concat([Buffer.from(this.type), this.data]))]);
        chunkBuffer.writeUInt32BE(this.data.length, 0);
        return chunkBuffer;
    }
}

/**
 * PNG Image Type Definer
 */
class IHDR extends PNGChunk {
    constructor(width: number, height: number, bitDepth: number= 8, colorType: number=2) {
        let data = Buffer.alloc(13);
        data.writeUInt32BE(width, 0);
        data.writeUInt32BE(height, 4);
        data[8] = bitDepth; // bit depth
        data[9] = colorType; // color type
        super('IHDR', data);
    }
}

class IDAT extends PNGChunk {
    constructor(width: number, height: number, bytesPerSample= 1|2|3|4, options: Buffer | Buffer[] | ((x: number, y: number) => [number, number, number, number])) {
        let data: Buffer;
        if (options instanceof Buffer) {
            // 1D Buffer
            let row = Buffer.alloc(width * bytesPerSample + 1);
            row.fill(options, 1);
            data = zlib.deflateSync(Buffer.concat(Array(height).fill(row)));
        } else if (options instanceof Array) {
            // 2D Buffer
            let rows = options.map(row => Buffer.concat([Buffer.alloc(1), row]));
            data = zlib.deflateSync(Buffer.concat(rows));
        } else {
            // Generator function
            let rows = Array(height).fill(0).map((_, y) => {
                return Buffer.concat([Buffer.alloc(1), ...Array(width).fill(0).map((_, x) => {
                    let [r, g, b, a] = options(x, y);
                    return Buffer.from([r, g, b, a]);
                })]);
            });
            data = zlib.deflateSync(Buffer.concat(rows));
        }
        super('IDAT', data);
    }
}

class IEND extends PNGChunk {
    constructor() {
        super('IEND', Buffer.from([]));
    }
}

export class PNG {
    private chunks: PNGChunk[];
    private static SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    constructor() {
        this.chunks = [];
    }

    makeImage(width: number, height: number, imageType: ColorDepthType, image: Buffer | Buffer[]) {
        this.chunks.push(new IHDR(width, height, imageType.depth, imageType.colorType));
        this.chunks.push(new IDAT(width, height, imageType.bytesPerSample, image));
        this.chunks.push(new IEND());
    }

    getBufferRepresentation() {
        return Buffer.concat([PNG.SIGNATURE, ...this.chunks.map(chunk => chunk.getBufferRepresentation())]);
    }
}
import { crc32 } from "./UtilityClasses/crc";
import zlib from 'zlib';

export abstract class Chunk {
    protected type: string | Uint8Array;
    protected data: Buffer;

    constructor(type: string | Uint8Array, data: Buffer) {
        this.type = type;
        this.data = data;
    }

    getChunkBufferRepresentation() {
        const chunkBuffer = Buffer.concat([Buffer.alloc(4), Buffer.from(this.type), this.data, crc32(Buffer.concat([Buffer.from(this.type), this.data]))]);
        chunkBuffer.writeUInt32BE(this.data.length, 0);
        return chunkBuffer;
    }
}

export class WritableChunk extends Chunk {
    writeStream(stream: { write: (arg0: Buffer) => void; }) {
        const Buffertype = Buffer.from(this.type);
        let chunk = Buffer.concat([Buffer.alloc(4), Buffertype, this.data, crc32(Buffer.concat([Buffertype, this.data]))]);
        chunk.writeUInt32BE(this.data.length, 0);
        stream.write(chunk);
    }
}

export class IHDR extends WritableChunk {
    constructor(width: number, height: number, bitDepth: number= 8, colorType: number=2) {
        let data = Buffer.alloc(13);
        data.writeUInt32BE(width, 0);
        data.writeUInt32BE(height, 4);
        data[8] = bitDepth; // bit depth
        data[9] = colorType; // color type
        super('IHDR', data);
    }

}

export class IDAT extends WritableChunk {
    constructor(width: number, height: number, bytesPerSample= 1|2|3|4, options: Buffer | Buffer[] | ((x: number, y: number) => [number, number, number, number])) {
        let data: Buffer;
        if (options instanceof Buffer) {
            // 1D Buffer
            let row = Buffer.alloc(width * bytesPerSample + 1);
            row.fill(options, 1);
            data = zlib.deflateSync(Buffer.concat(Array(height).fill(row)));
        } else if (options instanceof Array) {
            console.log("recieved 2D array")
            // 2D Buffer
            // We need to repeat the buffer across the image, let's exetend or truncate the buffer to match the width
            let rows = options.map(row => {
                if (row.length < width * bytesPerSample) {
                    let newRow = Buffer.alloc(width * bytesPerSample + 1);
                    newRow.fill(row, 1);
                    return newRow;
                } else {
                    // need to add the first byte as the filter type
                    const data = Buffer.alloc(width * bytesPerSample + 1);
                    data.fill(row.subarray(0), 1);
                    return data;
                }
            });
            //If we don't have enough rows, we need to add more rows, let's repeat the sequence of rows
            if(rows.length < height) {
                rows = Array(height).fill(rows).flat();
            }
            data = zlib.deflateSync(Buffer.concat(rows));
        } else {
            data = Buffer.alloc(0);
        }
        super('IDAT', data);
    }
}

export class IEND extends WritableChunk {
    constructor() {
        super('IEND', Buffer.from([]));
    }
}

export class ChunkFactory {
    static createIHDR(width: number, height: number, bitDepth: number= 8, colorType: number=2) {
        return new IHDR(width, height, bitDepth, colorType);
    }

    static createIDAT(width: number, height: number, bytesPerSample= 1|2|3|4, options: Buffer | Buffer[] | ((x: number, y: number) => [number, number, number, number])) {
        return new IDAT(width, height, bytesPerSample, options);
    }

    static createIEND() {
        return new IEND();
    }
}
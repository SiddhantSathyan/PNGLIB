import { crc32 } from "../../UtilityClasses/crc";
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
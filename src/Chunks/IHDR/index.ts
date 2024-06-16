import { WritableChunk } from "../Chunk";

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
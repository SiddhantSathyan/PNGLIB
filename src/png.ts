import { ChunkFactory } from "./Chunks.factory";
import { Chunk } from "./Chunks/Chunk";
import { IDAT } from "./Chunks/IDAT";
import { IHDR } from "./Chunks/IHDR";
import { ColorDepthType } from "./UtilityClasses/constants";

export interface ImageRecord{ 
    width: number;
    height: number;
    imageType: ColorDepthType;
    image: Buffer | Buffer[];
}

export class PNG {
    private chunks: Chunk[];
    private static SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    constructor() {
        this.chunks = [];
    }

    makeImage(width: number, height: number, imageType: ColorDepthType, image: Buffer | Buffer[]) {
        this.chunks.push(ChunkFactory.createIHDR(width, height, imageType.depth, imageType.colorType));
        this.chunks.push(ChunkFactory.createIDAT(width, height, imageType.bytesPerSample, image));
        this.chunks.push(ChunkFactory.createIEND());
    }

    getBufferRepresentation() {
        return Buffer.concat([PNG.SIGNATURE, ...this.chunks.map(chunk => chunk.getChunkBufferRepresentation())]);
    }
}
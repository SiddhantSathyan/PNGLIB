import { IEND } from "./Chunks/IEND";
import { IDAT } from "./Chunks/IDAT";
import { IHDR } from "./Chunks/IHDR";

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
import { WritableChunk } from "../Chunk";

export class IEND extends WritableChunk {
    constructor() {
        super('IEND', Buffer.from([]));
    }
}
import { WritableChunk } from "../Chunk";
import zlib from 'zlib';

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
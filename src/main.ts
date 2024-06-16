import fs from 'fs';
import { PNG } from './png';

const png = new PNG();
const pngArray = new PNG();

// make an array of buffers that represents a checkerboard Black and white pattern
const data = [
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255]),
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255]),
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255]),
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255]),
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255]),
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255]).reverse(),
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255]).reverse(),
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255]).reverse(),
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255]).reverse(),
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255,255, 255, 255]).reverse(),
]

function makeRandomBufferArray(width: number, height: number) {
    return Array(height).fill(0).map(_ => Buffer.from(Array(width * 3).fill(0).map(_ => Math.floor(Math.random() * 256))));
}

png.makeImage(40, 40, { depth: 8, colorType: 2, bytesPerSample: 3 },Buffer.from([0xFF, 0x00, 0x00]));
pngArray.makeImage(40, 40, { depth: 8, colorType: 2, bytesPerSample: 3 }, data);

fs.writeFileSync('test.png', png.getBufferRepresentation());
fs.writeFileSync('test2.png', pngArray.getBufferRepresentation());
import fs from 'fs';
import { PNG } from './png';

const png = new PNG();

// make an array of buffers that represents a checkerboard Black and white pattern
const data = [
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255,255, 255, 255,255, 255, 255]),
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255,255, 255, 255,255, 255, 255]),
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255,255, 255, 255,255, 255, 255]),
    Buffer.from([255, 255, 255,255, 255, 255,255, 255, 255, 0, 0, 0,0, 0, 0,0, 0, 0,]),
    Buffer.from([255, 255, 255,255, 255, 255,255, 255, 255, 0, 0, 0,0, 0, 0,0, 0, 0,]),
    Buffer.from([255, 255, 255,255, 255, 255,255, 255, 255, 0, 0, 0,0, 0, 0,0, 0, 0,]),
]





png.makeImage(30, 30, { depth: 8, colorType: 2, bytesPerSample: 3 }, data);

fs.writeFileSync('test.png', png.getBufferRepresentation());
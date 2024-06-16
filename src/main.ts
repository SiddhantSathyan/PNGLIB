import fs from 'fs';
import { PNG } from './chunks';

const png = new PNG();
png.makeImage(100, 100, { depth: 8, colorType: 2, bytesPerSample: 3 }, Buffer.alloc(100 * 100 * 3).fill(Buffer.from([0,255,0])));
fs.writeFileSync('test.png', png.getBufferRepresentation());

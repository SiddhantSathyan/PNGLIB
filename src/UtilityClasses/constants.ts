/**
 * Given that PNGs can only have cetain color depths, this is a list of all the possible color depths
 */
const GreyscaleDepth = [8, 16];
const TruecolorDepth = [8, 16];
const IndexedColorDepth = [8];
const GreyscaleAlphaDepth = [8, 16];
const TruecolorAlphaDepth = [8, 16];

export enum ColorType {
    Greyscale = 0,
    Truecolor = 2,
    IndexedColor = 3,
    GreyscaleAlpha = 4,
    TruecolorAlpha = 6
}

export const ValidColorTypeDepth = {
    [ColorType.Greyscale]: GreyscaleDepth,
    [ColorType.Truecolor]: TruecolorDepth,
    [ColorType.IndexedColor]: IndexedColorDepth,
    [ColorType.GreyscaleAlpha]: GreyscaleAlphaDepth,
    [ColorType.TruecolorAlpha]: TruecolorAlphaDepth
}

/**
 * Create a type that validates the color depth based on the color type
 */
export type ColorDepthType = 
    { colorType: ColorType.Greyscale, depth: 8|16, bytesPerSample:1 } |
    { colorType: ColorType.Truecolor, depth: 8|16, bytesPerSample:3 } |
    // { colorType: ColorType.IndexedColor, depth: 1|2|4|8 } |
    { colorType: ColorType.GreyscaleAlpha, depth:  8|16, bytesPerSample:2 } |
    { colorType: ColorType.TruecolorAlpha, depth:  8|16,bytesPerSample:4 };
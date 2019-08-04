function getCHRBytes(pixels) {
    // Takes array representing the pixels in a single 8x8 sprite.
    // Ouputs array representing the bytes of the image in NES CHR
    // format. Each element of the array is a number representing
    // one byte.
    //
    // Explanation of CHR format in words:
    //
    // A given 8x8 pixel sprite takes up 16 bytes.
    //
    // Each row of 8 pixels occupies two of those bytes.  The two
    // bytes for a row are offset by 8 bytes. So the first row
    // takes byte 0 and byte 8, and row 2 takes byte 1 and byte 9,
    // and the last row in the sprite takes up byte 7 and byte 15.
    //
    // Within a row, the color of each individual pixel is
    // described by one bit from the first byte and one bit from
    // the second (offset-by-8-bytes) byte. So, the first pixel is
    // described by the combination of bit 0 of byte 0 and bit 0 of
    // byte 8. The second pixel is described by bit 1 of byte 0 and
    // bit 1 of byte 8, and so on. Then the same for the next row,
    // but it's byte 1 and byte 9, and the last row is byte 7 and
    // byte 15.
    //
    // Once we fill up 16 bytes this way, we have a full sprite.
    // The next sprite occupies the next 16 bytes and so on.
    //
    // Because we only have 2 bits of data for each pixel, each
    // pixel in a sprite can only be one of 4 different colors.
    // Which colors a given bit-pattern represents is determined by
    // separate palette information.
    //
    //
    // TODO: special class to deal with CHR data might be useful

    const result = Array(16).fill(0);
    for (let i = 0; i < 64; i++) {
        // Proceed through the pixels and depending on the color
        // set the appropriate bits in our array.
        const color = pixels[i];
        const row = Math.floor(i / 8);
        const column = 7 - i % 8;

        if (color === 1 || color === 3) {
            result[row] += 2 ** column;
        }
        if (color === 2 || color === 3) {
            result[row + 8] += 2 ** column;
        }
    }

    return result;
}


// NES Palette.
// Per: http://www.thealmightyguru.com/Games/Hacking/Wiki/index.php/NES_Palette

const hexColors =
["#7C7C7C", "#0000FC", "#0000BC", "#4428BC", "#940084", "#A80020", "#A81000",
"#881400", "#503000", "#007800", "#006800", "#005800", "#004058", "#000000",
"#000000", "#000000", "#BCBCBC", "#0078F8", "#0058F8", "#6844FC", "#D800CC",
"#E40058", "#F83800", "#E45C10", "#AC7C00", "#00B800", "#00A800", "#00A844",
"#008888", "#000000", "#000000", "#000000", "#F8F8F8", "#3CBCFC", "#6888FC",
"#9878F8", "#F878F8", "#F85898", "#F87858", "#FCA044", "#F8B800", "#B8F818",
"#58D854", "#58F898", "#00E8D8", "#787878", "#000000", "#000000", "#FCFCFC",
"#A4E4FC", "#B8B8F8", "#D8B8F8", "#F8B8F8", "#F8A4C0", "#F0D0B0", "#FCE0A8",
"#F8D878", "#D8F878", "#B8F8B8", "#B8F8D8", "#00FCFC", "#F8D8F8", "#000000",
"#000000",];


export default {
    getCHRBytes,
    hexColors,
};

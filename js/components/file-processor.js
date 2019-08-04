export default {
    data: function() {
        return {
            chrSize: 0,
            chrStart: 0,
            filename: '',
            isInes: false,
        };
    },
    methods: {
        processSprite: function(data) {
            // Take raw data for a single sprite in CHR format, represented
            // as an array of integers 0-255, each of which corresponds to
            // one byte of the raw data.  Output series of integers 0-3,
            // each representing the color of a given pixel. (As selected
            // from palette of 4 colors).
            const result = [];
            for (let row = 0; row < 8; row++) {
                for (let col = 7; col >= 0; col--) {
                    const bit1 = 1 & (data[row] >>> col);
                    const bit2 = 1 & (data[row + 8] >>> col);
                    result.push(bit1 + bit2 * 2);
                }
            }
            return result;
        },
        handleFile: function(file) {
            const reader = new FileReader();
            reader.onload = loadEvent => this.parseArrayBuffer(loadEvent.target.result);
            reader.readAsArrayBuffer(file);
        },
        parseArrayBuffer(buffer) {
            // check if we're dealing with ines file
            const header = new Uint8Array(buffer.slice(0, 16));
            const magic = [0x4e, 0x45, 0x53, 0x1a];  // Ascii NES + 1a
            this.isInes = magic.every((b, i) => b === header[i]);

            if (this.isInes) {
                const trainerPresent = (header[6] & 4) / 4;
                const prgSize = 16384 * header[4];
                this.chrSize = header[5];
                if (this.chrSize > 0) {
                    this.chrStart = 16 + prgSize + trainerPresent * 512;
                    this.chrFound(this.chrStart, this.chrSize);
                }
            }

            // Take array buffer and output array of sprites.
            const numSprites = buffer.byteLength / 16;
            const sprites = [];
            for (let sprite = 0; sprite < numSprites; sprite++) {
                const pixels = [];
                const spriteData = new Uint8Array(
                    buffer.slice(16 * sprite, 16 * (sprite + 1)));
                sprites.push(this.processSprite(spriteData));
            }
            this.onParse(sprites);
        }
    },
    props: {
        chrFound: {
            default: () => {},
            type: Function,
        },
        download: {
            type: Function,
        },
        onParse: {
            // When we've parsed a file, this prop is called with the
            // resulting array of sprites.
            default: () => {},
            type: Function,
        },
    },
    template: `
        <div id="fileProcessor">
            <button @click="download(filename)" id="downloadButton">Save...</button>
            <label>Filename:<input v-model="filename" placeholder="img.chr"></label>
            <hr>
            <label id="open">Open...
                <input
                    type="file"
                    id="chrUpload"
                    @change= "e => handleFile(e.target.files[0])">
            </label>
            <span v-if="isInes">
                Opened an iNES file.
            </span>
        </div>
    `,
};

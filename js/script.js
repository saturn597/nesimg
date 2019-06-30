window.addEventListener('load', () => {
    Vue.component('drawing-area', {
        data: function() {
            return { erase: false };
        },
        methods: {
            mousedown: function(id) {
                // Uncomment below line to allow "erasing", which creates blank
                // pixels. Blank pixels aren't really an intrinsic part of the
                // NES binary image format, so disallowing for now.
                //
                // this.erase = this.drawing[id] === this.currentIndex;


                this.update(id);
            },
            update: function(id) {
                this.drawingUpdated(id, this.erase ? null : this.currentIndex);
            },
        },
        props: {
            currentIndex: Number,
            drawing: Array,
            drawingUpdated: {
                default: () => {},
                type: Function,
            },
            isDrawing: {
                default: false,
                type: Boolean,
            },
            palette: {
                type: Array,
            },
        },
        template: `
            <pixel-matrix
                v-bind:rows="8"
                v-bind:columns="8"
                v-bind:palette="palette"
                v-bind:pixelMouseDown="mousedown"
                v-bind:pixelMouseOver="isDrawing ? update : () => {}"
                v-bind:pixels="drawing"
                v-on="$listeners">
            </pixel-matrix>
        `,
    });

    Vue.component('file-processor', {
        data: function() {
            return {
                chrStart: 0,
                isInes: false,
            };
        },
        methods: {
            processSprite(data) {
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

                const trainerPresent = (header[6] & 4) / 4;
                const prgSize = 16384 * header[4];
                this.chrStart = 16 + prgSize + trainerPresent * 512;

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
            maxSprites: {
                default: 2,
                type: Number,
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
                <input type="file" id="chrUpload" v-on:change= "e => handleFile(e.target.files[0])">
                {{ isInes }}
                {{ chrStart }}
            </div>
        `,
    });

    Vue.component('overview', {
        created: function() {
            this.updateSprites = [];
            for (let i = 0; i < Math.floor(this.pixels.length); i++) {
                this.updateSprites.push(this.updateSprite.bind(this, i));
            }

            // Try to make the overview a square-ish grid
            const n = Math.ceil(Math.sqrt(this.pixels.length));
            this.style = {
                display: 'grid',
                gridTemplateRows: `repeat(${n}, ${ 1 / n }fr)`,
                gridTemplateColumns: `repeat(${n}, ${ 1 / n }fr)`,
            };
        },
        props: {
            currentSprite: Number,
            palette: Array,
            pixels: {
                default: [],
                type: Array,
            },
            updateSprite: Function,
        },
        template: `
            <div id="overview" v-bind:style="style">
                <pixel-matrix
                    v-for="n in pixels.length"
                    v-bind:class="{ active: n - 1 === currentSprite }"
                    v-bind:columns="8"
                    v-bind:rows="8"
                    v-bind:key="n"
                    v-bind:palette="palette"
                    v-bind:pixels="pixels[n - 1]"
                    v-bind:onClick="updateSprites[n - 1]">
                </pixel-matrix>
            </div>
        `,
    });

    Vue.component('pixel-matrix', {
        data: function() {
            const r = "repeat(" + this.rows + ", " + 1/this.rows + "fr)";
            const c = "repeat(" + this.columns + ", " + 1/this.columns + "fr)";

            const style = {
                display: "inline-grid",
                gridTemplateRows: r,
                gridTemplateColumns: c,
            };

            return { style };
        },
        props: {
            active: {
                default: () => [],
                type: Array,
            },
            columns: {
                default: 1,
                type: Number,
            },
            rows: {

                default: 1,
                type: Number,
            },
            onClick: {
                default: () => {},
                type: Function,
            },
            palette: {
                default: null,
                type: Array,
            },
            pixelMouseDown: {
                default: () => {},
                type: Function,
            },
            pixelMouseOver: {
                default: () => {},
                type: Function,
            },
            pixels: Array,
        },
        template: `
            <div class="pixelMatrix" v-bind:style="style" v-on:click="onClick">
                <div class="pixel"
                    v-for="(color, index) in pixels"
                    v-bind:class="{ active: active.includes(color) }"
                    v-bind:style="{ backgroundColor: palette[color] }"
                    v-bind:key="index"
                    v-on:mousedown.prevent="pixelMouseDown(index)"
                    v-on:mouseover.prevent="pixelMouseOver(index)">
                </div>
            </div>
        `,
    });

    const app = new Vue({
        computed: {
            currentPalette: function() {
                return this.selectedColors.map(c => this.allColors[c]);
            },
        },
        data: () => {
            const numSprites = 64;
            const digits = [];
            for (let i = 0; i < 64; i++) {
                digits.push(i);
            }

            const allColors = hexColors;
            const currentIndex = 0;
            const selectedColors = digits.slice(0, 4);
            const pixels = Array(numSprites).fill(Array(64).fill(
                selectedColors[currentIndex]));

            return {
                allColors,
                currentIndex,
                currentPage: 0,
                currentSprite: 0,
                digits,
                pageSize: 64,
                pixels,
                mousebuttons: false,
                numSprites,
                selectedColors,
            };
        },
        el: "#app",
        methods: {
            downloadChr: function() {
                // Generate a base64 data URL representing the bytes of the CHR
                // data the user is editing. Set it as the href of a link and
                // then save the link locally.
                const dl = document.createElement('a');
                const bytes = [].concat(...this.pixels.map(this.getBytes));
                const base64 = window.btoa(String.fromCharCode(...bytes));
                dl.href = "data:;base64," + base64;
                dl.download = "img.chr";
                document.body.append(dl);
                dl.click();
            },
            getBytes: function(pixels) {
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
            },
            updateAllSprites: function(spriteArray) {
                this.pixels = spriteArray.slice();
            },
            updateSprite: function(n) {
                this.currentSprite = n + this.currentPage * this.pageSize;
            },
            updatePalette: function(index) {
                if (!this.selectedColors.includes(index)) {
                    Vue.set(this.selectedColors, this.currentIndex, index);
                }
            },
            updatePixel: function(id, newColor) {
                const newSprite = this.pixels[this.currentSprite].slice();
                newSprite[id] = newColor;
                Vue.set(this.pixels, this.currentSprite, newSprite);
            },
            updateSelection: function(index) {
                this.currentIndex = index;
            },
        },
        template: `
            <div id='app'>
                <div id="colorIndicator"
                    v-bind:style="{ backgroundColor: currentPalette[currentIndex] }">
                </div>
                <pixel-matrix class="allColors"
                    v-bind:active="selectedColors"
                    v-bind:columns="4"
                    v-bind:rows="16"
                    v-bind:palette="allColors"
                    v-bind:pixelMouseDown="updatePalette"
                    v-bind:pixels="digits">
                </pixel-matrix>
                <drawing-area class="drawing"
                    v-bind:currentIndex="currentIndex"
                    v-bind:drawing="this.pixels[this.currentSprite]"
                    v-bind:isDrawing="mousebuttons"
                    v-bind:drawingUpdated="updatePixel"
                    v-bind:palette="currentPalette">
                </drawing-area>
                <pixel-matrix class="paletteDisplay"
                    v-bind:active="[currentIndex]"
                    v-bind:columns="1"
                    v-bind:rows="currentPalette.length"
                    v-bind:palette="currentPalette"
                    v-bind:pixelMouseDown="updateSelection"
                    v-bind:pixels="digits.slice(0, currentPalette.length)">
                </pixel-matrix>
                <overview
                    v-bind:currentSprite="currentSprite"
                    v-bind:pixels="pixels.slice(currentPage * pageSize, (currentPage + 1) * pageSize)"
                    v-bind:palette="currentPalette"
                    v-bind:updateSprite="updateSprite">
                </overview>
                <div id="dataOutput">
                    <button v-on:click="downloadChr">Download</button>
                </div>
                <file-processor
                    v-bind:maxSprites="numSprites"
                    v-bind:onParse="updateAllSprites">
                </file-processor>
            </div>
        `,
    });

    document.body.onmousedown = function(e) {
        app.mousebuttons = true;
    };
    document.body.onmouseup = function(e) {
        app.mousebuttons = false;
    };
});


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

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

    Vue.component('data-output', {
        computed: {
            raw: function() {
                // Output an array representing the bytes of the image, in NES CHR format.
                // Each element of the array is a Number representing one byte.

                // Explanation of CHR format in words:
                //
                // A given 8x8 pixel sprite takes up 16 bytes.
                //
                // Each row of 8 pixels occupies two of those bytes. Weirdly,
                // the two bytes for a row aren't consecutive but are offset by
                // 8 bytes. So the first row takes byte 0 and byte 8, and row 2
                // takes byte 1 and byte 9, and the last row in the sprite
                // takes up byte 7 and byte 15.
                //
                // Within a row, the color of each individual pixel is
                // described by one bit from the first byte and one bit from
                // the second byte. So, the first pixel is described by the
                // combination of bit 0 of byte 0 and bit 0 of byte 8. The
                // second pixel is described by bit 1 of byte 0 and bit 1 of
                // byte 8, and so on.  Then the next row of pixels down is
                // described by byte 1 and byte 9 in an analogous fashion. And
                // the final row is described by bits 0-7 of byte 7 and byte
                // 15.
                //
                // Once we fill up 16 bytes this way, we have a full sprite.
                // The next sprite occupies the next 16 bytes and so on.
                //
                // Because we only have 2 bits of data for each pixel, each
                // pixel in a sprite can only be one of 4 different colors.
                // Which colors those are is determined by separate palette
                // information.

                // Since each pixel takes up 2 bits, our output will be one
                // byte for every 4 pixels, so our array needs to have the
                // length below. Initialize with all zeroes.
                const result = Array(this.pixels.length / 4).fill(0);

                for (let pixel = 0; pixel < this.pixels.length; pixel++) {
                    // Proceed through the pixels and depending on the color
                    // set the appropriate bits in our array.
                    const sprite = Math.floor(pixel / 64);  // 64 pix=1 sprite
                    const row = Math.floor((pixel % 64) / 8);  // row of sprite
                    const column = 7 - pixel % 8;
                    const color = this.pixels[pixel];

                    if (color === 1 || color === 3) {
                        result[row + 16 * sprite] += 2 ** column;
                    }
                    if (color === 2 || color === 3) {
                        result[row + 16 * sprite + 8] += 2 ** column;
                    }

                }
                return result;
            },
            base64: function() {
                return window.btoa(String.fromCharCode(...this.raw));
            },
        },
        props: {
            pixels: {
                default: [],
                type: Array,
            },
        },
        template: `
            <div id="dataOutput">
                <a v-bind:href="'data:;base64,'+this.base64" download="img.chr">Download</a>
                {{ this.raw.map(b => b.toString(16)) }}
            </div>

        `,
    });

    Vue.component('overview-display', {
        computed: {
            numSprites: function() {
                return Math.floor(this.pixels.length / 64);
            },
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
            <div id="overview">
                <drawing-area
                    v-for="n in numSprites"
                    v-bind:class="{ active: n - 1 === currentSprite }"
                    v-bind:drawing="pixels.slice((n-1) * 64, n * 64)"
                    v-bind:key="n"
                    v-bind:palette="palette"
                    v-on:click="updateSprite(n-1)">
                </drawing-area>
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
            <div class="pixelMatrix" v-bind:style="style" v-on="$listeners">
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
            currentSpriteData: function() {
                const start = this.currentSprite * 64;
                return this.pixels.slice(start, start+64);
            },
        },
        data: () => {
            const numSprites = 5;
            const digits = [];
            for (let i = 0; i < 64; i++) {
                digits.push(i);
            }

            const allColors = hexColors;
            const currentIndex = 0;
            const selectedColors = digits.slice(0, 4);
            const pixels = Array(64 * numSprites).fill(
                selectedColors[currentIndex]);

            return {
                allColors,
                currentIndex,
                currentSprite: 0,
                digits,
                pixels,
                mousebuttons: false,
                numSprites,
                selectedColors,
            };
        },
        el: "#app",
        methods: {
            updateSprite: function(n) {
                this.currentSprite = n;
            },
            updatePalette: function(index) {
                if (!this.selectedColors.includes(index)) {
                    Vue.set(this.selectedColors, this.currentIndex, index);
                }
            },
            updatePixel: function(id, newColor) {
                Vue.set(this.pixels, id + 64 * this.currentSprite, newColor);
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
                    v-bind:drawing="currentSpriteData"
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
                <overview-display
                    v-bind:currentSprite="currentSprite"
                    v-bind:pixels="pixels"
                    v-bind:palette="currentPalette"
                    v-bind:updateSprite="updateSprite">
                </overview-display>
                <data-output v-bind:pixels="pixels">
                </data-output>
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

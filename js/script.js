window.addEventListener('load', () => {
    Vue.component('drawing-area', {
        computed: {
            pixels: function() {
                return this.drawing.map(pixel => {
                    let string;
                    if (pixel === null) {
                        string = 'rgba(0,0,0,0)';
                    } else {
                        string = this.palette[pixel].string;
                    }
                    return { string };
                });
            },
        },
        data: function() {
            return { erase: false };
        },
        methods: {
            mousedown: function(id) {
                this.erase = this.drawing[id] === this.currentIndex;
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
            <pixel-matrix class="drawing"
                v-bind:rows="8"
                v-bind:columns="8"
                v-bind:pixelMouseDown="mousedown"
                v-bind:pixelMouseOver="isDrawing ? update : () => {}"
                v-bind:pixels="pixels">
            </pixel-matrix>
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
            <div class="pixelMatrix" v-bind:style="style">
                <div class="pixel"
                    v-for="(pixel, index) in pixels"
                    v-bind:class="{ active: active.includes(pixel) }"
                    v-bind:style="{ backgroundColor: pixel.string }"
                    v-bind:key="index"
                    v-on:mousedown.prevent="pixelMouseDown(index)"
                    v-on:mouseover.prevent="pixelMouseOver(index)">
                </div>
            </div>
        `,
    });

    const app = new Vue({
        data: () => {
            const pixels = [];
            for (let i = 0; i < 64; i++) {
                pixels.push({color: 'rgba(0,0,0,0)', id: i});
            }

            const allColors = hexColors.map((hex, id) => {
                return { string: hex, id };
            });

            const currentIndex = 0;
            const currentPalette = allColors.slice(0, 16);

            const drawing = Array(64).fill(null);

            return {
                allColors,
                currentColor: currentPalette[0],
                drawing,
                mousebuttons: false,
                currentIndex,
                currentPalette,
                pixels
            };
        },
        el: "#app",
        methods: {
            updatePalette: function(index) {
                const newColor = this.allColors[index];
                if (!this.currentPalette.includes(newColor)) {
                    Vue.set(this.currentPalette, this.currentIndex, newColor);
                }
            },
            updatePixel: function(id, newColor) {
                Vue.set(this.drawing, id, newColor);
            },
            updateSelection: function(index) {
                this.currentIndex = index;
            },
        },
        template: `
            <div id='app'>
                <div id="colorIndicator" v-bind:style="{ backgroundColor: currentColor.string}"></div>
                <pixel-matrix class="allColors"
                    v-bind:active="currentPalette"
                    v-bind:columns="4"
                    v-bind:rows="16"
                    v-bind:pixelMouseDown="updatePalette"
                    v-bind:pixels="allColors">
                </pixel-matrix>
                <drawing-area
                    v-bind:currentIndex="currentIndex"
                    v-bind:drawing="drawing"
                    v-bind:isDrawing="mousebuttons"
                    v-bind:drawingUpdated="updatePixel"
                    v-bind:palette="currentPalette">
                </drawing-area>
                <drawing-area class="preview"
                    v-bind:drawing="drawing"
                    v-bind:palette="currentPalette">
                </drawing-area>
                <pixel-matrix class="paletteDisplay"
                    v-bind:active="[currentPalette[currentIndex]]"
                    v-bind:columns="16"
                    v-bind:rows="1"
                    v-bind:pixels="currentPalette"
                    v-bind:pixelMouseDown="updateSelection">
                </pixel-matrix>
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

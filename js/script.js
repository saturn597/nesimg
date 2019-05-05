window.addEventListener('load', () => {
    Vue.component('color-palette', {
        props: {
            updateColor: Function,
        },
        template: `
            <div class="palette">
                <div class="colorOption"
                    v-for="color in this.$options.palette"
                    v-bind:style="{ backgroundColor: color.hex }"
                    v-bind:key="color.id"
                    v-bind:title="color.hex"
                    v-on:click="updateColor(color.hex)">
                </div>
            </div>
        `,

        palette: hexColors.map((hex, id) => {
            return { hex, id };
        }),
    });

    Vue.component('drawing-area', {
        data: () => {
            const pixels = [];
            for (let i = 0; i < 64; i++) {
                pixels.push({color: 'rgba(0,0,0,0)', id: i});
            }
            return { erase: false, pixels };
        },
        methods: {
            mousedown: function(id) {
                this.erase = this.pixels[id].color === this.currentColor;
                this.update(id);
            },
            update: function(id) {
                const newColor = this.erase ?
                    'rgba(0,0,0,0)' :
                    this.currentColor;
                this.pixels[id].color = newColor;
            },
        },
        props: {
            currentColor: String,
            isDrawing: Boolean,
        },
        template: `
            <div id="drawing">
                <div class="pixel"
                    v-for="pixel in pixels"
                    v-bind:style="{ backgroundColor: pixel.color }"
                    v-bind:key="pixel.id"
                    v-on:mousedown.prevent="mousedown(pixel.id)"
                    v-on:mouseover="isDrawing ? update(pixel.id) : false">
                </div>
            </div>
        `,
    });

    const app = new Vue({
        data: {
            currentColor: "#58F898",
            mousebuttons: false,
        },
        el: "#app",
        methods: {
            updateColor: function(color) {
                this.currentColor = color;
            }
        },
        template: `
            <div id='app'>
                <div id="colorIndicator" v-bind:style="{ backgroundColor: currentColor }"></div>
                <color-palette v-bind:updateColor="updateColor"></color-palette>
                <drawing-area
                    v-bind:currentColor="currentColor"
                    v-bind:isDrawing="mousebuttons"></drawing-area>
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

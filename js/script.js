window.addEventListener('load', () => {
    Vue.component('color-palette', {
        template: `
            <div class="palette">
                <div class="colorOption"
                    v-for="color in this.$options.palette"
                    v-bind:style="{ backgroundColor: color.hex }"
                    v-bind:key="color.id"
                    v-bind:title="color.hex">
                </div>
            </div>
        `,

        palette,
    });

    Vue.component('drawing-area', {
        data: () => {
            const pixels = [];
            for (let i = 0; i < 64; i++) {
                pixels.push({color: '#000000', id: i});
            }
            return { pixels };
        },
        methods: {
            update: function(id) {
                this.pixels[id].color = "#ffff00";
            },
        },
        template: `
            <div id="drawing">
                <div class="pixel"
                    v-for="pixel in pixels"
                    v-bind:style="{ backgroundColor: pixel.color }"
                    v-bind:key="pixel.id"
                    v-on:click="update(pixel.id)">
                </div>
            </div>
        `,
    });

    const app = new Vue({
        el: "#app",
        template: `
            <div>
                <color-palette></color-palette>
                <drawing-area></drawing-area>
            </div>
        `,
    });
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

const palette = hexColors.map((hex, id) => {
    return { hex, id };
});

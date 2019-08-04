export default {
    computed: {
        finalPixels: function() {
            return this.pixels || this.palette.map((p, i) => i);
        },
    },
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
        <div class="pixelMatrix" :style="style" @click="onClick">
            <div class="pixel"
                v-for="(color, index) in finalPixels"
                :class="{ active: active.includes(color) }"
                :style="{ backgroundColor: palette[color] }"
                :key="index"
                @mousedown.prevent="pixelMouseDown(index)"
                @mouseover.prevent="pixelMouseOver(index)">
            </div>
        </div>
    `,
};

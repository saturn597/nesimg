import PixelMatrix from './pixel-matrix';

export default {
    components: {
        PixelMatrix,
    },
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
        <div id="overview" :style="style">
            <pixel-matrix
                v-for="n in pixels.length"
                :class="{ active: n - 1 === currentSprite }"
                :columns="8"
                :rows="8"
                :key="n"
                :palette="palette"
                :pixels="pixels[n - 1]"
                :onClick="updateSprites[n - 1]"
            >
            </pixel-matrix>
        </div>
    `,
};


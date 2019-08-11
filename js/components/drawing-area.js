import PixelMatrix from './pixel-matrix';

export default {
    components: {
        PixelMatrix,
    },
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
            :rows="8"
            :columns="8"
            :palette="palette"
            :pixelMouseDown="mousedown"
            :pixelMouseOver="isDrawing ? update : () => {}"
            :pixels="drawing"
            v-on="$listeners"
        >
        </pixel-matrix>
    `,
};

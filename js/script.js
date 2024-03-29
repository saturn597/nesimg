import DrawingArea from './components/drawing-area';
import FileProcessor from './components/file-processor';
import PageControls from './components/page-controls';
import OverviewArea from './components/overview-area';
import PixelMatrix from './components/pixel-matrix';

import Utilities from './utilities';


Vue.component('app', {
    components: {
        DrawingArea,
        FileProcessor,
        PageControls,
        OverviewArea,
        PixelMatrix,
    },
    computed: {
        currentPageSprites: function() {
            const start = this.currentPage * this.pageSize;
            const end = start + this.pageSize;
            return this.sprites.slice(start, end);
        },
        currentPalette: function() {
            return this.selectedColors.map(c => this.allColors[c]);
        },
        maxPage: function() {
            return Math.ceil(this.sprites.length / this.pageSize) - 1;
        },
    },
    data: () => {
        const allColors = Utilities.hexColors;
        const currentIndex = 0;
        const numSprites = 128;
        const selectedColors = [0, 5, 55, 13];
        const sprites = Array(numSprites).fill(Array(64).fill(
            selectedColors[currentIndex]));

        return {
            allColors,
            currentIndex,
            currentPage: 0,
            pageRelativeSprite: 0,
            pageSize: 64,
            selectedColors,
            sprites,
        };
    },
    methods: {
        chrFound: function(bytes) {
            const newPage = Math.floor(bytes / (this.pageSize * 16));
            this.updatePage(newPage);
        },
        downloadChr: function(filename) {
            // Generate a base64 data URL representing the bytes of the CHR
            // data the user is editing. Set it as the href of a link and
            // then save the link locally.
            const dl = document.createElement('a');
            const bytes =
                [].concat(...this.sprites.map(Utilities.getCHRBytes));
            const base64 = window.btoa(String.fromCharCode(...bytes));
            dl.href = 'data:;base64,' + base64;
            dl.download = filename || 'img.chr';
            document.body.append(dl);
            dl.click();
            document.body.removeChild(dl);
        },
        onFileParse: function(spriteArray) {
            this.sprites = spriteArray.slice();

            // in case we're past the last page in the file
            if (this.currentPage > this.maxPage) {
                this.updatePage(this.maxPage);
            }
        },
        updateSprite: function(n) {
            this.pageRelativeSprite = n;
        },
        updatePalette: function(index) {
            if (!this.selectedColors.includes(index)) {
                Vue.set(this.selectedColors, this.currentIndex, index);
            }
        },
        updatePage: function(newPage) {
            this.currentPage = newPage;
        },
        updatePixel: function(id, newColor) {
            const spritePosition = this.pageSize * this.currentPage + this.pageRelativeSprite;
            const newSprite = this.sprites[spritePosition].slice();
            newSprite[id] = newColor;
            Vue.set(this.sprites, spritePosition, newSprite);
        },
        updateSelection: function(index) {
            this.currentIndex = index;
        },
    },
    props: {
        isDrawing: Boolean,
    },
    template: `
        <div id='app'>
            <div id="colorIndicator"
                :style="{ backgroundColor: currentPalette[currentIndex] }"
            >
            </div>
            <pixel-matrix class="allColors"
                :active="selectedColors"
                :columns="4"
                :rows="16"
                :palette="allColors"
                :pixelMouseDown="updatePalette"
            >
            </pixel-matrix>
            <drawing-area class="drawing"
                :currentIndex="currentIndex"
                :drawing="currentPageSprites[pageRelativeSprite]"
                :isDrawing="isDrawing"
                :drawingUpdated="updatePixel"
                :palette="currentPalette"
            >
            </drawing-area>
            <pixel-matrix class="paletteDisplay"
                :active="[currentIndex]"
                :columns="1"
                :rows="currentPalette.length"
                :palette="currentPalette"
                :pixelMouseDown="updateSelection"
            >
            </pixel-matrix>
            <overview-area
                :currentSprite="pageRelativeSprite"
                :pixels="currentPageSprites"
                :palette="currentPalette"
                :updateSprite="updateSprite"
            >
            </overview-area>
            <file-processor
                :chrFound="chrFound"
                :saveAs="downloadChr"
                :onParse="onFileParse"
            >
            </file-processor>
            <page-controls
                :currentPage="currentPage"
                :maxPage="maxPage"
                :updatePage="updatePage"
            >
            </page-controls>
        </div>
    `,

});


const app = new Vue({
    data: function() {
        return {
            mousebuttons: false,
        };
    },
    el: "#app",
    template: `
        <app :isDrawing="mousebuttons"></app>
    `,
});


document.body.onmousedown = function(e) {
    app.mousebuttons = true;
};
document.body.onmouseup = function(e) {
    app.mousebuttons = false;
};

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/components/drawing-area.js":
/*!***************************************!*\
  !*** ./js/components/drawing-area.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _pixel_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pixel-matrix */ \"./js/components/pixel-matrix.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    components: {\n        PixelMatrix: _pixel_matrix__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n    },\n    data: function() {\n        return { erase: false };\n    },\n    methods: {\n        mousedown: function(id) {\n            // Uncomment below line to allow \"erasing\", which creates blank\n            // pixels. Blank pixels aren't really an intrinsic part of the\n            // NES binary image format, so disallowing for now.\n            //\n            // this.erase = this.drawing[id] === this.currentIndex;\n\n\n            this.update(id);\n        },\n        update: function(id) {\n            this.drawingUpdated(id, this.erase ? null : this.currentIndex);\n        },\n    },\n    props: {\n        currentIndex: Number,\n        drawing: Array,\n        drawingUpdated: {\n            default: () => {},\n            type: Function,\n        },\n        isDrawing: {\n            default: false,\n            type: Boolean,\n        },\n        palette: {\n            type: Array,\n        },\n    },\n    template: `\n        <pixel-matrix\n            :rows=\"8\"\n            :columns=\"8\"\n            :palette=\"palette\"\n            :pixelMouseDown=\"mousedown\"\n            :pixelMouseOver=\"isDrawing ? update : () => {}\"\n            :pixels=\"drawing\"\n            v-on=\"$listeners\"\n        >\n        </pixel-matrix>\n    `,\n});\n\n\n//# sourceURL=webpack:///./js/components/drawing-area.js?");

/***/ }),

/***/ "./js/components/file-processor.js":
/*!*****************************************!*\
  !*** ./js/components/file-processor.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    data: function() {\n        return {\n            chrSize: 0,\n            chrStart: 0,\n            filenameToSave: '',\n            isInes: false,\n            filenameOpened: '',\n        };\n    },\n    methods: {\n        processSprite: function(data) {\n            // Take raw data for a single sprite in CHR format, represented\n            // as an array of integers 0-255, each of which corresponds to\n            // one byte of the raw data.  Output series of integers 0-3,\n            // each representing the color of a given pixel. (As selected\n            // from palette of 4 colors).\n            const result = [];\n            for (let row = 0; row < 8; row++) {\n                for (let col = 7; col >= 0; col--) {\n                    const bit1 = 1 & (data[row] >>> col);\n                    const bit2 = 1 & (data[row + 8] >>> col);\n                    result.push(bit1 + bit2 * 2);\n                }\n            }\n            return result;\n        },\n        handleFile: function(file) {\n            const reader = new FileReader();\n            reader.onload = loadEvent => this.parseArrayBuffer(loadEvent.target.result);\n            reader.readAsArrayBuffer(file);\n            this.filenameOpened = file.name;\n        },\n        parseArrayBuffer(buffer) {\n            // check if we're dealing with ines file\n            const header = new Uint8Array(buffer.slice(0, 16));\n            const magic = [0x4e, 0x45, 0x53, 0x1a];  // Ascii NES + 1a\n            this.isInes = magic.every((b, i) => b === header[i]);\n\n            if (this.isInes) {\n                const trainerPresent = (header[6] & 4) / 4;\n                const prgSize = 16384 * header[4];\n                this.chrSize = header[5];\n                if (this.chrSize > 0) {\n                    this.chrStart = 16 + prgSize + trainerPresent * 512;\n                    this.chrFound(this.chrStart, this.chrSize);\n                }\n            }\n\n            // Take array buffer and output array of sprites.\n            const numSprites = buffer.byteLength / 16;\n            const sprites = [];\n            for (let sprite = 0; sprite < numSprites; sprite++) {\n                const pixels = [];\n                const spriteData = new Uint8Array(\n                    buffer.slice(16 * sprite, 16 * (sprite + 1)));\n                sprites.push(this.processSprite(spriteData));\n            }\n            this.onParse(sprites);\n        }\n    },\n    props: {\n        chrFound: {\n            default: () => {},\n            type: Function,\n        },\n        saveAs: {\n            // Function to call when our save button is pushed.\n            // Will be passed the filename to save as.\n            type: Function,\n        },\n        onParse: {\n            // When we've parsed a file, this prop is called with the\n            // resulting array of sprites.\n            default: () => {},\n            type: Function,\n        },\n    },\n    template: `\n        <div id=\"fileProcessor\">\n            <button @click=\"saveAs(filenameToSave)\" id=\"downloadButton\">Save...</button>\n            <label>Filename:<input v-model=\"filenameToSave\" placeholder=\"img.chr\"></label>\n            <hr>\n            <label id=\"open\">Open...\n                <input\n                    type=\"file\"\n                    id=\"chrUpload\"\n                    @change= \"e => handleFile(e.target.files[0])\"\n                >\n            </label>\n            {{ filenameOpened }}<strong v-if=\"isInes\"> (iNES) </strong>\n        </div>\n    `,\n});\n\n\n//# sourceURL=webpack:///./js/components/file-processor.js?");

/***/ }),

/***/ "./js/components/overview-area.js":
/*!****************************************!*\
  !*** ./js/components/overview-area.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _pixel_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pixel-matrix */ \"./js/components/pixel-matrix.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    components: {\n        PixelMatrix: _pixel_matrix__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n    },\n    created: function() {\n        this.updateSprites = [];\n        for (let i = 0; i < Math.floor(this.pixels.length); i++) {\n            this.updateSprites.push(this.updateSprite.bind(this, i));\n        }\n\n        // Try to make the overview a square-ish grid\n        const n = Math.ceil(Math.sqrt(this.pixels.length));\n        this.style = {\n            display: 'grid',\n            gridTemplateRows: `repeat(${n}, ${ 1 / n }fr)`,\n            gridTemplateColumns: `repeat(${n}, ${ 1 / n }fr)`,\n        };\n    },\n    props: {\n        currentSprite: Number,\n        palette: Array,\n        pixels: {\n            default: [],\n            type: Array,\n        },\n        updateSprite: Function,\n    },\n    template: `\n        <div id=\"overview\" :style=\"style\">\n            <pixel-matrix\n                v-for=\"n in pixels.length\"\n                :class=\"{ active: n - 1 === currentSprite }\"\n                :columns=\"8\"\n                :rows=\"8\"\n                :key=\"n\"\n                :palette=\"palette\"\n                :pixels=\"pixels[n - 1]\"\n                :onClick=\"updateSprites[n - 1]\"\n            >\n            </pixel-matrix>\n        </div>\n    `,\n});\n\n\n\n//# sourceURL=webpack:///./js/components/overview-area.js?");

/***/ }),

/***/ "./js/components/page-controls.js":
/*!****************************************!*\
  !*** ./js/components/page-controls.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    methods: {\n        nextPage: function() {\n            this.updatePage(this.currentPage + 1);\n        },\n        prevPage: function() {\n            this.updatePage(this.currentPage - 1);\n        },\n    },\n    props: {\n        currentPage: {\n            type: Number,\n        },\n        maxPage: {\n            type: Number,\n        },\n        updatePage: {\n            type: Function,\n        },\n    },\n    template: `\n        <div id=\"pageControls\">\n            <button @click=\"prevPage\" :disabled=\"currentPage <= 0\">\n                prev\n            </button>\n            <button @click=\"nextPage\" :disabled=\"currentPage >= maxPage\">\n                next\n            </button>\n            <div>Page {{ currentPage + 1 }} of {{ maxPage + 1 }}</div>\n        </div>\n    `,\n});\n\n\n//# sourceURL=webpack:///./js/components/page-controls.js?");

/***/ }),

/***/ "./js/components/pixel-matrix.js":
/*!***************************************!*\
  !*** ./js/components/pixel-matrix.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    computed: {\n        finalPixels: function() {\n            return this.pixels || this.palette.map((p, i) => i);\n        },\n    },\n    data: function() {\n        const r = \"repeat(\" + this.rows + \", \" + 1/this.rows + \"fr)\";\n        const c = \"repeat(\" + this.columns + \", \" + 1/this.columns + \"fr)\";\n\n        const style = {\n            display: \"inline-grid\",\n            gridTemplateRows: r,\n            gridTemplateColumns: c,\n        };\n\n        return { style };\n    },\n    props: {\n        active: {\n            default: () => [],\n            type: Array,\n        },\n        columns: {\n            default: 1,\n            type: Number,\n        },\n        rows: {\n\n            default: 1,\n            type: Number,\n        },\n        onClick: {\n            default: () => {},\n            type: Function,\n        },\n        palette: {\n            default: null,\n            type: Array,\n        },\n        pixelMouseDown: {\n            default: () => {},\n            type: Function,\n        },\n        pixelMouseOver: {\n            default: () => {},\n            type: Function,\n        },\n        pixels: Array,\n    },\n    template: `\n        <div class=\"pixelMatrix\" :style=\"style\" @click=\"onClick\">\n            <div class=\"pixel\"\n                v-for=\"(color, index) in finalPixels\"\n                :class=\"{ active: active.includes(color) }\"\n                :style=\"{ backgroundColor: palette[color] }\"\n                :key=\"index\"\n                @mousedown.prevent=\"pixelMouseDown(index)\"\n                @mouseover.prevent=\"pixelMouseOver(index)\"\n            >\n            </div>\n        </div>\n    `,\n});\n\n\n//# sourceURL=webpack:///./js/components/pixel-matrix.js?");

/***/ }),

/***/ "./js/script.js":
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_drawing_area__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/drawing-area */ \"./js/components/drawing-area.js\");\n/* harmony import */ var _components_file_processor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/file-processor */ \"./js/components/file-processor.js\");\n/* harmony import */ var _components_page_controls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/page-controls */ \"./js/components/page-controls.js\");\n/* harmony import */ var _components_overview_area__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/overview-area */ \"./js/components/overview-area.js\");\n/* harmony import */ var _components_pixel_matrix__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/pixel-matrix */ \"./js/components/pixel-matrix.js\");\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utilities */ \"./js/utilities.js\");\n\n\n\n\n\n\n\n\n\nVue.component('app', {\n    components: {\n        DrawingArea: _components_drawing_area__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n        FileProcessor: _components_file_processor__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n        PageControls: _components_page_controls__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n        OverviewArea: _components_overview_area__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n        PixelMatrix: _components_pixel_matrix__WEBPACK_IMPORTED_MODULE_4__[\"default\"],\n    },\n    computed: {\n        currentPageSprites: function() {\n            const start = this.currentPage * this.pageSize;\n            const end = start + this.pageSize;\n            return this.sprites.slice(start, end);\n        },\n        currentPalette: function() {\n            return this.selectedColors.map(c => this.allColors[c]);\n        },\n        maxPage: function() {\n            return Math.ceil(this.sprites.length / this.pageSize) - 1;\n        },\n    },\n    data: () => {\n        const allColors = _utilities__WEBPACK_IMPORTED_MODULE_5__[\"default\"].hexColors;\n        const currentIndex = 0;\n        const numSprites = 128;\n        const selectedColors = [0, 5, 55, 13];\n        const sprites = Array(numSprites).fill(Array(64).fill(\n            selectedColors[currentIndex]));\n\n        return {\n            allColors,\n            currentIndex,\n            currentPage: 0,\n            pageRelativeSprite: 0,\n            pageSize: 64,\n            selectedColors,\n            sprites,\n        };\n    },\n    methods: {\n        chrFound: function(bytes) {\n            const newPage = Math.floor(bytes / (this.pageSize * 16));\n            this.updatePage(newPage);\n        },\n        downloadChr: function(filename) {\n            // Generate a base64 data URL representing the bytes of the CHR\n            // data the user is editing. Set it as the href of a link and\n            // then save the link locally.\n            const dl = document.createElement('a');\n            const bytes =\n                [].concat(...this.sprites.map(_utilities__WEBPACK_IMPORTED_MODULE_5__[\"default\"].getCHRBytes));\n            const base64 = window.btoa(String.fromCharCode(...bytes));\n            dl.href = 'data:;base64,' + base64;\n            dl.download = filename || 'img.chr';\n            document.body.append(dl);\n            dl.click();\n            document.body.removeChild(dl);\n        },\n        onFileParse: function(spriteArray) {\n            this.sprites = spriteArray.slice();\n\n            // in case we're past the last page in the file\n            if (this.currentPage > this.maxPage) {\n                this.updatePage(this.maxPage);\n            }\n        },\n        updateSprite: function(n) {\n            this.pageRelativeSprite = n;\n        },\n        updatePalette: function(index) {\n            if (!this.selectedColors.includes(index)) {\n                Vue.set(this.selectedColors, this.currentIndex, index);\n            }\n        },\n        updatePage: function(newPage) {\n            this.currentPage = newPage;\n        },\n        updatePixel: function(id, newColor) {\n            const spritePosition = this.pageSize * this.currentPage + this.pageRelativeSprite;\n            const newSprite = this.sprites[spritePosition].slice();\n            newSprite[id] = newColor;\n            Vue.set(this.sprites, spritePosition, newSprite);\n        },\n        updateSelection: function(index) {\n            this.currentIndex = index;\n        },\n    },\n    props: {\n        isDrawing: Boolean,\n    },\n    template: `\n        <div id='app'>\n            <div id=\"colorIndicator\"\n                :style=\"{ backgroundColor: currentPalette[currentIndex] }\"\n            >\n            </div>\n            <pixel-matrix class=\"allColors\"\n                :active=\"selectedColors\"\n                :columns=\"4\"\n                :rows=\"16\"\n                :palette=\"allColors\"\n                :pixelMouseDown=\"updatePalette\"\n            >\n            </pixel-matrix>\n            <drawing-area class=\"drawing\"\n                :currentIndex=\"currentIndex\"\n                :drawing=\"currentPageSprites[pageRelativeSprite]\"\n                :isDrawing=\"isDrawing\"\n                :drawingUpdated=\"updatePixel\"\n                :palette=\"currentPalette\"\n            >\n            </drawing-area>\n            <pixel-matrix class=\"paletteDisplay\"\n                :active=\"[currentIndex]\"\n                :columns=\"1\"\n                :rows=\"currentPalette.length\"\n                :palette=\"currentPalette\"\n                :pixelMouseDown=\"updateSelection\"\n            >\n            </pixel-matrix>\n            <overview-area\n                :currentSprite=\"pageRelativeSprite\"\n                :pixels=\"currentPageSprites\"\n                :palette=\"currentPalette\"\n                :updateSprite=\"updateSprite\"\n            >\n            </overview-area>\n            <file-processor\n                :chrFound=\"chrFound\"\n                :saveAs=\"downloadChr\"\n                :onParse=\"onFileParse\"\n            >\n            </file-processor>\n            <page-controls\n                :currentPage=\"currentPage\"\n                :maxPage=\"maxPage\"\n                :updatePage=\"updatePage\"\n            >\n            </page-controls>\n        </div>\n    `,\n\n});\n\n\nconst app = new Vue({\n    data: function() {\n        return {\n            mousebuttons: false,\n        };\n    },\n    el: \"#app\",\n    template: `\n        <app :isDrawing=\"mousebuttons\"></app>\n    `,\n});\n\n\ndocument.body.onmousedown = function(e) {\n    app.mousebuttons = true;\n};\ndocument.body.onmouseup = function(e) {\n    app.mousebuttons = false;\n};\n\n\n//# sourceURL=webpack:///./js/script.js?");

/***/ }),

/***/ "./js/utilities.js":
/*!*************************!*\
  !*** ./js/utilities.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction getCHRBytes(pixels) {\n    // Takes array representing the pixels in a single 8x8 sprite.\n    // Ouputs array representing the bytes of the image in NES CHR\n    // format. Each element of the array is a number representing\n    // one byte.\n    //\n    // Explanation of CHR format in words:\n    //\n    // A given 8x8 pixel sprite takes up 16 bytes.\n    //\n    // Each row of 8 pixels occupies two of those bytes.  The two\n    // bytes for a row are offset by 8 bytes. So the first row\n    // takes byte 0 and byte 8, and row 2 takes byte 1 and byte 9,\n    // and the last row in the sprite takes up byte 7 and byte 15.\n    //\n    // Within a row, the color of each individual pixel is\n    // described by one bit from the first byte and one bit from\n    // the second (offset-by-8-bytes) byte. So, the first pixel is\n    // described by the combination of bit 0 of byte 0 and bit 0 of\n    // byte 8. The second pixel is described by bit 1 of byte 0 and\n    // bit 1 of byte 8, and so on. Then the same for the next row,\n    // but it's byte 1 and byte 9, and the last row is byte 7 and\n    // byte 15.\n    //\n    // Once we fill up 16 bytes this way, we have a full sprite.\n    // The next sprite occupies the next 16 bytes and so on.\n    //\n    // Because we only have 2 bits of data for each pixel, each\n    // pixel in a sprite can only be one of 4 different colors.\n    // Which colors a given bit-pattern represents is determined by\n    // separate palette information.\n    //\n    //\n    // TODO: special class to deal with CHR data might be useful\n\n    const result = Array(16).fill(0);\n    for (let i = 0; i < 64; i++) {\n        // Proceed through the pixels and depending on the color\n        // set the appropriate bits in our array.\n        const color = pixels[i];\n        const row = Math.floor(i / 8);\n        const column = 7 - i % 8;\n\n        if (color === 1 || color === 3) {\n            result[row] += 2 ** column;\n        }\n        if (color === 2 || color === 3) {\n            result[row + 8] += 2 ** column;\n        }\n    }\n\n    return result;\n}\n\n\n// NES Palette.\n// Per: http://www.thealmightyguru.com/Games/Hacking/Wiki/index.php/NES_Palette\n\nconst hexColors =\n[\"#7C7C7C\", \"#0000FC\", \"#0000BC\", \"#4428BC\", \"#940084\", \"#A80020\", \"#A81000\",\n\"#881400\", \"#503000\", \"#007800\", \"#006800\", \"#005800\", \"#004058\", \"#000000\",\n\"#000000\", \"#000000\", \"#BCBCBC\", \"#0078F8\", \"#0058F8\", \"#6844FC\", \"#D800CC\",\n\"#E40058\", \"#F83800\", \"#E45C10\", \"#AC7C00\", \"#00B800\", \"#00A800\", \"#00A844\",\n\"#008888\", \"#000000\", \"#000000\", \"#000000\", \"#F8F8F8\", \"#3CBCFC\", \"#6888FC\",\n\"#9878F8\", \"#F878F8\", \"#F85898\", \"#F87858\", \"#FCA044\", \"#F8B800\", \"#B8F818\",\n\"#58D854\", \"#58F898\", \"#00E8D8\", \"#787878\", \"#000000\", \"#000000\", \"#FCFCFC\",\n\"#A4E4FC\", \"#B8B8F8\", \"#D8B8F8\", \"#F8B8F8\", \"#F8A4C0\", \"#F0D0B0\", \"#FCE0A8\",\n\"#F8D878\", \"#D8F878\", \"#B8F8B8\", \"#B8F8D8\", \"#00FCFC\", \"#F8D8F8\", \"#000000\",\n\"#000000\",];\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    getCHRBytes,\n    hexColors,\n});\n\n\n//# sourceURL=webpack:///./js/utilities.js?");

/***/ })

/******/ });
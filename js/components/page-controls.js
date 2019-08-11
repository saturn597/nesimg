export default {
    methods: {
        nextPage: function() {
            this.updatePage(this.currentPage + 1);
        },
        prevPage: function() {
            this.updatePage(this.currentPage - 1);
        },
    },
    props: {
        currentPage: {
            type: Number,
        },
        maxPage: {
            type: Number,
        },
        updatePage: {
            type: Function,
        },
    },
    template: `
        <div id="pageControls">
            <button @click="prevPage" :disabled="currentPage <= 0">
                prev
            </button>
            <button @click="nextPage" :disabled="currentPage >= maxPage">
                next
            </button>
            <div>Page {{ currentPage + 1 }} of {{ maxPage + 1 }}</div>
        </div>
    `,
};

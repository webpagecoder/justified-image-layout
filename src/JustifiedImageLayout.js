/**
 * Creates a justified output gallery display for a collection of images
 * @author John Brown <john@webpagecoder.com>
 * @version 1.0.0
 */

/** Holds pattern information for each row in the layout */
class RowPattern {

    /** @constructs RowPattern */
    constructor() {
        this.length = 0;
        this.ratioSum = 0;
        this.ratios = []
        this.next = null;
    }
}

/** Creates the justified image layout */
export default class JustifiedImageLayout {

    /** @constructs JustifiedImageLayout */
    constructor(container, rowRatios, images, options) {
        if (rowRatios.length === 0) {
            rowRatios = [[0.25, 0.25, 0.25, 0.25]]
        }

        // Create circular list for patterns
        const rowPatterns = [];
        let prevRowPattern = null;
        rowRatios.forEach(ratios => {
            const curRowPattern = new RowPattern();
            curRowPattern.length = ratios.length;
            curRowPattern.ratios = ratios;
            ratios.forEach(ratio => {
                curRowPattern.ratioSum += ratio;
            });
            rowPatterns.push(curRowPattern);
            if (prevRowPattern) {
                prevRowPattern.next = curRowPattern;
            }
            prevRowPattern = curRowPattern;
        });
        this.currentRowPattern = rowPatterns[0];
        rowPatterns[rowPatterns.length - 1].next = this.currentRowPattern;

        // Set defaults and options
        this.currentIndex = 0;
        this.container = container;
        this.images = images;
        this.options = {
            ...{
                smallSizeDir: '',
                largeSizeDir: '',
                rowHeight: '150px',
                padding: '10px',
                expandFinalImage: true,
                enableAutoLoad: true,
                autoLoadAmount: 50,
                onClickImage: (imgName) => { }
            },
            ...options
        };

        // Set styles on container
        this.setStyles(container, {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap'
        });

        // Add scroll listener if needed
        if (this.options.enableAutoLoad) {
            this.onScrollBottom = this.onScrollBottom.bind(this);
            window.addEventListener('scroll', this.onScrollBottom);
        }
    }

    /** Auto-load more images */
    onScrollBottom() {
        if ((window.innerHeight + window.scrollY) + 10 >= document.body.offsetHeight) {
            window.removeEventListener('scroll', this.onScrollBottom);
            this.draw();
            window.addEventListener('scroll', this.onScrollBottom);
        }
    }

    /** Set a style on an element */
    setStyles(element, styles) {
        Object.keys(styles).forEach(property => {
            element.style[property] = styles[property];
        })
    }

    /** Insert the break to force rows */
    insertBreak() {
        const spacer = document.createElement('div');
        this.setStyles(spacer, {
            flexBasis: '100%',
            height: 0
        });
        this.container.appendChild(spacer);
    }

    /** Insert an image into the layout */
    insertImage(imageUrl, width) {
        const box = document.createElement('div');
        const flexGrow = this.options.expandFinalImage ? 1 : 0;
        const flexBasis = 'calc(' + width + '% - ' + this.options.padding + ')';
        this.setStyles(box, {
            padding: 'calc(' + this.options.padding + ' / 2)',
            height: this.options.rowHeight,
            flex: flexGrow + ' ' + flexBasis
        });
        const img = document.createElement('img');
        img.src = this.options.smallSizeDir + imageUrl;

        // Call the user-supplied onclick function
        img.addEventListener('click', () => {
            this.options.onClickImage(this.options.largeSizeDir + imageUrl);
        })
        this.setStyles(img, {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        });
        box.appendChild(img);
        this.container.appendChild(box);
    }

    /** Draw the justified image layout */
    draw() {
        if (!this.images.length) {
            return;
        }
        let autoLoadAmount;
        if (this.options.enableAutoLoad) {
            if (this.options.autoLoadAmount > this.images.length) {
                autoLoadAmount = this.images.length;
            } else {
                autoLoadAmount = this.options.autoLoadAmount;
            }
        } else {
            autoLoadAmount = this.images.length;
        }
        for (let i = 0; i < autoLoadAmount; i++) {
            const imageUrl = this.images.shift();
            if (this.currentIndex === this.currentRowPattern.length) {
                this.currentIndex = 0;
                this.currentRowPattern = this.currentRowPattern.next;
                this.insertBreak();
            }
            this.insertImage(
                imageUrl,
                this.currentRowPattern.ratios[this.currentIndex] / this.currentRowPattern.ratioSum * 100
            );
            this.currentIndex++;
        }
    }
}


//import '../style/tag-slider.scss';


(function ($) {

    class TagSlider {
        constructor(slider, options) {
            //console.log(slider, options);

            this.list = $(slider);

            const defaults = {
                initialTag: 0,
                tagClass: 'tagSlider__tag',
                prevArrowContent: '<',
                nextArrowContent: '>',
                easing: 'swing',
            };

            this.options = {...defaults, ...options};

            this.buildStructure();

            this.dmax = 0; //maximal displacement
            this.d = 0; //displacement
            this.l = this.getTagListWidth(); //list width
            this.s = this.container.outerWidth(); //scene width
            this.scrollbarHeight = MeasureScrollbar();
            this.scene.css('margin-bottom', -this.scrollbarHeight);
            this.leftCap = false;
            this.rightCap = false;
            this.items = [];
            this.tagOffsets = [];
            this.activeTag = false;


            this.buttonLeft.on('click', () => {
                !this.leftCap ? this.scrollBy(-200) : ''
            });
            this.buttonRight.on('click', () => {
                console.log('right');
                !this.rightCap ? this.scrollBy(200) : ''
            });

            this.scene.scroll(() => {
                this.d = this.scene.scrollLeft();
                this.reenableArrows();
            });


            this.init();
        }

        buildStructure = () => {
            this.scene = this.list.wrap('<div class="tagSlider__scene"></div>').parent();
            this.container = this.scene.wrap('<div class="tagSlider"></div>').parent();
            this.buttonRight = $('<button class="tagSlider__button tagSlider__button-next">'+this.options.nextArrowContent+'</button>');
            this.buttonLeft = $('<button class="tagSlider__button tagSlider__button-prev">'+this.options.prevArrowContent+'</button>');
            this.container.append(this.buttonRight);
            this.container.prepend(this.buttonLeft);
            this.scene.find('li').each((index, element) =>{
                const li = $(element);
                li.html('<button class="'+this.options.tagClass+'">'+li.html()+'</button>')
            });
            this.list.trigger('built', [this]);
        };

        init = () => {
            this.activeTag = this.options.initialTag;
            this.recalculate();
            this.countTags();
            this.selectTag(false, true);
            $(window).resize(this.recalculate);
            this.container.addClass('tagSlider-loaded');
            this.list.trigger('init', [this]);
        };

        countTags = () => {
            this.items = [];
            this.scene.find('ul>li').each((i, item) => {
                $(item).find('.'+this.options.tagClass).on('click', () => this.handleTagClick(i));
                this.items.push($(item))
            });
        };

        scrollToActive = (noAnimation) => {
            if (typeof (noAnimation) === "undefined") noAnimation = false;
            if (typeof this.activeTag === 'number') {
                const activeLi = this.items[this.activeTag];
                const o = this.tagOffsets[this.activeTag]; //left offset of a tag in the list
                const s = this.s / 2; //half scene
                const b = (activeLi.outerWidth() / 2); //half width
                const increment = (o + b) - (this.d + s);
                this.scrollBy(increment, noAnimation);
            }
        };

        handleTagClick = (i) => {
            this.list.trigger('tagSelected', [i, this.activeTag, this]);
            this.selectTag(i);
            const tag = this.items[i];
        };

        selectTag = (args, noAnimation = false) => {
            let index = args[0] || args;
            if (index === false) {
                index = this.activeTag;
            }
            if (index < this.items.length) {
                this.activeTag = index;
            } else {
                this.activeTag = this.items.length -1;
                console.warn('Atempt to slide to non-existing slide (index: ' + index + ')');
            }
            const activeLi = this.items[this.activeTag];
            this.scrollToActive(noAnimation);
            for (let li in this.items) {
                this.items[li].removeClass('tagSlider__li-active');
            }
            activeLi.addClass('tagSlider__li-active');
        };

        scrollBy = (increment, noAnimation) => {
            if (typeof (noAnimation) === "undefined") noAnimation = false;
            const recalculate = this.recalculate.bind(this);
            let target = (this.d + increment);
            const initialTarget = target;

            if (target <= 0) {
                target = 0;
            } else if (target >= this.dmax) {
                target = Math.ceil(this.dmax);
            }

            const time = !noAnimation ? getTimeFromIncrement(Math.abs(initialTarget - target)) : 0;
            this.d = target;
            this.scene.stop(true, false).animate({
                scrollLeft: target,
            }, time, this.options.easing, recalculate);
        };

        getTagListWidth = () => {
            const list = this.scene;
            let lTemp = 0;
            let tempTagOffsets = [];
            list.find('li').each(function (i) {
                tempTagOffsets.push(lTemp);
                lTemp += $(this).outerWidth();
            });
            this.tagOffsets = tempTagOffsets;
            this.l = lTemp;
        };

        recalculate = () => {
            const container = this.container;
            this.getTagListWidth();
            let s = container.outerWidth();
            if (Math.ceil(this.l) > Math.ceil(s)) {
                container.addClass('tagSlider-overflow');
                container.css('padding-left', this.buttonLeft.outerWidth());
                container.css('padding-right', this.buttonRight.outerWidth());
            } else {
                container.removeClass('tagSlider-overflow');
                container.css('padding-left', '');
                container.css('padding-right', '');
            }
            this.s = this.scene.outerWidth();
            this.dmax = this.l - this.s;
            this.reenableArrows();
        };

        reenableArrows = () => {
            this.leftCap = this.d === 0;
            this.rightCap = this.d >= this.dmax;

            if (this.leftCap) {
                this.buttonLeft.addClass('tagSlider__button-disabled');
            } else {
                this.buttonLeft.removeClass('tagSlider__button-disabled');
            }

            if (this.rightCap) {
                this.buttonRight.addClass('tagSlider__button-disabled');
            } else {
                this.buttonRight.removeClass('tagSlider__button-disabled');
            }
        };
    }

    $.fn.tagSlider = function () {
        const options = arguments[0];
        const args = Array.prototype.slice.call(arguments, 1);
        let ret;
        for (let i = 0; i < this.length; i++) {
            if (typeof options == 'object' || typeof options == 'undefined')
                this[i].tagSlider = new TagSlider($(this[i]), options);
            else {
                this[i].tagSlider[options](args);
            }
            if (typeof ret != 'undefined') return ret;
        }
        return this;
    };

}(jQuery));

//measure scrollbar

function getTimeFromIncrement(increment) {
    let time = Math.pow((Math.abs(increment) + 120), 1 / 3) * 30;
    if (time > 300) {
        time = 300;
    }
    return time;
}

function MeasureScrollbar() {
    const scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    scrollDiv.setAttribute("style", " height: 100px; overflow: scroll; position: absolute; top: -9999px;");
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
}
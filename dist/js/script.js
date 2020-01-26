$(function () {
    /**add arrows to home slider */
    // if ($('.home-slider')) {
    //     $('.home-slider').data('owl.carousel').options.nav = true;
    //     $('.home-slider').trigger('refresh.owl.carousel');

    //     $(".owl-prev").html('<div class="arrow arrow-left"></div>');
    //     $(".owl-next").html('<div class="arrow arrow-right"></div>');
    // }

    /** modal call */
    $('body').on('click', '.js-modal', function (event) {
        event.preventDefault();
        var modal = $(this).attr('data-target');
        $('[data-id="' + modal + '"').fadeIn();
    });
    $(document).click(function (e) {
        if ($('.modal-search, .modal-msg').is(e.target) || $('.modal-search__close, .js-close').is(e.target)) {
            $('.modal-search, .modal-msg').fadeOut();
        };
        // popoverOptions.hide(e);
        popover(null, 'hide', e);
    });

    /** popover toggle */
    const popover = function (options, method, e) {
        const defaultOptions = {
            popoverToggleSelector: '[data-toggle="popover"]',
            getProps: function () {
                const popoverToggle = $(this.popoverToggleSelector);
                const popoverID = popoverToggle.attr('data-target');
                const popover = $('[data-id="' + popoverID + '"');
                const popoverCloseButton = $('[data-dismiss="' + popoverID + '"');

                return { popover, popoverCloseButton, popoverToggle };
            },
        }

        const model = (options && typeof (options) === "object") ? $.extend(true, {}, defaultOptions, options) : defaultOptions;
        const popover = model.getProps().popover;
        const popoverCloseButton = model.getProps().popoverCloseButton;
        const popoverToggle = model.getProps().popoverToggle;

        const show = function () {
            e.preventDefault();
            e.stopPropagation();

            if (popoverCloseButton.is(e.target) || popoverCloseButton.has(e.target).length > 0) {
                popover.fadeOut(200);
            } else {
                popover.fadeIn(200);
            }
        }

        const hide = function () {
            if (!popoverToggle.is(e.target)) {
                popover.fadeOut(200);
            }
        }

        if (method === 'show') show();
        if (method === 'hide') hide();
    };

    // const popoverToggleSelector = '[data-toggle="popover"]';
    // const popoverOptions = {
    //     popoverToggleSelector: popoverToggleSelector,
    //     getProps: function () {
    //         const popoverToggle = $(this.popoverToggleSelector);
    //         const popoverID = popoverToggle.attr('data-target');
    //         const popover = $('[data-id="' + popoverID + '"');
    //         const popoverCloseButton = $('[data-dismiss="' + popoverID + '"');

    //         return { popover, popoverCloseButton, popoverToggle };
    //     },
    //     show: function (e) {
    //         e.preventDefault();
    //         e.stopPropagation();

    //         const popover = this.getProps().popover;
    //         const popoverCloseButton = this.getProps().popoverCloseButton;

    //         if (popoverCloseButton.is(e.target) || popoverCloseButton.has(e.target).length > 0) {
    //             popover.fadeOut(200);
    //         } else {
    //             popover.fadeIn(200);
    //         }
    //     },
    //     hide: function (e) {
    //         const popoverToggle = this.getProps().popoverToggle;
    //         const popover = this.getProps().popover;

    //         if (!popoverToggle.is(e.target)) {
    //             popover.fadeOut(200);
    //         }
    //     }
    // }

    $('body').on('click', '[data-toggle="popover"]', function (e) {
        // popoverOptions.show(e);
        if ($(window).width() >= 768){
            popover(null, 'show', e);
        }
    });

    /**search modal select block */
    $('body').on('click', '.modal-search .b-select__link', function (e) {
        e.preventDefault();
        var modal = $(this).parents('.modal-search');
        var attr = $(this).attr('data-href');
        var select = $('[data-select="Sity"]');
        var activeTab = $('[data-attr="' + attr + '"]').find('[data-select]:first').attr('data-select');
        var input = $('[name="selectedMarketNew"]'); /**input for selected city value */

        if ($(this).parents().is(select)) {
            input.val(attr);
            modal.fadeOut();
            select.find('.is_active').removeClass('is_active');
            $(this).addClass('is_active');

            return true;
        }

        $('.modal-search__active-tab').text(activeTab).attr('data-active-tab', activeTab);

        $(this).parent().siblings().find('.b-select__link:first').removeClass('is_active');
        modal.find('.is_last').removeClass('is_last');
        $(this).addClass('is_active is_last');
    });

    /**mobile menu back link */
    $('body').on('click', '.modal-search__active-tab', function (e) {
        e.preventDefault();
        var activeTab = $(this).attr('data-active-tab');
        var parent = $('[data-select="' + activeTab + '"]').parents('[data-select]');

        $(this).attr('data-active-tab', parent.attr('data-select'));
        $(this).text($(this).attr('data-active-tab'));
        parent.find('.is_last').removeClass('is_last is_active');
        parent.parent().siblings().addClass('is_last');
    });

    /**
     * Need better converting design for CONTACT ME options on vendor profile page
     */

    /* show/hide fixed panel when the user has scrolled through the end of "MESSAGE VENDOR" form
    -----------------------------------------------*/
    $(window).scroll(function () {
        var el = $('.b-form');
        var panel = $('.fixed-menu');

        var top = $(el).offset().top;
        var bottom = top + $(el).height();
        var scroll = $(window).scrollTop();
        (scroll > bottom && scroll < $('.additional').offset().top) ? panel.addClass('is-shown') : panel.removeClass('is-shown');
    });

    /*active link when scroll
-----------------------------------------------*/
    $(window).scroll(function () {
        var $sections = $('section');
        $sections.each(function (i, el) {
            var top = $(el).offset().top - 140;
            var bottom = top + $(el).height();
            var scroll = $(window).scrollTop();
            var id = $(el).attr('id');
            if (scroll > top && scroll < bottom) {
                $('li').removeClass('active');
                $('a[href="#' + id + '"]').parent().addClass('active');
            }
        })
    });

    /*scroll to section
    -----------------------------------------------*/
    $('.js-anchor').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 100
        }, 1000);
        event.preventDefault();
    });

    /**
     * homepage
     ----------------------------------------------*/
    initFeatProdSlider();

    initDefaultSlider();
    $(window).resize(function () {
        initDefaultSlider();
    });

    /**
     * inner pages
     ----------------------------------------------*/
    customersPhotosSlider();

    if ($(".vendor-details-accordion") != null) {
        var interview = $(".vendor-details-accordion");
        var question = interview.find(".panel-collapse h5");
        var arr = [];

        $(question).each(function (indx, element) {
            var answerArr = $(element).nextUntil("blockquote");
            var answer = $("<p></p>");

            answerArr.each(function (i, el) {
                $(el).appendTo(answer);
            });

            arr.push({
                title: $(element).text(),
                text: answer.html()
            });
        });

        interview.html("");

        arr.forEach(function (element, indx) {
            var q = element.title;
            var a = element.text;
            var tmpl = `<div class="vendor-details-group panel">
                            <h5 class="panel-title">
                                <a href="#${indx}" data-toggle="collapse" class="collapsed">${q}</a>\
                                    </h5>\
                            <div id="${indx}" class="panel-collapse collapse" style="height: 0px;">\
                                ${a}
                            </div>
                        </div>`;

            interview.append(tmpl);
        });
    }

    // details page hero slider
    // if ($('.vendor-thumbs') != null) {
    //     $('.vendor-thumbs').data('owl.carousel').options.margin = 5;
    //     $('.vendor-thumbs').trigger('refresh.owl.carousel');
    // }

    // Expanded block (read more/less)
    var expandedBlock = $('[data-attr="expanded"]');
    if (expandedBlock) {
        var ellipsestext = "...";
        var moretext = "Read More";
        var lesstext = "Read Less";

        // Will Shorten Text and Add Addtional HTML Tags
        $(expandedBlock).each(function () {
            var showChar = $(this).data("char-count");
            var content = $(this).html();
            if (content.length > showChar) {
                var show_content = content.substr(0, showChar);
                var hide_content = content.substr(showChar, content.length - showChar);
                var html = show_content + '<span class="moreelipses">' + ellipsestext + '</span><span class="hidden">' + hide_content + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a>';

                $(this).html(html);
            }
        });

        // Less and More Button Functions
        $(".morelink").click(function () {
            if ($(this).hasClass("less")) {
                $(this).removeClass("less");
                $(this).html(moretext);
            } else {
                $(this).addClass("less");
                $(this).html(lesstext);
            }
            $(this).parent().find(".moreelipses").toggle();
            $(this).prev().toggleClass("hidden");
            return false;
        });
    }

    // customize fancybox gallery
    if (typeof $.fn.fancybox == 'function') {
        $('[data-fancybox="gallery"]').fancybox({
            parentEl: '.modal-gallery .modal-msg-img',
            baseClass: "fancybox-custom-layout",
            infobar: false,
            touch: {
                vertical: false
            },
            buttons: ["close"],
            animationEffect: "fade",
            transitionEffect: "fade",
            preventCaptionOverlap: false,
            idleTime: false,
            gutter: 0,
            thumbs: {
                autoStart: true,
                parentEl: ".fancybox-stage",
                axis: "x"
            },
            btnTpl: {
                close:
                    '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">' +
                    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 416 448">' +
                    '<title></title>' +
                    '<g id="icomoon-ignore">' +
                    '</g>' +
                    '<path d="M192 272v96c0 17.5-14.5 32-32 32h-128c-17.5 0-32-14.5-32-32v-96c0-17.5 14.5-32 32-32h128c17.5 0 32 14.5 32 32zM192 80v96c0 17.5-14.5 32-32 32h-128c-17.5 0-32-14.5-32-32v-96c0-17.5 14.5-32 32-32h128c17.5 0 32 14.5 32 32zM416 272v96c0 17.5-14.5 32-32 32h-128c-17.5 0-32-14.5-32-32v-96c0-17.5 14.5-32 32-32h128c17.5 0 32 14.5 32 32zM416 80v96c0 17.5-14.5 32-32 32h-128c-17.5 0-32-14.5-32-32v-96c0-17.5 14.5-32 32-32h128c17.5 0 32 14.5 32 32z"></path>' +
                    '</svg>' +
                    '<span>Gallery</span>' +
                    '</button>',
            },
            //Customize caption area
            caption: function (instance) {
                return '<h3>Caption</h3>';
            },
            afterShow: function (instance, slide) {
                $('.modal-gallery .modal-msg-img > .row').hide();
                $('html').css("overflow", "hidden");
            },
            afterClose: function () {
                $('.modal-gallery .modal-msg-img > .row').fadeIn("fast");
                $('html').removeAttr("style");
            }
        });

        $('.modal-gallery .modal-msg-close').on('click', function () {
            $.fancybox.close();
        });
    }

    $('body').on('input change', '#vendorSearchId', function () {
        var RESET_BTN = $(this).siblings('[data-reset-value]');

        if ($(this).val()) RESET_BTN.show();
        if (!$(this).val()) RESET_BTN.hide();
    });

    $('body').on('click', '[data-reset-value]', function (e) {
        e.preventDefault();

        var RESET_BTN = $(this),
            RESET_TARGET_ID = RESET_BTN.data('reset-target-id'),
            TARGET = $('#' + RESET_TARGET_ID);

        if (TARGET) TARGET.val('').change();
    });
});

function initFeatProdSlider() {
    var slider = $('.featured-products-slider');

    if (slider.length > 0) {
        slider.owlCarousel({
            items: 4,
            dots: false,
            nav: true,
            autoplay: false,
            margin: 15,
            center: false,
            loop: false,
            navText: ["", ""],
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1
                },
                767: {
                    items: 4
                },
                991: {
                    items: 6
                }
            }
        });
    }
}

function customersPhotosSlider() {
    var slider = $('.customer-photos-list');

    if (slider.length > 0) {
        slider.owlCarousel({
            items: 6,
            dots: false,
            nav: false,
            autoplay: false,
            margin: 15,
            center: false,
            loop: false,
            navText: ["", ""],
            responsiveClass: true,
            responsive: {
                0: {
                    items: 2
                },
                767: {
                    items: 4
                }
            }
        });
    }
};

function initDefaultSlider() {
    if (!$('.js-slider-default').hasClass("slick-initialized") && $(window).width() < 768) {
        $('.js-slider-default').slick({
            dots: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev"></button>',
            nextArrow: '<button type="button" class="slick-next"></button>'
        });
    } else if ($('.js-slider-default').hasClass("slick-initialized") && $(window).width() >= 768) {
        $('.js-slider-default').slick('unslick');
    }
};
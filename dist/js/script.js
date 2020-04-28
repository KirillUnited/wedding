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

        const toggleButton = $('[data-attr="dropdown-toggle"]');
        const dropdowns = $('.filter-item-inner');
        const dropdown = new Dropdown({
            toggleButton: toggleButton,
            dropdowns: dropdowns
        });

        dropdown.close($(e.target))
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

    /** dropdown toggle */
    class Dropdown {
        constructor(options) {
            this.toggleButton = options.button
            this.dropdown = options.dropdown
            this.dropdowns = options.dropdowns
        }

        toggleDropdown() {
            this.dropdowns ? this.dropdowns.parent().removeClass('active') : null;
            this.dropdown.parent().hasClass('active') ? this.toggleButton.parent().removeClass('active') : this.toggleButton.parent().addClass('active');
        }

        close(target) {
            var dropdownTarget = target.closest(this.dropdowns)
            var dropdownButton = target.closest(this.toggleButton)

            !dropdownTarget.length > 0 && !dropdownButton.length > 0 ? this.dropdowns.parent().removeClass('active') : null;
        }
    }

    $('body').on('click', '[data-attr="dropdown-toggle"]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const toggleButton = $(this);
        const target = $(`#${toggleButton.data("target")}`);
        const dropdowns = $('.filter-item-inner');

        const dropdown = new Dropdown({
            button: toggleButton,
            dropdown: target,
            dropdowns: dropdowns
        });

        dropdown.toggleDropdown();
    });

    $('body').on('click', '[data-toggle="slidePopover"]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const toggleButton = $(this);
        const target = $(`#${toggleButton.data("target")}`);

        const dropdown = new Dropdown({
            button: toggleButton,
            dropdown: target
        });

        dropdown.toggleDropdown();
    });

    $('body').on('change', '.catalog-filter .filter-list input', function (e) {
        findCheckedInput($(this));
    });

    $('body').on('mouseup', '[data-attr="filter-dropdown-reset"], .filter-reset', function (e) {
        const button = $(this);
        const dropdown = button.is('[data-attr="filter-dropdown-reset"]') ? $(`#${button.attr("data-target")}`) : $('.filter-item-inner');

        $(dropdown).each(function (index, element) {
            // element == this
            const input = $(this).find('input');

            input.prop('checked', false);

            findCheckedInput($(input));
        });
    });

    $('body').on('keyup', '.filter-search input', function (e) {
        const filter = $(this);
        const filterValue = filter.val().toLowerCase();
        const filterItems = filter.closest('.filter-item-inner').find('.filter-list label');

        $(filterItems).each(function (index, element) {
            if ($(this).text().toLowerCase().indexOf(filterValue) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    function findCheckedInput(input) {
        const parent = input.closest('.filter-item-inner').parent();
        const countWrapper = parent.find('.selected-count');
        const searchInput = parent.find('.filter-search input');
        const labels = parent.find('.filter-list label');

        let count = 0;

        $(input).each(function (index, element) {
            // element == this
            count = $(parent).find('input:checked').length;
        });

        if (count > 0) {
            parent.addClass('is-selected');
            countWrapper.text(count);
        } else {
            parent.removeClass('is-selected');
            countWrapper.text('');
        }

        searchInput.val('');
        labels.removeAttr('style');
    }

    $('body').on('click', '[data-toggle="popover"]', function (e) {
        // popoverOptions.show(e);
        if ($(window).width() >= 768) {
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

    /**
     * VENDOR_GALLERY_MODAL
     */
    $('[data-toggle="modal-gallery"]').on('click', function () {
        const targetID = $(this).data('target'),
            $modal = $(`[data-id="${targetID}"]`),
            $modalImgWrapper = $modal.find('.modal-msg-img .row'),
            _createModalItem = function (param) {
                return `
                    <div class="col-sm-3 col-xs-6">
                        <a class="modal-gallery-item" href="${param.imgURL || ''}" data-fancybox="gallery">
                            <img src="${param.imgThumbnailURL || ''}" alt="${param.imgAltText || ''}"
                                 class="thumbnail-image" />
                        </a>
                    </div>
            `
            },
            thumbnailSizeName = "medium";

        if ($modal.find('[data-attr="preloader"]').length === 0) {
            const $preloader = createPreloader();

            $modalImgWrapper.append($preloader);
        }

        $('html').css("overflow", "hidden");

        $.ajax({
            type: "POST",
            url: "/VendorDetails/gallery?vendorId=" + $('[data-vendor]').data('vendor'),
            success: function (response) {
                if (response) {
                    const data = JSON.parse(response).vendorThumbnails;

                    $modalImgWrapper.empty();

                    $(data).each(function (index, element) {
                        const param = {
                            imgURL: element.url,
                            imgThumbnailURL: element.thumbs.filter(function (el, i, self) {
                                return el.sSizeName === thumbnailSizeName ? el.url : false;
                            })[0].url,
                            imgAltText: element.sAltText
                        };

                        const $modalItem = _createModalItem(param);

                        $modalImgWrapper.append($modalItem);
                        initCustomFancybox();
                    });
                }
            }
        });

        $('.modal-gallery .modal-msg-close').on('click', function () {
            $.fancybox.close();
            $('html').removeAttr("style");
        });

    });
    /** END VENDOR_GALLERY_MODAL */


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

// customize fancybox gallery
function initCustomFancybox() {
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
            },
            afterClose: function () {
                $('.modal-gallery .modal-msg-img > .row').fadeIn("fast");
            }
        });
    }
}

// Create Preloader
const createPreloader = function () {
    return `
            <svg data-attr="preloader" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;background:transparent;display:block;" width="78px" height="78px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <g transform="rotate(0 50 50)">
              <rect x="47" y="24" rx="1.92" ry="1.92" width="6" height="12" fill="#098b8b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(30 50 50)">
              <rect x="47" y="24" rx="1.92" ry="1.92" width="6" height="12" fill="#098b8b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(60 50 50)">
              <rect x="47" y="24" rx="1.92" ry="1.92" width="6" height="12" fill="#098b8b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(90 50 50)">
              <rect x="47" y="24" rx="1.92" ry="1.92" width="6" height="12" fill="#098b8b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(120 50 50)">
              <rect x="47" y="24" rx="1.92" ry="1.92" width="6" height="12" fill="#098b8b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(150 50 50)">
              <rect x="47" y="24" rx="1.92" ry="1.92" width="6" height="12" fill="#098b8b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(180 50 50)">
              <rect x="47" y="24" rx="1.92" ry="1.92" width="6" height="12" fill="#098b8b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(210 50 50)">
              <rect x="47" y="24" rx="1.92" ry="1.92" width="6" height="12" fill="#098b8b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(240 50 50)">
              <rect x="47" y="24" rx="1.92" ry="1.92" width="6" height="12" fill="#098b8b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(270 50 50)">
              <rect x="47" y="24" rx="1.92" ry="1.92" width="6" height="12" fill="#098b8b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(300 50 50)">
              <rect x="47" y="24" rx="1.92" ry="1.92" width="6" height="12" fill="#098b8b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(330 50 50)">
              <rect x="47" y="24" rx="1.92" ry="1.92" width="6" height="12" fill="#098b8b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
              </rect>
            </g>
            </svg>
    `
}

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
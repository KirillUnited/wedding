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

    /**
     * inner pages
     ----------------------------------------------*/
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
                }
            }
        });
    }
}
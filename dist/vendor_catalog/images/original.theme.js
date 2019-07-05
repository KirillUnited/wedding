
$(document).ready(function () {

    /*----------------------------------------------------------------*/
    /*--------------------------- MENU BUTTON ------------------------*/
    /*----------------------------------------------------------------*/

    //$('.header .fa-home').click(function () {   /* EE  */
    //    $('.menu').toggleClass('active');
    //});

    //$('.header .fa-bars').click(function () {     /* EE  */
    //    $('.menu').toggleClass('active');
    //    return false;
    //});

    //$('.header .menu > li').click(function () {
    //    $(this).children('ul').toggleClass('active');
    //    //return false;  THIS blocks menu clicks
    //});

    /*----------------------------------------------------------------*/
    /*--------------------------- HOME SLIDER ------------------------*/
    /*----------------------------------------------------------------*/

    $('.home-slider.owl-carousel').on('initialized.owl.carousel', function (event) {
        $(this).find('.owl-slide').each(function () {
            $(this).css('background-image', 'url(' + $(this).data('src') + ')');
        });
        //console.log('lod')
    });
    $('.home-slider.owl-carousel').owlCarousel({
        navElement: 'div role="presentation"',
        items: 1,
        // lazyLoad:true,
        loop: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 1000,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        dragEndSpeed: 1000,
        dotsSpeed: 1000
    });


    /*----------------------------------------------------------------*/
    /*--------------------------- ITEM SLIDER ------------------------*/
    /*----------------------------------------------------------------*/

    $('.catalog-item-slider .owl-carousel').owlCarousel({
        navElement: 'div role="presentation"',
        items: 1,
        loop: true,
        dots: false,
        dragEndSpeed: 1000,
        dotsSpeed: 1000
    });

    $('.catalog-item-slider .owl-thumbs img').each(function () {
        var thumb = $(this);
        thumb.click(function () {
            thumb.parent().siblings('.owl-carousel').trigger('to.owl.carousel', [thumb.index(), 600, true]);
        });
    });


    /*----------------------------------------------------------------*/
    /*------------------------ ARTICLES CAROUSEL ---------------------*/
    /*----------------------------------------------------------------*/

    $('.articles-carousel.owl-carousel').owlCarousel({
        navElement: 'div role="presentation"',
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 3
            }
        },
       
        loop: true,
        nav: true,
        dots: false,
        margin: 30,
        dragEndSpeed: 1000
    });


    /*----------------------------------------------------------------*/
    /*------------------------ SIMILAR PRODUCTS CAROUSEL ---------------------*/
    /*----------------------------------------------------------------*/

    $('.products-carousel.owl-carousel').owlCarousel({
        navElement: 'div role="presentation"',
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 1
            },
            768: {
                items: 4
            }
        },
        loop: true,
        nav: true,
        dots: false,
        margin: 30,
        dragEndSpeed: 1000
        
    });

    $('.categories-products-carousel.owl-carousel').owlCarousel({
        navElement: 'div role="presentation"',
        responsive: {
            0: {
                items: 1.25
            },
            480: {
                items: 1.25
            },
            768: {
                items: 3.25
            }
        },
        loop: true,
        nav: true,
        dots: false,
        margin: 10,
        dragEndSpeed: 1000
    });

    $('.photos-carousel.owl-carousel').owlCarousel({
        navElement: 'div role="presentation"',
        responsive: {
            0: {
                items: 1.25
            },
            480: {
                items: 1.25
            },
            768: {
                items: 3.25
            }
        },
        loop: true,
        nav: false,
        dots: false,
        margin: 10,
        dragEndSpeed: 1000
    });

    $('.home-products-carousel.owl-carousel').owlCarousel({
        navElement: 'div role="presentation"',
        responsive: {
            0: {
                items: 2.25
            },
            480: {
                items: 2.25
            },
            768: {
                items: 6.25
            }
        },
        loop: false,
        nav: true,
        dots: false,
        margin: 10,
        dragEndSpeed: 1000
    });


    /*Client testimonials carousel*/
        $(".testimonials-slider.owl-carousel").owlCarousel({
            navElement: 'div role="presentation"',
            items: 1,
            loop: true,
            nav: true,
            margin: 10,
            navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
    });

    /*Keyword cloud carousel*/
    $(".buttons-slider.owl-carousel").owlCarousel({
        navElement: 'div role="presentation"',        
        lazyLoad: true,
        loop: true,
        nav: true,
        autoWidth: true,
        margin: 10,        
        slideBy: 4,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
    });

    /*----------------------------------------------------------------*/
    /*----------------------------- FILTER ---------------------------*/
    /*----------------------------------------------------------------*/

    $('li:not(.active) .filter-item-inner').slideUp(0);
    $('.filter h4').click(function () {
        $(this).siblings('.filter-item-inner').slideToggle(200);
        $(this).parent('li').toggleClass('active');
    });
});

$('.filter').slideUp(0);

$('.mobile-buttons .green').click(function () {
    $(this).parent().siblings('.filter').slideToggle(300);
    return false;
});



/*----------------------------------------------------------------*/
/*-------------------------- VENUES SLIDER -----------------------*/
/*----------------------------------------------------------------*/

    // not found
    $('.venues-slider.owl-carousel').owlCarousel({
        navElement: 'div role="presentation"',
        responsive: {
            0: {
                margin: 10
            },
            480: {
                margin: 10
            },
            768: {
                margin: 30
            }
        },
        loop: false,
        nav: false,
        dots: false,
        items: 3,
        mouseDrag: false,
        dragEndSpeed: 1000
});




/********************************************************************
*************************** EDIT 29.01.2018 *************************
*********************************************************************/


/*----------------------------------------------------------------*/
/* --------------   FUNCTION RESETS ALL FILTERS   ----------------*/
/*----------------------------------------------------------------*/
function resetFilter() {
    $('#filter-reset').on('click', function () {
        var items = $('.filter').find('input[type="checkbox"]');
        $(items).each(function (item) {
            if (items[item].checked === true) {
                $(items[item]).prop('checked', false);
            }
        });
    });
} resetFilter();

/*----------------------------------------------------------------*/
/* -----------   FUNCTION OPENED WINDOW GET E-BOOK   -------------*/
/*----------------------------------------------------------------*/
function popupGetEbook() {
    $('#getebook-window-close').on('click', function () {
        $('.popup-getebook').fadeOut();
    });
    if (popupsShouldThisPopupBeShownToThisUser('newsletter_signup_ebook')) {
        $('.popup-getebook').fadeIn().css('display', 'flex');
    }
}

$(document).ready(function () {
    if ($('.popup-getebook').length !== 0) {
        setTimeout(popupGetEbook, 20000);
    }
});

/*----------------------------------------------------------------*/
/* ----   FUNCTION SHOW POPUP WINDOW OF CLICK FILTER ITEM   ------*/
/*----------------------------------------------------------------*/
function popupWedding() {
    var items = $('.filter').find('input[type="checkbox"]');
    $(items).on('click', function () {
        if(popupsShouldThisPopupBeShownToThisUser('customize_wedding')) {
            $('#popup-wedding').fadeIn().css('display', 'flex');
        }
    });
    $('#wedding-window-close, .cancel').on('click', function (e) {
        e.preventDefault();
        $('#popup-wedding').fadeOut();
    });
} popupWedding();

/*----------------------------------------------------------------*/
/* ------------------   POPUP PHOTOS WINDOW   --------------------*/
/*----------------------------------------------------------------*/
function popupPhotos() {
    var popup = $('#popup-photos');
    var unselect = $('#block-photo-unselected')[0];
    var photos = $('.block-photo input[type=checkbox]');
    var btn_show_photos = $('#visual-search-show');
    var btn_close = $('#photos-window-close');
    var btn_cancel = $('.popup-photos-panel-buttons > .cancel');
    var btn_apply = $('.popup-photos-panel-buttons > .button');

    var popup_good_job = $('#popup-good-job');
    var good_job_cancel = $('#good-job-cancel');
    var good_job_again = $('#good-job-again');
    var good_job_get = $('#good-job-get');

    var result = [];

    btn_show_photos.on('click', function (e) {
        e.preventDefault();
        popup.fadeIn().css('display', 'flex');
    });

    photos.on('click', function () {
        if ($(unselect).prop('checked')) {
            return;
        } else {
            $(unselect).prop('checked', true);
        }
    });

    $(unselect).on('click', function () {
        if ($(unselect).prop('checked') === false) {
            $(photos).each(function (item) {
                $(photos[item]).prop('checked', false);
            });
        }
    });

    btn_close.on('click', function () {
        popup.fadeOut();
    });

    btn_cancel.on('click', function () {
        popup.fadeOut();
    });

    btn_apply.on('click', function (e) {
        e.preventDefault();
        $(photos).each(function (item) {
            if ($(photos[item]).prop('checked')) {
                result.push($(photos[item]));
            }
        });
        popup.hide();
        $(popup_good_job).css('display', 'flex');
        console.log(result);
    });
    good_job_cancel.on('click', function (e) {
        e.preventDefault();
        popup_good_job.fadeOut();
    });
    good_job_again.on('click', function (e) {
        e.preventDefault();

    });
    good_job_again.on('click', function (e) {
        e.preventDefault();

    });

} popupPhotos();

/*----------------------------------------------------------------*/
/* -------------------  SIDEBAR SLIDER INIT    -------------------*/
/*----------------------------------------------------------------*/

$(document).ready(function () {

    // TODO : not found using
    sidebarInitSliders($("#sidebarFeatured"));
    sidebarInitSliders($("#sidebarAdsSlider"));

    $(window).on('resize', function () {
        sidebarInitSliders($("#sidebarFeatured"));
        sidebarInitSliders($("#sidebarAdsSlider"));
    });

});

function sidebarInitSliders(block) {
    if ($(window).width() <= 991) {
        adsFlag = true;
        block.owlCarousel({
            navElement: 'div role="presentation"',
            items: 1,
            margin: 10,
            loop: true,
            nav: false,
            dots: false,
            responsiveClass: true,
            responsive: {
                640: {
                    items: 3
                },
                480: {
                    items: 2
                }
            }
        });
    }
    if ($(window).width() >= 992) {
        adsFlag = false;
        block.trigger('destroy.owl.carousel').css('display', 'block');
    }
}

/*----------------------------------------------------------------*/
/* ----------------  BACK TO TOP BUTTON (/photo-search) ----------*/
/*----------------------------------------------------------------*/
if ($('#back-to-top').length) {
    var scrollTrigger = 1000, // px
        backToTop = function () {
            var scrollTop = $(window).scrollTop();
            if (scrollTop > scrollTrigger) {
                $('#back-to-top').show().fadeIn(1000);
            } else {
                $('#back-to-top').fadeOut(1000).hide();
            }
        };
    backToTop();
    $(window).on('scroll', function () {
        backToTop();
    });
    $('#back-to-top').on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        }, 700);
    });
}
/**new mods for hero slider */
$(document).ready(function () {
    $('.home-slider').data('owl.carousel').options.nav = true;
    $('.home-slider').trigger('refresh.owl.carousel');

    $(".owl-prev").html('<div class="arrow arrow-left"></div>');
    $(".owl-next").html('<div class="arrow arrow-right"></div>');
});
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

/*active link when scroll
-----------------------------------------------*/
$(window).scroll(function () {
    var $sections = $('section');
    $sections.each(function (i, el) {
        var top = $(el).offset().top - 100;
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


/*Show active traffic on the site
-----------------------------------------------*/
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: '/Home/GetActiveVendorTrafficPopup',
        dataType: "JSON",
        success: function (data) {
            var RES_JSON = JSON.parse(data);
            var POPUP = $('[data-attr="ACTIVE_TRAFFIC"]');
            var POPUP_FLAG = POPUP.find('img');
            var POPUP_LINK = POPUP.find('[data-attr="VENDOR_LINK"]');
            var POPUP_TEXT = POPUP.find('.b-popup-text');
            var POPUP_SHOW_TIME = 5000;
            var POPUP_INTERVAL_TIME = randomInteger(10000, 30000);

            var i = 0;
            var timerId = setInterval(function () {
                var POPUP_MSG = `A user from <strong>${RES_JSON[i].sVisitorCity}</strong> viewed <strong>${RES_JSON[i].sVendorBusinessName}</strong>`;

                POPUP_INTERVAL_TIME = randomInteger(10000, 30000);

                POPUP.addClass('is-shown');
                POPUP_FLAG.attr('src', 'https://wvpreprod.blob.core.windows.net/preprod-live-public/theme/images/' + RES_JSON[i].sFlagIconFileName);
                POPUP_LINK.attr('href', RES_JSON[i].sVendorFullProfilePath);
                POPUP_TEXT.html(POPUP_MSG);

                i++;

                setTimeout(function () {
                    POPUP.removeClass('is-shown');
                }, POPUP_SHOW_TIME);

                if (i == RES_JSON.length) {
                    clearInterval(timerId);
                }
            }, POPUP_INTERVAL_TIME);
        }
    });
});

/** random number between min and max value*/
function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    console.log(rand);
    return rand;
}

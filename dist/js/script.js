$(function () {
    /**add arrows to home slider */
    $('.home-slider').data('owl.carousel').options.nav = true;
    $('.home-slider').trigger('refresh.owl.carousel');

    $(".owl-prev").html('<div class="arrow arrow-left"></div>');
    $(".owl-next").html('<div class="arrow arrow-right"></div>');

    /**search modal call */
    $('body').on('click', '.js-modal', function (event) {
        event.preventDefault();
        var modal = $(this).attr('data-target');
        $('[data-id="' + modal + '"').fadeIn();
    });
    $(document).click(function (e) {
        if ($('.modal-search').is(e.target) || $('.modal-search__close').is(e.target)) {
            $('.modal-search').fadeOut();
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
}); 
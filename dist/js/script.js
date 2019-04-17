$(function () {
    /**add arrows to home slider */
    $('.home-slider').data('owl.carousel').options.nav = true;
    $('.home-slider').trigger('refresh.owl.carousel');
    
    $(".owl-prev").html('<div class="arrow arrow-left"></div>');
    $(".owl-next").html('<div class="arrow arrow-right"></div>');
}); 
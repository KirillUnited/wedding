/** 
 * vendor site
*/
$(function () {
    $('body').on('change focus', '.has-label-animation', function () {
        var inp = $(this);

        inp.val() != "" ? inp.addClass('is-filled') : inp.removeClass('is-filled');
    });

    $.each($('.has-label-animation'), function (indexInArray, valueOfElement) {
        $(valueOfElement).trigger("change");
    });
});
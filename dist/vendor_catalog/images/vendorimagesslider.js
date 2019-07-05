
$(function () {
    //init main slider
    $('.vendor-slider').owlCarousel(
        {
            navContainerClass: 'vendor-slider__owl-nav',
            navElement: 'div role="presentation"',
            loop: false,
            nav: true,
            dots: false,
            dragEndSpeed: 1000,
            center: true,
            autoWidth: true,
            items: 1
        }).on('translated.owl.carousel', function (event) {
            //ajax loading
            if (event.item.index >= event.item.count - 2) {
                var vendorId = $('.vendor-slider').data('vendor');
                var imageIndex = event.item.count;
                //get next image
                $.getJSON('/vendor-image/' + vendorId + '/' + imageIndex, function (data) {
                    //if ok
                    if (data.Success) {
                        //hero image
                        var image = new Image();
                        image.src = data.heroImage;
                        image.alt = data.heroAltText;
                        //waiting for loading
                        image.onload = function () {
                            //insert new image
                            $('.vendor-slider').owlCarousel().trigger('add.owl.carousel', [image]);
                            $('.vendor-slider').owlCarousel().trigger('refresh.owl.carousel');
                        };
                        //thumbs
                        var thumb = new Image();
                        thumb.src = data.thumbsImage;
                        thumb.alt = data.thumbsAltText;
                        thumb.className = 'thumbnail-image';
                        //waiting for loading
                        thumb.onload = function () {
                            $('.vendor-thumbs').owlCarousel().trigger('add.owl.carousel', [thumb]);
                            $('.vendor-thumbs').owlCarousel().trigger('refresh.owl.carousel');
                        };
                    }
                });
            }
        });

    //init thumbs slider
    $('.vendor-thumbs').owlCarousel(
        {
            navElement: 'div role="presentation"',
            responsive: {
                0: {
                    items: 3
                },
                480: {
                    items: 4
                },
                768: {
                    items: 5
                }
            },
            loop: false,
            nav: false,
            dots: false,
            dragEndSpeed: 1000
        });

    //add thumb click event
    $('body').delegate('.thumbnail-image', 'click', function () {
        var index = $('.vendor-thumbs img').index(this);
        $('.vendor-slider').owlCarousel().trigger('to.owl.carousel', [index, 300]);
    });
});
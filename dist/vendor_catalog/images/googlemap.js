var mapIsOpen = false;
var loadedMap = false;
var key_path = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCPx8rTxqy9TKtmkfD2PPn39w5aLDSvqqo";
var map;
var infoWindows = [];
var markers = [];

//get vendors GPS and create the map
function GetMap() {
    if (!loadedMap) {
        //get google maps scripts
        $.getScript(key_path, function () {
            var marketLat = $("#map-show-btn").data("market-lat");
            var marketLon = $("#map-show-btn").data("market-lon");
            var categoryId = $("#map-show-btn").data("category-id");

            //get vendors data
            $.getJSON('/vendors/gps/' + marketLat + "/" + marketLon + '/' + categoryId, function (data) {
                loadedMap = true;//map is loaded
                if (data.Success) {
                    //initialize the map
                    map = new google.maps.Map(document.getElementById('google-map'), {
                        center: { lat: data.MarketLat, lng: data.MarketLong },
                        zoom: 9,
                        mapTypeId: 'roadmap',
                        animation: google.maps.Animation.DROP
                    });

                    //for each vendor
                    for (var i = 0; i < data.Positions.length; i++) {
                        var item = data.Positions[i];
                        //set content string
                        var contentString = '<div class="map-card" data-item="card-' + i + '" onclick="ShowCard(this)">' + 
                            '<div class="flexSS flex-no-wrap"><img class="map-photo" src="'
                            + item.Image + '"/><div class = "flexCol"><div class="map-name">' + item.Name + '</div>' +
                            '<div class="map-phone">' + item.Phone + '</div>' + '<div class="map-mail">' + item.Email + '</div>' +
                            '<div class = "map-address">' + (item.Address === null ? '' : item.Address) + '</div>' + '</div></div></div>';

                        $('#cards').append(contentString);
                        $('#cards-list').append(contentString);


                        //initialize the info window
                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });
                        //initialize map marker
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(item.Lat, item.Long),
                            icon: item.IsPaidMembership ? '/images/premium.marker.png' : '/images/gray.marker.png',
                            title: item.Name,
                            map: map,
                            content: contentString
                        });

                        //add marker event
                        marker.addListener('click', function () {
                            infowindow.setContent(this.content);
                            infowindow.open(map, this);
                        });

                        //store info window and markers for paid vendors
                        if (item.IsPaidMembership) {
                            infoWindows.push(infowindow);
                            markers.push(marker);
                        }
                    }

                    $('#cards').owlCarousel({
                        items: 2,
                        loop: true,
                        dots: false,
                        nav: false,
                        center: true,
                        margin: 10,
                        autoWidth: true,
                        dragEndSpeed: 1000
                    });
                }
            });
        });
    }
}

//toggle map window
function ToggleGoogleMap() {
    if (mapIsOpen) {
        $('.map-container').slideUp(300);
        $('#map-show-btn').html('Show on a map  <i class="fa fa-angle-double-right"></i>');
        $('#mobile-map-show-btn').html('<span>Expand map view</span><i class="fa fa-angle-double-down"></i>');
        mapIsOpen = false;
    }
    else {
        //if paid vendors exist
        if (markers.length > 0) {
            for (var i = 0; i < markers.length; i++) {
                //show for first three vendors
                if (i === 3)
                    break;
                //open by default
                infoWindows[i].open(map, markers[i]);
            }
        }
        $('.map-container').slideDown(300);
        $('#map-show-btn').html('Hide map  <i class="fa fa-angle-double-right"></i>');
        $('#mobile-map-show-btn').html('<span>Hide map view</span><i class="fa fa-angle-double-up"></i>');
        mapIsOpen = true;
    }
}

//show map
function OpenMap() {
    GetMap();
    $('#google-map').css('bottom', 0);
}

//hide map
function HideMap() {
    $('#google-map').css('bottom', '-100%');
}

//show map card of selected vendor
function ShowCard(elem) {
        //console.log($(elem).data('item')); TODO
}

$(function () {
    //add scroll check for filters / map buttons appear
    $(window).scroll(function () {
        var pageTop = $('.pageTop').offset().top,
            pageTopHeight = $('.pageTop').outerHeight(),
            pageBottom = $('.pageBottom').offset().top,
            bageBottomHeight = $('.pageBottom').outerHeight(),
            windowHeight = $(window).height(),
            windowScroll = $(this).scrollTop();
        if (windowScroll > pageTop + pageTopHeight && windowScroll < pageBottom + bageBottomHeight - windowHeight) {
            if (!$('.filters-block').hasClass('visible-flex')) {
                $('.filters-block').toggleClass('visible-flex');
            }
        } else {
            if ($('.filters-block').hasClass('visible-flex')) {
                $('.filters-block').toggleClass('visible-flex');
            }
        }
    });

    $('#map-show-btn').bind('click', function (e) {
        e.preventDefault();
        OpenFiltersMap(true);
    });
});
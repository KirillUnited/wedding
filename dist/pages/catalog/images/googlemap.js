var mapIsOpen = false;
var loadedMap = false;
var key_path = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCPx8rTxqy9TKtmkfD2PPn39w5aLDSvqqo";
var map;
var infoWindows = [];
var markers = [];
var isMobile = false;

//get vendors GPS and create the map
function GetMap() {
    if (!loadedMap) {
        //get google maps scripts
        $.getScript(key_path, function () {
            if (loadedMap)
                return;
            loadedMap = true;
            GetVendorsData(window.location.search);
        });
    }
}

function GetVendorsData(query) {
    var marketLat = $("#map-show-btn").data("market-lat");
    var marketLon = $("#map-show-btn").data("market-lon");
    var categoryId = $("#map-show-btn").data("category-id");
    isMobile = $(document).width() <= 600;

    //get vendors data
    $.getJSON('/vendors/gps/' + marketLat + "/" + marketLon + '/' + categoryId + query, function (data) {
        if (!loadedMap) return;//map is loaded
        if (data.Success) {
            infoWindows = [];
            markers = [];
            //initialize the map
            map = new google.maps.Map(document.getElementById('google-map'), {
                center: { lat: data.MarketLat, lng: data.MarketLong },
                zoom: 9,
                mapTypeId: 'roadmap',
                animation: google.maps.Animation.DROP
            });

            $('#cards').remove();
            $('<div id="cards" class="owl-carousel"></div>').insertAfter($("#google-map"));
            $('#cards-list').html("");
            //for each vendor
            for (var i = 0; i < data.Positions.length; i++) {
                var item = data.Positions[i];
                //vendor rating view
                var ratingString = '';
                if (item.Rating.Key > 0) {
                    var rating = Math.round(item.Rating.Key);
                    ratingString = '<div class="map-rating"><div class="rating-widget"><div class="rating-stars"><ul class="stars">';
                    for (var s = 1; s <= 5; s++) {
                        ratingString += `<li class="star ${(rating >= s ? " selected" : "")}" data-value="${s}">
                                    <i class="fa fa-star"></i></li>`;
                    }
                    ratingString += '</ul></div></div><span class="text-muted">(' + item.Rating.Value + ')</span></div>';
                }

                //set content string
                var contentString = '<div class="map-card" data-item="card-' + i + '" data-premium="' + item.IsPaidMembership + '">' +
                    '<div class="card-info flexSS flex-no-wrap" onclick="ShowCard(' + i + ')"><img class="map-photo" src="'
                    + item.Image + '"/><div class = "flexCol">' + (item.IsFeatured ? '<div class="featured-label">featured</div>' : '') +
                    '<div class="map-name">' + item.Name + '</div>' + ratingString + '<div class="map-address">' + (item.Address === null ? '' : item.Address + ", " + item.City)
                    + '</div></div></div><div class="map-more"><a target="_blank" href="' + item.VendorUrl + '">MORE</div></div>';

                $('#cards').append(contentString);
                $('#cards-list').append(contentString);


                //initialize the info window
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                //initialize map marker
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(item.Lat, item.Long),
                    icon: item.IsPaidMembership ? '/images/map.marker.premium.png' : '/images/map.marker.white.png',
                    title: item.Name,
                    map: map,
                    content: contentString
                });

                //add marker event

                marker.addListener('click', function () {
                    for (var i in infoWindows) {
                        var cardInd = parseInt($(infoWindows[i].content).data("item").replace("card-", ""));
                        var isPaidMembership = $(infoWindows[i].content).data("premium");
                        markers[cardInd].setIcon(isPaidMembership ? '/images/map.marker.premium.png' : '/images/map.marker.white.png');
                    }
                    this.setIcon('/images/map.marker.active.png');
                    if (!isMobile) {
                        infowindow.setContent(this.content);
                        infowindow.open(map, this);
                    } else {
                        var currentInd = parseInt($(this.content).data("item").replace("card-", ""));
                        $('#cards').trigger('to.owl.carousel', [currentInd, 1000, true]);
                    }
                });
                if (!isMobile) {
                    infowindow.addListener('closeclick', function () {
                        var cardInd = parseInt($(this.content).data("item").replace("card-", ""));
                        var isPaidMembership = $(this.content).data("premium");
                        markers[cardInd].setIcon(isPaidMembership ? '/images/map.marker.premium.png' : '/images/map.marker.white.png');
                    });
                }

                infoWindows.push(infowindow);
                markers.push(marker);
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
}

function ApplyMapFilter(form) {
        GetVendorsData(addFilterQueryString(form));
        HideFilters(isMobile);
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

//show map card of selected vendor
function ShowCard(currentCardInd) {
    for (var i = 0; i < infoWindows.length; i++) {
        var cardInd = parseInt($(infoWindows[i].content).data("item").replace("card-", ""));
        var isPaidMembership = $(infoWindows[i].content).data("premium");
        if (i === currentCardInd)
            continue;
        markers[cardInd].setIcon(isPaidMembership ? '/images/map.marker.premium.png' : '/images/map.marker.white.png');
        if (!isMobile) {
            infoWindows[i].close(map);
        }
    }
    markers[currentCardInd].setIcon('/images/map.marker.active.png');
    if (!isMobile) {
        infoWindows[currentCardInd].open(map, markers[currentCardInd]);
    }
}

$(function () {
    GetMap();
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
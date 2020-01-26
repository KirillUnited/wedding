
//for track analytics
var AJAX_PATH = "/ajax/html.aspx";
//used to know if user on the checklist page
var isChecklist = false;

var marketUrl = getCookieGlobal("marketUrl");
var fullCityState = getCookieGlobal("fullCityState");

/*----------------------------------------------------------------*/
/*--------------------------- GEO-SELECTORS ----------------------*/
/*----------------------------------------------------------------*/

$(document).ready(function () {

    if (marketUrl === null || fullCityState === null) {
        $(".use-location-icon").attr("style", "visibility:visible;");
        $(".use-location-icon").on("click", function () {
            GetUserLocation();
        });
        $("ul.vendor-categories li a").on("click",function (e) {
            e.preventDefault();
            $("#locationPopup .b-menu-dropdown-location").attr("data-link", $(e.target).attr('href'));
            $("#locationPopup").modal("show");
        });
        $(".use-location-btn").click(function (e) {
            GetUserLocation();
            $("#locationPopup").modal("hide");
        });
    } else
        UpdateMarketStrings(fullCityState, marketUrl);

    function GetUserLocation() {
        if (navigator.geolocation) {
            var options = { timeout: 60000 };  // timeout at 60000 milliseconds (60 seconds)
            navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
        }
        else {
            $.ajax({
                type: "get",
                url: "/Home/GetCurrentUserClosestMarketUrl",
                success: function (result) {
                    if (result.fullCityState !== undefined && result.marketUrl !== undefined) {
                        setCookieGlobalPerpetual("marketUrl", result.marketUrl);
                        setCookieGlobalPerpetual("fullCityState", result.fullCityState);
                        UpdateMarketStrings(result.fullCityState, result.marketUrl);
                    }
                }
            });
        }
    }

    function showLocation(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        $.ajax({
            type: "get",
            url: "/Home/GetCurrentUserClosestMarketUrlFromGpsCoords",
            data: {
                lat: latitude,
                lon: longitude
            },
            dataType: "json",
            success: function (result) {
                if (result.fullCityState != undefined && result.marketUrl != undefined) {
                    setCookieGlobalPerpetual("marketUrl", result.marketUrl);
                    setCookieGlobalPerpetual("fullCityState", result.fullCityState);
                    setCookieGlobalPerpetual("gps", latitude + "|" + longitude);
                    UpdateMarketStrings(result.fullCityState, result.marketUrl);
                }
            }
        });
    }

    function errorHandler(err) {
        $.ajax({
            type: "get",
            url: "/Home/GetCurrentUserClosestMarketUrl",
            success: function (result) {
                if (result.fullCityState != undefined && result.marketUrl != undefined) {
                    setCookieGlobalPerpetual("marketUrl", result.marketUrl);
                    setCookieGlobalPerpetual("fullCityState", result.fullCityState);
                    UpdateMarketStrings(result.fullCityState, result.marketUrl);

                }
            }
        });
    }

   

    /**
    * VENDOR DETAILS
    */
    if ($(".vendor-details-accordion") != null) {
        var interview = $(".vendor-details-accordion");
        var question = interview.find("h2:not(:first)");
        var arr = [];

        $(question).each(function (indx, element) {
            var answerArr = $(element).nextUntil("h2");
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
    var vendorThumbsSlider = $('.vendor-thumbs.owl-carousel');
    if (vendorThumbsSlider.length > 0) {
        vendorThumbsSlider.each(function () {
            var data = $(this).data();
            var options = {
                margin: 10,
                items: 5,
                responsive: {
                    0: {
                        items: 3
                    },
                    768: {
                        items: 5
                    }
                }
            }
            $(this).owlCarousel($.extend(options, data));
        });
    }

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

});

/*----------------------------------------------------------------*/
/* --------------   VENDOR DETAILS  ------------------------------*/
/*----------------------------------------------------------------*/
$(function () {
    $('body').on('click', '.vendor-gallery .js-ajax-more', function (e) {
        e.preventDefault();
        var showItemContainer = $("#vendorGallery");
        var targetItem = $(".vendor-gallery-item");
        var ajaxUrl = "/vendors/seattle/photographers/artsy-daria-photography";
        var numOfShowItem = 8;

        $.ajax({
            type: "GET",
            url: ajaxUrl,
            dataType: "html",
            success: function (res) {
                var item = $(res).find(targetItem);
                $.each(item, function (i, val) {
                    if (targetItem.length - 1 < i && i < targetItem.length + numOfShowItem) {
                        $(this).appendTo(showItemContainer);
                    }
                });
            }
        });
    });    

    /** popover toggle */
    $('body').on('click', '[data-toggle="popover"]', function (e) {
        if ($(window).width() >= 768) {
            popover(null, 'show', e);
        }
    });

    $(document).click(function (e) {
        popover(null, 'hide', e);
    });

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

});


/*----------------------------------------------------------------*/
/* --------------   COOKIES  -------------------------------------*/
/*----------------------------------------------------------------*/
var COOKIE_NAME_PREFIX_FOR_POPUP_CAMPAIGNS = "campaign_";
var COOKIE_VALUE_POPUP_CAMPAIGN_DONOTSHOW = "do-not-show";

// set
function setCookieGlobal(nameVV, valueVV, secondsVV) {
    var expiresVV = "";
    if (typeof (secondsVV) !== 'undefined') {
        var dateVV = new Date();
        dateVV.setTime(dateVV.getTime() + (secondsVV * 1000));
        expiresVV = "; expires=" + dateVV.toGMTString();
    }

    document.cookie = nameVV + "=" + valueVV + expiresVV + "; path=/";
}
function setCookieGlobalPerpetual(nameVV, valueVV) {
    setCookieGlobal(nameVV, valueVV, 31557600 * 2); // two years
}

// get
function getCookieGlobal(nameAA) {
    nameAA = nameAA + "=";
    var carrayAA = document.cookie.split(';');

    for (var i = 0; i < carrayAA.length; i++) {
        var cAA = carrayAA[i];
        while (cAA.charAt(0) === ' ') cAA = cAA.substring(1, cAA.length);
        if (cAA.indexOf(nameAA) === 0) return cAA.substring(nameAA.length, cAA.length);
    }

    return null;
}

// delete
function deleteCookieGlobal(nameBB) {
    setCookieGlobal(nameBB, "", -1);
}

/*----------------------------------------------------------------*/
/* ------------   EMAIL SIGNUP ELEMENTS  -------------*/
/*----------------------------------------------------------------*/
//$(document).ready(function () {
//    if (!popupsShouldThisPopupBeShownToThisUser('newsletter_signup_homepage') && popupsShouldThisPopupBeShownToThisUser('confirm_newsletter_signup')) {
//        $('.popup-confirmation').fadeIn().css('display', 'flex');
//        popupsDoNotShowSpecificPopupAnymore('confirm_newsletter_signup');
//    }

//    $("#modal-close").click(function () {
//        $('.popup-confirmation').fadeOut();
//    });

//    $("#modal-ok").click(function () {
//        $('.popup-confirmation').fadeOut();
//    });

//    if (!popupsShouldThisPopupBeShownToThisUser('newsletter_signup_homepage')) {
//        $('.getstarted').hide();
//    }
//});

/*----------------------------------------------------------------*/
/* ------------   VISITOR TRACKING AND VENDOR STATS  -------------*/
/*----------------------------------------------------------------*/
function recordGoogleAnalyticsEvent(paramEventCategory, paramEventAction, paramEventLabel, paramEventIntegerValue) {
    //ga('send', 'event', 'Contact', 'Phone', 'Click');
    //ga('send', {
    //    hitType: 'event',
    //    eventCategory: paramEventCategory,   // 'videos'
    //    eventAction: paramEventAction,       // 'play'
    //    eventLabel: paramEventLabel,         // 'fall campaign', optional
    //    eventValue: paramEventIntegerValue,   // 55, optional
    //    transport: 'beacon'
    //});

    // mark the debug events as such
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        if (paramEventCategory != null && paramEventCategory.length > 0)
            paramEventCategory = "DEBUG: " + paramEventCategory;

        if (paramEventAction != null && paramEventAction.length > 0)
            paramEventAction = "DEBUG: " + paramEventAction;

        if (paramEventLabel != null && paramEventLabel.length > 0)
            paramEventLabel = "DEBUG: " + paramEventLabel;

        if (paramEventIntegerValue != null && paramEventIntegerValue.length > 0)
            paramEventIntegerValue = "DEBUG: " + paramEventIntegerValue;
    }

    ga('send', 'event', paramEventCategory, paramEventAction, paramEventLabel, paramEventIntegerValue);
}

function track(paramBeaconEvent, paramEventLabel) {
    recordGoogleAnalyticsEvent("Page action", paramBeaconEvent, paramEventLabel);
}

$(document).ready(function () {

    /* This is one of the pages we want to track -- log a visit if there is a special marker <div> on the page */
    if ($("#numVisitorsRegion").length) {
        var ajaxPath = $("#numVisitorsRegion").data("ajax-path");
        var ajaxAction = $("#numVisitorsRegion").data("ajax-action");

        var paramVisitTargetUID = $("#numVisitorsRegion").data("page-uid");
        var paramVisitTargetType = $("#numVisitorsRegion").data("page-type");

        $.ajax({
            type: "GET",
            url: ajaxPath,
            data: "action=" + ajaxAction + "&" +
                "paramChar=" + paramVisitTargetType + "&" +
                "id=" + paramVisitTargetUID,
            dataType: 'html',
            success: function (receivedJs) {
                if (receivedJs.length > 10) {
                    $("#numVisitorsRegion").html("<div class='space'></div><!--<h2>Visitor statistics</h2>--><canvas id='chart-visitors'></canvas>");
                    eval(receivedJs);
                }
            }
        });
    }
    $("#vendorWebsite").click(recordAnalyticsClick);
    $("#vendorFacebook").click(recordAnalyticsClick);
    $("#vendorInstagram").click(recordAnalyticsClick);
    $("#vendorTwitter").click(recordAnalyticsClick);

    $("#vendorPhone").click(recordAnalyticsClick);
    $("#vendorPhoneNumber").click(recordAnalyticsClick);

    $("#vendorEmail").click(recordAnalyticsClick);
    $("#vendorEmailAddress").click(recordAnalyticsClick);

    $("#homepagefeaturedVendorBtnId").click(recordABTestResultsClick);
});

function recordABTestResultsClick() {  
    var ajaxPath = $(this).data("ajax-path");
    var ajaxAction = $(this).data("ajax-action");
    var paramABTestName = $(this).data("ajax-abtest-name");

    $.ajax({
        type: "POST",
        url: AJAX_PATH,
       data: "action=" + ajaxAction + "&" +            
             "string2=" + paramABTestName,
        dataType: 'html',
        success: function () {
        }
    });
}

function recordAnalyticsClick() {
    var dataVendorID = $(this).data("vendor-id");
    var dataVendorName = $(this).data("vendor-name");
    var dataVendorContactElementValue = $(this).data("value");   

    var ajaxPath = $(this).data("ajax-path");
    var ajaxAction = $(this).data("ajax-action");    
    var paramString = $(this).data("ajax-action_type");

    var tapType = 'Vendor Profile action type: ' + paramString;

    recordGoogleAnalyticsEvent(tapType, dataVendorName, dataVendorContactElementValue, dataVendorID);
    

    var paramABTestName = $(this).data("abtest-name");

    $.ajax({
        type: "POST",
        url: AJAX_PATH,
        data: "action=" + ajaxAction + "&" +
            "string=" + paramString + "&" +
            "string2=" + paramABTestName + "&" +
            "id=" + dataVendorID,
        dataType: 'html',
        success: function () {
        }
    });
}
/*----------------------------------------------------------------*/
/* ------------   SEARCH  ----------------------------------------*/
/*----------------------------------------------------------------*/
$(document).ready(function () {
    // when search page loads, put a query into search fields
    var q = getQueryStringParams()["q"];
    if (window.location.href.indexOf("/search?q") >= 0) {
        q = q.replace(/\+/g, '%20');
        q = decodeURIComponent(q);
        $(".sitesearch-submittable-form input").val(q);
    }

    // search box - either global nav or on the search page
    $(".sitesearch-submittable-form").submit(function (event) {
        var searchField = $(this).children("input");
        var searchQuery = searchField.val();

        if (searchQuery.length >= 3) {
            $(this).removeClass("search-box-error");
            recordGoogleAnalyticsEvent("site search", "searchterm=" + searchQuery);  // log search within UI
            $(this).submit();
        }
        else {
            $(this).addClass("search-box-error");
            event.preventDefault();
        }
    });

});

/*----------------------------------------------------------------*/
/* --------------   VISUAL SEARCH  -------------------------------*/
/*----------------------------------------------------------------*/
// ease in all cards
$(".love-image").fadeIn(1000);

// Heart behavior for when user likes an image
var numVisualSearchImagesLiked = 0;
$('.love-image .heart').on('click', function () {      // $(this) contains span,   var icon will contain the heart icon itself
    $(this).children('i').toggleClass("fa-heart fa-heart-o");  // toggle the heart fill/outline\
    $(this).toggleClass("heart-invisible heart-visible");

    numVisualSearchImagesLiked++;
    if (numVisualSearchImagesLiked === 3 && popupsShouldThisPopupBeShownToThisUser('customize_wedding')) {
        // show Save to your profile popup after 3 liked photos
        $('#popup-wedding').fadeIn().css('display', 'flex');
    }
});

// Read a page's GET URL variables and return them as an associative array. Use:  var name2 = getQueryStringParams()["name2"];  or  var me = getQueryStringParams()["me"];
function getQueryStringParams() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

/*----------------------------------------------------------------*/
/* ------------   INTERSTITIALS AND EMAIL POPUPS  ----------------*/
/*----------------------------------------------------------------*/
// the user has seen this campaign - do not show it to them again
function popupsDoNotShowSpecificPopupAnymore(campaignName) {
    setCookieGlobalPerpetual(COOKIE_NAME_PREFIX_FOR_POPUP_CAMPAIGNS + campaignName, COOKIE_VALUE_POPUP_CAMPAIGN_DONOTSHOW);
}

// should we show this popup campaign to this user, or did they dismiss it already?
function popupsShouldThisPopupBeShownToThisUser(campaignName) {
    var cookieVal = getCookieGlobal(COOKIE_NAME_PREFIX_FOR_POPUP_CAMPAIGNS + campaignName);
    if (cookieVal === null)
        return true;

    return false;
}

// reset the campaign for the user
function popupsShowSpecificPopupAgain(campaignName) {
    deleteCookieGlobal(COOKIE_NAME_PREFIX_FOR_POPUP_CAMPAIGNS + campaignName);
}

//send filter
function SendFilter(form) {
    var action = $(form).attr('action');
    action += addFilterQueryString(form);
    $(form).attr('action', action).submit();
}

//add filter to query string
function addFilterQueryString(form) {
    var queryArray = [];
    var query = "?";
    $(form).find('input:checked').each(function (ind, el) {
        var group = $(el).attr("name");
        var property = $(el).data("urlname");
        if (!queryArray[group])
            queryArray[group] = property;
        else queryArray[group] += "," + property;
    });
    for (var key in queryArray) {
        if (query !== "?")
            query += "&";
        query += key + "=" + queryArray[key];
    }
    if (query === "?")
        query = "";
    return query;
}

/*-----------------------Rating stars functionality-------------------------------*/
$(document).ready(function () {

    /* 1. Visualizing things on Hover - See next part for action on click */
    $('.stars li').on('mouseover', function () {
        var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

        // Now highlight all the stars that's not after the current hovered star
        $(this).parent().children('li.star').each(function (e) {
            if (e < onStar) {
                $(this).addClass('hover');
            }
            else {
                $(this).removeClass('hover');
            }
        });

    }).on('mouseout', function () {
        $(this).parent().children('li.star').each(function (e) {
            $(this).removeClass('hover');
        });
    });


    /* 2. Action to perform on click */
    $('.control .stars li').on('click', function () {
        var onStar = parseInt($(this).data('value'), 10); // The star currently selected
        var stars = $(this).parent().children('li.star');

        for (i = 0; i < stars.length; i++) {
            $(stars[i]).removeClass('selected');
        }

        for (i = 0; i < onStar; i++) {
            $(stars[i]).addClass('selected');
        }
        var ratingInput = $(this).parents('.rating-stars').find('input[type="hidden"]');
        $(ratingInput).val(onStar);

        //add info alert if user set rating 1 or 2
        if ($(ratingInput).attr("name") === "OverallExperience") {
            if (onStar <= 2 && $('#info-experience').length === 0)
                $(".row.rating").after("<div class='alert alert-info' id='info-experience' role='alert'>\
                <b>Looks like you had a negative experience with this vendor.</b> As the best practice, we encourage you to \
                contact them directly to give them a chance to resolve your concern prior to you \
                submitting a review. Either way, we encourage you to submit a review below.\
                </div>");
            else if (onStar > 2)
                $('#info-experience').remove();
        }

    });

    $("a.go-back").click(function () {
        if (window.history.length > 1)
            window.history.back();
        else window.location.href = "/";
    });

    /*---------------------------------Calendar initializing ----------------------*/

    $('.col-datepicker').datetimepicker({ format: 'MM/DD/YYYY' });
    $('.col-datepicker-month').datetimepicker({ format: 'MMMM DD, YYYY' });
});





/*------------------------------Review useful functionality----------------*/
$(function () {
    $('span.useful').click(function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: '/vendor-reviews/rate-post?reviewId=' + $(e.target).data('reviewId') + '&vote=' + $(e.target).data('command'),
            dataType: 'json',
            success: function (data) {
                $(e.target).parents('.comment-meta').html('<span>Thank you for your feedback!</span>');
            }
        });
    });
});

/*
 Modal Dialogs functionality
*/
$(function () {
    $('.modal.immediately-show').modal('show');
});

/*Al page*/
$(function () {
    $("#al-form").on("submit", function (e) {
        if ($(e.target).valid()) {
            e.preventDefault();
            if ($("#ZipCode").val() === "" || ($("#City").val() === "" && $("#State").val() === ""))
                $(".text-danger").html("<ul><li>Enter zip code or state and city, please!</li></ul>");
            else {
                var userLocation = $("#ZipCode").val();
                if (userLocation === "")
                    userLocation = $("#City").val() + ", " + $("#State").val();

                location.href = "/users/checklist?location=" + userLocation + "&weddingdate=" + $("#WeddingDate").val();
            }
        }
    });
});
/*-----------------------------------Wedding Store---------------------------------------------------*/
/*Shipping Address Form Customize Placeholder*/
$(function () {

    $('.form-required-placeholder input, .form-required-placeholder select').on('focus', function (e) {
        $(this).siblings('span.required').hide();
    });
    $('.form-required-placeholder input, .form-required-placeholder select').on('focusout', function (e) {
        if ($(this).val()) return;
        $(this).siblings('span.required').show();
    });
});

/*Add shipping Address dialog*/
$(function () {
    $("#addAnotherAddress").click(function () {
        $("#addAddressDialog").modal("show");
    });

    $("#addAnotherCard").click(function () {
        $("#addCardDialog").modal("show");
    });
});

/*Remove user address*/
$(function () {
    $(".remove-address").click(function (e) {
        if (!confirm("Are you sure you want to permanently delete this address?"))
            return;
        var addressId = $(e.target).attr("address-id");
        if (!addressId)
            return;
        $.ajax({
            type: "POST",
            url: "/store/remove-address?addressId=" + addressId,
            dataType: 'json',
            success: function (data) {
                if (data.Result)
                    $(e.target).parent("p").remove();
                else
                    $(".text-danger ul").html("<li>An error occurred during the address deleting. Please refresh the page and try again. If the issues persist, contact us at vendors@weddingventure.com</li>");
            }
        });
    });
});
/*Track product click*/
$(function () {
    $(".store-product-link").click(function (el) {
        el.stopPropagation();
        var element = el.target;
        if (!$(el.target).is(".store-product-link"))
            element = $(el.target).parents(".store-product-link");
        var source = $(element).data("source");
        var productId = $(element).data("product-id");
        recordGoogleAnalyticsEvent(source, "Store Product Link Internal", productId);
    });
});

//------------------------------------------------------Mobile top nav menu

//show mobile menu
function ShowMenu() {
    $('.mobile-menu').css('left', 0);
    $('.mobile-menu-overlay').show();
}

//hide mobile menu
function HideMenu() {
    $('.mobile-menu').css('left', '-100%');
    $('.mobile-menu-overlay').hide();
}

//show dropdown menu
function ShowDropDown(elem, event) {
    if (!$(event.target).is('a')) {
        $(elem).find('.arrow').toggleClass('open');
        //$(elem).find('.menu-dropdown-menu').animate({ height: ['toggle', 'swing'] }, 200);
        $(elem).find('.menu-dropdown-menu').slideToggle(200);
    }
}

//show search top nav field on mobile
function ShowSearch() {
    $('.mobile-search-form').toggle();
}

var prevSubMobileMenu = null;//need to keep previous selected sub menu item
//Show sub-menu
function ShowSubMobileMenu(elem) {
    $('.item-active').removeClass('item-active');
    $(elem).addClass('item-active');
    FindSubMenu(elem);
}

//find correct sub menu and show it
function FindSubMenu(elem) {
    //hide and destroy previous sub menu carousel
    if (prevSubMobileMenu !== null) {
        prevSubMobileMenu.trigger('destroy.owl.carousel').removeClass('visible-xs').hide();
    }
    var menuId = $(elem).data('submenu');
    var subMenu = $('#' + menuId);
    $(subMenu).owlCarousel({
        loop: false,
        dots: false,
        autoplay: false,
        dragEndSpeed: 1000,
        nav: false,
        autoWidth: true
    }).addClass('visible-xs').show();
    prevSubMobileMenu = subMenu;
}

//-----------------------------------------------------------broadcast messages

//on success broadcast sending
function OnSendBroadcastSuccess(data) {
    if (data.Success) {
        $('#createAccountLoading').hide();
        $('#broadcast-message').modal('hide');
        $('#broadcast-message-form .text-error').text('');
        setTimeout(function () {
            $('#successMessageText .alert').text('Your message has been successfully sent. We will'
                + ' notify you within 24 - 48 hours by email if any of the vendors in our directory are available and can meet your'
                + ' budget constraints.');
            $('#successMessageText').modal('show');
        }, 600);
    }
    else {
        OnSendBroadcastError();
    }
}

//on failure broadcast sending
function OnSendBroadcastError() {
    var messageText = 'An error occurred while saving your message. Please refresh the page and try again. If the issues persist, contact us at vendors@weddingventure.com';
    $('#createAccountLoading').hide();
    $('#broadcast-message-form .text-error').text(messageText);
}

//------------------------------------------------------mobile map-filters window
var filtersIsOpen = false;
//show map-filters window
function OpenFiltersMap(flag) {
    //if map
    if (flag) {
        ShowMap();
        $('.filter-reset').unbind('click');
        $('.filter-reset').bind('click', function (event) {
            event.preventDefault();
            $('#mobile-filter-form input:checked').prop('checked', false);
            ApplyMapFilter($('#mobile-filter-form'));
        });
        $('#mobile-apply-filter').unbind('click');
        $('#mobile-apply-filter').bind('click', function () {
            ApplyMapFilter($('#mobile-filter-form'));
        });
    }
    //if filters
    else {
        ShowFilters(true);
        filtersIsOpen = true;
    }
    $('#filters-map').css('bottom', 0);
}

//toggle to map
function ShowMap() {
    $('.filter').hide();
    $('#filters').removeAttr('style');
    $('#sm-off-button').hide();
    $('#sm-on-button').removeAttr('style');
    $('#filters-footer').hide();
    $('#map').show();
    $('#close-map-button').show();
    GetMap();
}

//toggle to window
function ShowFilters(flag) {
    //sm screen
    if (flag) {
        $('#sm-on-button').css('display', 'none');
        $('#sm-off-button').css('display', 'flex');
        $('#map').hide();
        $('#filters').css('height', '100%');
    }
    //lg screen
    else {
        $('#lg-on-button').css('display', 'none');
        $('#lg-off-button').css('display', 'flex');
        $('#cards-list').css('display', 'none');
    }
    $('#close-map-button').hide();
    $('.filter').show();
    $('#filters-footer').show();
}

//hide filters
function HideFilters(flag) {
    if (filtersIsOpen) {
        HideFiltersMap();
        filtersIsOpen = false;
    } else {
        if (flag) {
            $('#sm-on-button').removeAttr('style');
            $('#sm-off-button').css('display', 'none');
            $('#map').show();
            $('#filters').removeAttr('style');
        } else {
            $('#lg-on-button').removeAttr('style');
            $('#lg-off-button').css('display', 'none');
            $('#cards-list').removeAttr('style');
        }
        $('#close-map-button').show();
        $('.filter').hide();
        $('#filters-footer').hide();
    }
}

//hide map-filters window
function HideFiltersMap() {
    $('#filters-map').css('bottom', '-100%');
    $('.filter-reset').unbind('click');
    $('#mobile-apply-filter').unbind('click');
    $('#mobile-apply-filter').bind('click', function () {
        SendFilter($('#mobile-filter-form'));
    });
}

$(function () {
    //add scroll check for filters / map buttons appear
    $(window).scroll(function () {
        if ($('.pageTop') != undefined && $('.pageBottom') != undefined && $('.pageTop').offset() != undefined) {

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
        }
    });

    $('#map-show-btn').bind('click', function (e) {
        e.preventDefault();
        OpenFiltersMap(true);
    });

    $('.map-card').bind('click', function (elem) {
        console.log(1);
        var card = $(elem).data('item');
        console.log(card);
    });
    $('#mobile-apply-filter').bind('click', function (event) {
        SendFilter($('#mobile-filter-form'));
    });
});


$(function () {
    //activate mobile menu
    $('.menu-mobile').owlCarousel({
        loop: false,
        dots: false,
        autoplay: false,
        dragEndSpeed: 1000,
        nav: false,
        autoWidth: true
    });

    $('.owl-stage').css('width', '950px');
    ShowSubMobileMenu($('.menu-mobile .item-active'));
});

/*-------------------------------------Articles-------------------------------------*/
var page = 1;
function ShowNextArticles(category) {
    $.ajax({
        type: "get",
        url: '/guide/articles-list?articleCategory=' + category + '&page=' + page,
        success: function (result) {
            $('.article-items').append(result);
            page++;
        }
    });
}

/*-------------------------------------Facebook popup-------------------------------------*/

//$(document).ready(function () {
//    if (!sessionStorage.getItem("FB_POPUP_SHOW")) {
//        window.setTimeout(function () {
//            $('.fb-popup').modal().fadeIn();
//            sessionStorage.setItem("FB_POPUP_SHOW", "true");
//        }, 30000);
//    }
//});


/*-------------------------------------Retired/unregistered vendor popup-------------------------------------*/
$(document).ready(function () {
    if ($('#vendor-alert-modal').length > 0 && $('#vendor-alert-modal h2')[0].innerHTML.length > 0) {
        window.setTimeout(function () {
            $('#vendor-alert').show().fadeIn();          
        }, 5000);
    }
});

/*-------------------------------- Country dropdown-----------------------------------------*/
$(function () {
    $('.dl-country').change(function (el) {
        //add new country states
        $('.dl-states').html("");
        for (var state in states[el.target.value]) {
            var option = "";
            if (state == "")
                option = " disabled = 'disabled' selected = 'selected'";
            $('.dl-states').append("<option value='" + state + "'" + option + ">" + states[el.target.value][state] + "</option>");
        }

        //change zipcode pattern for new country
        if (zipCodePatterns[el.target.value]) {
            $('.tb-zipcode').rules("remove", "regex");
            $('.tb-zipcode').rules("add", { regex: zipCodePatterns[el.target.value] });
        }

        //change states required message
        var currentState = states[el.target.value];
        if (currentState) {
            $(".dl-states").rules("remove", "required");
            $(".dl-states").rules("add", { required: true, messages: { required: currentState[""] + " is required." } });
            var requiredSpan = $(".dl-states").parents(".account-element").find(".required");
            $(requiredSpan).removeAttr("class");
            $(requiredSpan).attr("class", currentState[""].toLowerCase() + " required");
        }
    });
});

function UpdateMarketStrings(newMarketCityState, newMarketUrl) {
    $("ul.vendor-categories li a").off("click");
    $('a').each(function () {
        var oldUrl = $(this).attr("href"); // Get current url
        //Update URL with market info
        if (oldUrl) {
            var newUrl = oldUrl.replace("redir", newMarketUrl);
            $(this).attr("href", newUrl); // Set href value
        }

        var oldTitle = $(this).attr("title"); // Get current link title 
        //Update "Local" in the title with city/state
        if (oldTitle) {
            var newTitle = oldTitle.replace("Local", newMarketCityState);
            $(this).attr("title", newTitle);
        }
    });

    if (newMarketUrl != null && newMarketCityState != null) {
        $('#locationSearchId').val(newMarketCityState);
        $('#marketCityState').val(newMarketCityState);
        $('#vendorCityUrlId').val(newMarketUrl);
        $('#marketUrl').val(newMarketUrl);
    }   
}
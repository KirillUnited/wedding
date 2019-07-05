
//for track analytics
var AJAX_PATH = "/ajax/html.aspx";
//used to know if user on the checklist page
var isChecklist = false;

/*----------------------------------------------------------------*/
/*--------------------------- GEO-SELECTORS ----------------------*/
/*----------------------------------------------------------------*/

$(document).ready(function () {
    //if (document.referrer != null && document.referrer != '') {
    //    history.replaceState(null, null, window.location.href);
    //}


    $('.country-list').change(function () {
        $.ajax({
            type: "post",
            url: '/Home/OverrideMarketSessionVariables',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{"marketIdString":"' + this.value + '"}',
            success: function (result) {
                var currentUrl = window.location.pathname;
                var re = new RegExp(result.allMarketUrlsList, "i");
                var newUrl = currentUrl.replace(re, result.newMarketUrlName);
                newUrl = newUrl.replace(/---[0-9]+/i, "");
                $('.country-select').attr('action', newUrl);
                $('.country-select').submit();
            },
            error: function (xhr, status, error) {
                alert('failed');
            }
        });
    });

    //$('.country-dropdown').change(function () {
    //    $('#vendorCityUrlId').val(this.value);
    //    $('#locationSearchId').val(this.options[this.selectedIndex].text);
    //});

    //$('.category-dropdown').change(function () {
    //    $('#vendorCategoryUrlId').val(this.value);
    //    $('#vendorSearchId').val(this.options[this.selectedIndex].text);
    //});

    $('body').on('click', '.b-search-form-group', function (e) {
        $(this).siblings().find('.b-search-dropdown').hide();

        if (e.target.tagName === 'INPUT') {
            var menu = $(e.target).siblings('.b-search-dropdown');
            if (menu) {
                menu.show();
            }
        }
    });

    $(document).click(function (e) {
        if (!$('.b-search-form-group').is(e.target) && $('.b-search-form-group').has(e.target).length === 0) {
            $('.b-search-dropdown').hide();
        };
    });

    var locationArr = [];
    var locationCountryArr = [];
    var locationStateArr = [];
    var locationCityArr = [];
    var locationValue = $('#locationList').find('[data-value]');

    locationValue.each(function (indx, element) {
        var VALUES = $(element).data("value");

        locationArr.push(VALUES);        
    });

    locationCountryArr = locationArr.map(function (el, i, self) {
        return el.country;
    }).filter(function (el, i, self) {
        return self.indexOf(el) === i;
        });

    $('[data-target="country"]').empty();
    locationCountryArr.forEach(function (element, indx) {
        $('[data-target="country"]').append('<li data-value="' + element + '"> <span>' + element + '</span></li>');
    });

    $('body').on('click', '[data-attr="selectLocation"]', function (e) {
        var selectList = $(this);
        var targetValue = selectList.data("target");

        if ($(e.target).is('[data-value]') || $(e.target).is('[data-value] span')) {
            $(this).parents('.b-search-select').nextAll().remove();

            switch (targetValue) {
                case 'country':
                    var locationStateArr = locationArr.filter(function (el, i, self) {
                        return el.country === $(e.target).closest('[data-value]').attr('data-value');
                    }).map(function (el, i, self) {
                        return el.state;
                    }).filter(function (el, i, self) {
                        return self.indexOf(el) === i;
                        });

                    getTargetList("state", locationStateArr);

                    break;
                case 'state':
                    var locationCityArr = locationArr.filter(function (el, i, self) {
                        return el.state === $(e.target).closest('[data-value]').attr('data-value');
                    }).map(function (el, i, self) {
                        var elProps = {
                            name: el.city,
                            value: el.value,
                            lat: el.lat,
                            lon: el.lon
                        };
                        return elProps;
                    }).filter(function (el, i, self) {
                        return self.indexOf(el) === i;
                        });

                    getTargetList("city", locationCityArr);

                    break;
                default:
                    break;
            }
        }
    });

    $('body').on('click', '.b-search .b-search-list li', function () {
        var targetID = $(this).closest('[data-select-value-for]').attr('data-select-value-for');
        var hiddenTargetID;

        if (targetID) {
            hiddenTargetID = $('#' + targetID).attr('data-labelledby');
            $('#' + targetID).val($(this).find('.text-value').text());
            $('#' + hiddenTargetID).val($(this).attr('data-value'));
            $(this).closest('.b-search-dropdown').hide();
        }
        $(this).closest('[data-select-value-for]').siblings('.dropdown-toggle').find('.text-value').text($(this).text());
    });

    $('body').on('keyup', '#vendorSearchId, #locationSearchId', function () {
        var targetID = $(this).attr('data-labelledby');

        $(this).siblings('.b-search-dropdown').hide();
        //$('#' + targetID).val($(this).val());
    });

    //autosuggest
    var data = [];
    var dataCat = [];

    $('[data-select-value-for="vendorSearchId"] > li').each(function (i, item) {
        var label = $(item).attr("data-url-name");
        var vendorUrl = $(item).attr("data-value");

        dataCat.push({ vendorUrl: vendorUrl, label: label });
    });

    locationArr.forEach(function (element) {
        var category = element.country;
        var label = element.city;
        var urlName = element.value;
        var lat = element.lat;
        var lon = element.lon;

        data.push({ category: category, label: label, urlName: urlName, lat: lat, lon: lon });
    });

    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _create: function () {
            this._super();
            this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
        },
        _renderMenu: function (ul, items) {
            var that = this,
                currentCategory = "";
            $.each(items, function (index, item) {
                var li;
                if (item.category != currentCategory) {
                    ul.append("<li class='ui-autocomplete-category'><b>" + item.category + "</b></li>");
                    currentCategory = item.category;
                }
                li = that._renderItemData(ul, item);
                if (item.category) {
                    li.attr("aria-label", item.category + " : " + item.label);
                }
            });
        },
        _renderItemData(ul, item) {
            return this._renderItem(ul, item).data("ui-autocomplete-item", item);
        },
        _renderItem(ul, item) {
            ul.addClass('b-search-dropdown');
            return $("<li></li>")
                .data("item.autocomplete", item)
                .append("<div data-value='" + item.urlName + "' data-lat='" + item.lat + "' data-lon='" + item.lon + "'>" + item.label + "</div>")
                .appendTo(ul);
        }
    });

    $("#locationSearchId").catcomplete({
        delay: 100,
        source: data,
        select: function (event, ui) {
            var value = ui.item.urlName;

            var urlID = $('#vendorCityUrlId');

            urlID.val(value);
        },
        position: { my: "right top+12", at: "right bottom" }
    });

    //$("#vendorSearchId").autocomplete({
    //    delay: 100,
    //    source: dataCat,
    //    select: function (event, ui) {
    //        var value = ui.item.vendorUrl;
    //        var TARGET = $('#vendorUrlId');

    //        TARGET.val(value);
    //    },
    //    position: { my: "right top+12", at: "right bottom" }
    //}).data("ui-autocomplete")._renderItem = function (ul, item) {
    //    ul.addClass('b-search-dropdown');
    //    return $("<li></li>")
    //        .data("item.autocomplete", item)
    //        .append("<div data-value='" + item.vendorUrl + "'>" + item.label + "</div>")
    //        .appendTo(ul);
    //}

    $('body').on('submit', '.account-form.b-search-form', function (e) {
        var size = 0;

        $(this).find('#vendorCategoryUrlId, #vendorCityUrlId, #vendorUrlId').each(function () {
            if ($(this).val() != '') {
                size += 1;
            }
        });
        
        if (size == 0) {
            e.preventDefault();
            alert('No matching vendor found');
        } 
    });
});

function getTargetList(target, arr) {
    $('[data-target="' + target + '"]').siblings('.dropdown-toggle').find('.text-value').text(target);

    var tmpl = `<div class="b-search-select">
                    <p class="b-search-select-title">${target}</p>
                    <div class="dropdown">
                        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="text-value">${target}</span>
                            <i class="fa fa-chevron-down"></i>
                        </button>
                        <ul class="b-search-list dropdown-menu" ${target === 'city' ? 'data-select-value-for="locationSearchId"' : ''} data-attr="selectLocation" data-target="${target}"></ul>
                    </div>
                </div>`;

    $('.b-search-dropdown-location').append(tmpl);

    arr.forEach(function (element, indx) {
        $('[data-target="' + target + '"]').append('<li data-value="' + (element.value ? element.value : element) + '"><span class="text-value">' + (element.name ? element.name : element) + '</span></li>');
    });
}
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
$(document).ready(function () {
    if (!popupsShouldThisPopupBeShownToThisUser('newsletter_signup_homepage') && popupsShouldThisPopupBeShownToThisUser('confirm_newsletter_signup')) {
        $('.popup-confirmation').fadeIn().css('display', 'flex');
        popupsDoNotShowSpecificPopupAnymore('confirm_newsletter_signup');
    }

    $("#modal-close").click(function () {
        $('.popup-confirmation').fadeOut();
    });

    $("#modal-ok").click(function () {
        $('.popup-confirmation').fadeOut();
    });

    if (!popupsShouldThisPopupBeShownToThisUser('newsletter_signup_homepage')) {
        $('.getstarted').hide();
    }
});

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

    $("#vendorWebsite").click(function () {
        var dataVendorID = $("#vendorWebsite").data("vendor-id");
        var dataVendorName = $("#vendorWebsite").data("vendor-name");
        var dataVendorContactElementValue = $("#vendorWebsite").data("value");
        var tapType = 'Vendor Profile - URL tapped';

        recordGoogleAnalyticsEvent(tapType, dataVendorName, dataVendorContactElementValue, dataVendorID);

        var ajaxAction = $("#vendorWebsite").data("ajax-action");
        var paramABTestName = $("#vendorWebsite").data("abtest-name");

        $.ajax({
            type: "POST",
            url: AJAX_PATH,
            data: "action=" + ajaxAction + "&" +
                "string=" + paramABTestName + "&" +
                "id=" + dataVendorID,
            dataType: 'html',
            success: function () {
            }
        });
    });

    $("#vendorPhone").click(recordAnalyticPhoneClick);
    $("#vendorPhoneNumber").click(recordAnalyticPhoneClick);

    $("#vendorEmail").click(recordAnalyticEmailClick);
    $("#vendorEmailAddress").click(recordAnalyticEmailClick);
});

function recordAnalyticPhoneClick() {
    var dataVendorID = $(this).data("vendor-id");
    var dataVendorName = $(this).data("vendor-name");
    var dataVendorContactElementValue = $(this).data("value");
    var tapType = 'Vendor Profile - phone number tapped';

    recordGoogleAnalyticsEvent(tapType, dataVendorName, dataVendorContactElementValue, dataVendorID);

    var ajaxPath = $(this).data("ajax-path");
    var ajaxAction = $(this).data("ajax-action");
    var paramABTestName = $(this).data("abtest-name");

    $.ajax({
        type: "POST",
        url: AJAX_PATH,
        data: "action=" + ajaxAction + "&" +
            "string=" + paramABTestName + "&" +
            "id=" + dataVendorID,
        dataType: 'html',
        success: function () {
        }
    });
}

function recordAnalyticEmailClick() {
    var dataVendorID = $(this).data("vendor-id");
    var dataVendorName = $(this).data("vendor-name");
    var dataVendorContactElementValue = $(this).data("value");
    var tapType = 'Vendor Profile - e-mail address tapped';

    recordGoogleAnalyticsEvent(tapType, dataVendorName, dataVendorContactElementValue, dataVendorID);

    var ajaxPath = $(this).data("ajax-path");
    var ajaxAction = $(this).data("ajax-action");
    var paramABTestName = $(this).data("abtest-name");

    $.ajax({
        type: "POST",
        url: AJAX_PATH,
        data: "action=" + ajaxAction + "&" +
            "string=" + paramABTestName + "&" +
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

$(document).ready(function () {
    //search box autocomplete
    var updateSearchLocationSuggestBox = function (event, ui) {
        var result = ui.item.value.replace(/<\/?[^>]+(>|$)/g, "");
        $("#locationSearchId, #locationSearchId-mobile").val(result);
        return false;
    };

    $("#locationSearchId, #locationSearchId-mobile").on("autocompleteselect", function (event, ui) {
        var valueLat = ui.item.lat;
        var valueLon = ui.item.lon;

        var latID = $('#vendorLatId');
        var lonID = $('#vendorLonId');

        latID.val(valueLat);
        lonID.val(valueLon);
    });

    $("#locationSearchId, #locationSearchId-mobile").autocomplete({
        source:
            function (request, response) {
            $.ajax({
                url: "/search/suggest?highlights=true&fuzzy=true&searchtype=1",
                dataType: "json",
                data: {
                    term: request.term
                },
                success: function (data) {
                    var resJSON = JSON.parse(data);
                    var newData = [];

                    resJSON.forEach(function (item) {
                        newData.push({
                            label: item.Text,
                            lat: item.Values[0],
                            lon: item.Values[1],
                        })
                    });

                    response(newData);
                }
            });
        },
        minLength: 3,
        select: updateSearchLocationSuggestBox,
        focus: updateSearchLocationSuggestBox,
        position: { my: "right top+12", at: "right bottom" }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        ul.addClass('b-search-dropdown');
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<div>" + item.label + "</div>")
            .appendTo(ul);
        };

    var updateVendorCategorySuggestBox = function (event, ui) {
        var result = ui.item.value.replace(/<\/?[^>]+(>|$)/g, "");
        $("#vendorSearchId, #vendorSearchId-mobile").val(result);
        return false;
    };

    $("#vendorSearchId, #vendorSearchId - mobile").on("autocompleteselect", function (event, ui) {
        var valueCategory = ui.item.category;
        var ID = $('#vendorUrlId');

        ID.val(valueCategory);
    });

    $("#vendorSearchId, #vendorSearchId-mobile").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/search/suggest?highlights=true&fuzzy=true&searchtype=0",
                dataType: "json",
                data: {
                    term: request.term
                },
                success: function (data) {
                    var resJSON = JSON.parse(data);
                    var newData = [];

                    resJSON.forEach(function (item) {
                        newData.push({
                            label: item.Text,
                            category: item.Values[1]
                        })
                    });
                    response(newData);
                }
            });
        },
        minLength: 3,
        select: updateVendorCategorySuggestBox,
        focus: updateVendorCategorySuggestBox,
        position: { my: "right top+12", at: "right bottom" }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        ul.addClass('b-search-dropdown');
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<div>" + item.label + "</div>")
            .appendTo(ul);
    };
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

//$(document).ready(function () {
//    // when Visual search page loads, put a query into search fields
//    var q = getQueryStringParams()["q"];
//    if (window.location.href.indexOf("/photo-search?q") >= 0) {
//        q = q.replace(/\+/g, '%20');
//        q = decodeURIComponent(q);
//        $(".visual-search-form input").val(q);
//    }

//    // search box - place a previous search term back into the search box && log a visual search function
//    $(".visual-search-form").submit(function (event) {
//        var searchField = $(this).children("input");
//        var searchQuery = searchField.val();

//        if (searchQuery.length >= 3) {
//            $(this).removeClass("search-box-error");
//            recordGoogleAnalyticsEvent("visual search", "visual search=" + searchQuery);  // log search within UI
//            $(this).submit();
//        }
//        else {
//            $(this).addClass("search-box-error");
//            event.preventDefault();
//        }
//    });
//});


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
    $(form).find('input [checked]').each(function (ind, el) {
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

//Remove product from user cart page

function RemoveProduct(data) {
    $("#item_" + data.ProductId).remove();
    if (data.Result) {
        $(".subtotal").text(data.TotalPrice);
    }
    if ($(".cart-item").length === 0) {

        $(".content").html("<p class='text-center'>Your cart is empty.</p><div class='space h100'></div>");
        $(".checkout-block").remove();
    }
}

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
}

//$(function () {
//    //add scroll check for filters / map buttons appear
//    $(window).scroll(function () {
//        var pageTop = $('.pageTop').offset().top,
//            pageTopHeight = $('.pageTop').outerHeight(),
//            pageBottom = $('.pageBottom').offset().top,
//            bageBottomHeight = $('.pageBottom').outerHeight(),
//            windowHeight = $(window).height(),
//            windowScroll = $(this).scrollTop();
//        if (windowScroll > pageTop + pageTopHeight && windowScroll < pageBottom + bageBottomHeight - windowHeight) {
//            if (!$('.filters-block').hasClass('visible-flex')) {
//                $('.filters-block').toggleClass('visible-flex');
//            }
//        } else {
//            if ($('.filters-block').hasClass('visible-flex')) {
//                $('.filters-block').toggleClass('visible-flex');
//            }
//        }
//    });

//    $('#map-show-btn').bind('click', function (e) {
//        e.preventDefault();
//        OpenFiltersMap(true);
//    });

//    $('.map-card').bind('click', function (elem) {
//        console.log(1);
//        var card = $(elem).data('item');
//        console.log(card);
//    });
//});




//Change qty of products
$(function () {
    $(".qty-select").change(function (el) {
        var qty = $(el.target).val();
        var form = $(el.target).parents("form");
        var productId = form.children("input[name='productId']").val();
        var totalPrice = form.children("input[name='totalPrice']").val();
        $.ajax({
            type: "post",
            url: '/store/update-product-qty?productId=' + productId + '&qty=' + qty + '&totalPrice=' + totalPrice,
            dataType: "json",
            success: function (result) {
                if (result.Result)
                    $(".subtotal").text(result.TotalPrice);
            }
        });
    });

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

$(document).ready(function () {
    if (!sessionStorage.getItem("FB_POPUP_SHOW")) {
        window.setTimeout(function () {
            $('.fb-popup').modal().fadeIn();
            sessionStorage.setItem("FB_POPUP_SHOW", "true");
        }, 10000);
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

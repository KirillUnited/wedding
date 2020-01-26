$(document).ready(function () {
    $('body').on('click', '[data-toggle="vendorSearch"]', function (e) {
        e.preventDefault();

        const TARGET_ID = $(this).attr('data-target');

        $(`#${TARGET_ID}`).slideToggle();
    });

    $('body').on('click', '.b-search-form-group', function (e) {
        $(this).siblings().find('.b-search-dropdown').hide();

        if (e.target.tagName === 'INPUT' && !$(this).hasClass('disabled')) {
            var menu = $(e.target).siblings('.b-search-dropdown');
            if (menu) {
                menu.show();
            }
        }
    });

    $(document).click(function (e) {
        if (!$('.b-search-form-group').is(e.target) && $('.b-search-form-group').has(e.target).length === 0) {
            $('.b-search-dropdown').hide();
        }
    });

    var marketUrl = getCookieGlobal("marketUrl");
    var fullCityState = getCookieGlobal("fullCityState");
    if (marketUrl != null && fullCityState != null) {
        $('#locationSearchId').val(fullCityState);
        $('#marketCityState').val(fullCityState);
        $('#vendorCityUrlId').val(marketUrl);
        $('#marketUrl').val(marketUrl);
        $('#cityNameId').text("in " + fullCityState.replace(/,[^,]*$/, ""));
        $('#cityNameId').show();
    }

    var locationArr = [];
    var locationCountryArr = [];
    var locationStateArr = [];
    var locationCityArr = [];
    //var locationValue = $('#locationList').find('[data-value]');

    //locationValue.each(function (indx, element) {
    //    var VALUES = $(element).data("value");

    //    locationArr.push(VALUES);
    //});


    $.ajax({
        type: "GET",
        url: '/Home/GetAllMarkets',
        success: function (data) {
            var resJSON = JSON.parse(data);

            var newData = [];

            resJSON.forEach(function (item) {
                locationArr.push({
                    country: item.sCountry,
                    state: item.sState,
                    city: item.sMarketName,
                    fullcitystate: item.sFullCityState,
                    value: item.sUrlName,
                    lat: item.lat,
                    lon: item.lon,
                });

            });

            if (locationArr != null && locationArr.length > 0) {

                locationCountryArr = locationArr.map(function (el, i, self) {
                    return el.country;
                }).filter(function (el, i, self) {
                    return self.indexOf(el) === i;
                });

                var arr = locationArr.filter(function (el, i, self) {
                    return el.value == marketUrl;
                });


                var currentUserCountry = locationArr.filter(function (el, i, self) {
                    if (arr.length > 0)
                        return el.country == arr[0].country;
                }).map(function (el, i, self) {
                    return el.country;
                }).filter(function (el, i, self) {
                    return self.indexOf(el) === i;
                });

                getTargetList("country", locationCountryArr, currentUserCountry[0]);

                var locationStateArr = locationArr.filter(function (el, i, self) {
                    if (arr.length > 0)
                        return el.country == arr[0].country;
                }).map(function (el, i, self) {
                    return el.state;
                }).filter(function (el, i, self) {
                    return self.indexOf(el) === i;
                });

                getTargetList("state", locationStateArr);
                if (arr.length > 0)
                    $('[data-target="country"]').siblings('.dropdown-toggle').find('.text-value').text(arr[0].country);

                var locationCityArr = locationArr.filter(function (el, i, self) {
                    if (arr.length > 0)
                        return el.state === arr[0].state;
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
                if (arr.length > 0) {
                    $('[data-target="state"]').siblings('.dropdown-toggle').find('.text-value').text(arr[0].state);
                    $('[data-target="city"]').siblings('.dropdown-toggle').find('.text-value').text(arr[0].city);
                    $('[data-target="city"]').attr("data-select-value-for", "locationSearchId");
                }
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
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

                    var country = $(e.target).closest('[data-value]').attr('data-value');
                    var countryFlagImageURI = "https://f5prodstoragecontainer.blob.core.windows.net/prod-live-public/theme/images/flag-" + country + ".jpg";

                    $(e.target).closest('.dropdown').find('.dropdown-toggle img').attr('src', countryFlagImageURI);

                    getTargetList("state", locationStateArr, country, $(e.target).parents(".b-search-dropdown-location, .b-menu-dropdown-location"));

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

                    getTargetList("city", locationCityArr, null, $(e.target).parents(".b-search-dropdown-location, .b-menu-dropdown-location"));

                    break;
                default:
                    break;
            }
        }
    });

    $('body').on('click', '.b-search .b-search-list li, #locationPopup .b-search-list li', function () {
        var targetID = $(this).closest('[data-select-value-for]').attr('data-select-value-for');
        var hiddenTargetID;
        var dataValue = $(this).data("value");
        if (targetID && dataValue !== "") {
            hiddenTargetID = $('#' + targetID).attr('data-labelledby');
            $('#' + targetID).val($(this).find('.text-value').text()).change();
            $('#' + hiddenTargetID).val($(this).attr('data-value')).change();
            $(this).closest('.b-search-dropdown').hide();
        }else if (marketUrl === null && $(this).closest('[data-target="city"]').length === 1) {
            var city = $(this).text();
            var result = locationArr.filter(function (el, i, self) {
                return el.city === city;
            });
            if (result.length > 0) {
                setCookieGlobalPerpetual("marketUrl", result[0].value);
                setCookieGlobalPerpetual("fullCityState", result[0].fullcitystate);
                UpdateMarketStrings(result[0].fullcitystate, result[0].value);
                var dataLinkElem = $(this).closest('[data-link]');
                if (dataLinkElem.length > 0)
                    window.location = dataLinkElem.data('link').replace("redir", result[0].value);
                else
                    $(".b-search-form").submit();
                
            }
            $(this).closest('#locationPopup').modal('hide');
        }
        $(this).closest('[data-select-value-for]').siblings('.dropdown-toggle').find('.text-value').text($(this).text());

        $("#vendorUrlId").val("");
    });

    $('body').on('keyup', '#vendorSearchId, #locationSearchId', function () {
        var targetID = $(this).attr('data-labelledby');

        $(this).siblings('.b-search-dropdown').hide();
        //$('#' + targetID).val($(this).val());
    });

    $('body').on('input change', '#vendorSearchId', function () {
        var RESET_BTN = $(this).siblings('[data-reset-value]');

        if ($(this).val()) RESET_BTN.show();
        if (!$(this).val()) RESET_BTN.hide();
    });

    $('body').on('click', '[data-reset-value]', function (e) {
        e.preventDefault();

        var RESET_BTN = $(this),
            RESET_TARGET_ID = RESET_BTN.data('reset-target-id'),
            TARGET = $('#' + RESET_TARGET_ID);

        if (TARGET) TARGET.val('').change();
    });


    //autosuggest
    var data = [];
    var dataCat = [];

    $('[data-select-value-for="vendorSearchId"] > li').each(function (i, item) {
        var label = $(item).attr("data-url-name");
        var vendorUrl = $(item).attr("data-value");

        dataCat.push({ category: vendorUrl, vendorUrl: vendorUrl, label: label });
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
        _renderItemData: function(ul, item) {
            return this._renderItem(ul, item).data("ui-autocomplete-item", item);
        },
        _renderItem: function(ul, item) {
            ul.addClass('b-search-dropdown');
            return $("<li></li>")
                .data("item.autocomplete", item)
                .append("<div data-value='" + item.urlName + "' data-lat='" + item.lat + "' data-lon='" + item.lon + "'>" + item.label + "</div>")
                .appendTo(ul);
        }
    });

    $("#locationSearchId").catcomplete({
        delay: 500,
        source: data,
        select: function (event, ui) {
            var value = ui.item.urlName;

            var urlID = $('#vendorCityUrlId');

            urlID.val(value);
        },
        position: { my: "left-38 top+12", at: "left bottom" },
        open: function (event, ui) {
            $('.b-search-form-group').addClass('disabled');
        },
        close: function (event, ui) {
            $('.b-search-form-group').removeClass('disabled');
        }
    });

    if ($("#vendorSearchId") != null && $("#vendorSearchId").length > 0) {

        $("#vendorSearchId, #vendorSearchId-mobile").on("autocompleteselect autocompletefocus", function (event, ui) {
            var vendorCategoryUrlIdInput = $("#vendorCategoryUrlId"),
                vendorUrlIdInput = $('#vendorUrlId');

            vendorCategoryUrlIdInput.val('');
            vendorUrlIdInput.val('');

            if (ui.item.vendorUrl) {
                var vendorCategoryUrlId = ui.item.category;

                vendorCategoryUrlIdInput.val(vendorCategoryUrlId);
            } else {
                var vendorUrlId = ui.item.category;

                vendorUrlIdInput.val(vendorUrlId);
            }
        });

        var updateVendorCategorySuggestBox = function (event, ui) {
            var result = ui.item.value.replace(/<\/?[^>]+(>|$)/g, "");
            $("#vendorSearchId, #vendorSearchId-mobile").val(result);
            return false;
        };

        var seachRequestInProgress = false;

        $("body").on("keyup", "#vendorSearchId", function (request, response) {
            if (!seachRequestInProgress)
                postVendorSearchRequest($(this).val().trim());      
        });
    }

    function postVendorSearchRequest(value) {
        if (value === "")
            return;
        seachRequestInProgress = true;
        $.ajax({
            type: "GET",
            url: "/search/suggest?highlights=true&fuzzy=true&searchtype=0",
            dataType: "json",
            data: {
                term: value
            },
            error: function () {
                seachRequestInProgress = false;
            },
            success: function (data) {
                seachRequestInProgress = false;
                var resJSON = JSON.parse(data);
                var resData = [];
                var newData = [];

                resJSON.forEach(function (item) {
                    resData.push({
                        label: item.Text,
                        category: item.Values[1]
                    });
                });
                newData = dataCat.concat(resData);

                $("#vendorSearchId").autocomplete({
                    delay: 100,
                    source: newData,
                    select: updateVendorCategorySuggestBox,
                    focus: updateVendorCategorySuggestBox,
                    position: { my: "left-38 top+12", at: "left bottom" },
                    open: function (event, ui) {
                        $('.b-search-form-group').addClass('disabled');
                    },
                    close: function (event, ui) {
                        $('.b-search-form-group').removeClass('disabled');
                    }
                }).data("ui-autocomplete")._renderItem = function (ul, item) {
                    var icon = "",
                        dataValue = item.category;

                    if (item.vendorUrl != null) {
                        icon = "<div class='b-search-list-icon'>\
                                <img src='https://f5prodstoragecontainer.blob.core.windows.net/prod-live-public/theme/images/searchVendorIcons/" + item.vendorUrl + ".svg' alt='Alt' />\
                            </div>";
                    }
                    ul.addClass('b-search-dropdown');
                    return $("<li></li>")
                        .data("item.autocomplete", item)
                        .append("<div data-vendor-url='" + (item.vendorUrl === undefined ? 1 : 0) + "' data-value='" + dataValue + "'>" + icon + "<span class='text-value'>" + item.label + "</span></div>")
                        .appendTo(ul);
                };         
                $("#vendorSearchId").autocomplete("search", value);

                var currentValue = $("#vendorSearchId").val().trim();                
                if (currentValue !== value && !seachRequestInProgress)
                    postVendorSearchRequest(currentValue);

                //set the value (by default) to the first one in the suggestion

                var firstSuggestion = $(".ui-widget-content.b-search-dropdown").find("[data-value]");

                if (firstSuggestion.data("vendor-url") === 1) {
                    $("#vendorCategoryUrlId").val("");
                    $("#vendorUrlId").val(firstSuggestion.data("value"));
                } else {
                    $("#vendorUrlId").val("");
                    $("#vendorCategoryUrlId").val(firstSuggestion.data("value"));
                }

            }

        });
    }


    $('body').on('submit', '.account-form.b-search-form', function (e) {

        //if the user didn't specify valid vendor category or vendor
        if ($('#vendorCategoryUrlId').val() == '' && $('#vendorUrlId').val() == '') {
            e.preventDefault();
            alert('No matching vendor found. Make sure to select valid vendor or vendor category values from the provided suggestions.');
        }
        //if the user specified the vendor category, but not a valid city
        if ($('#vendorLatId').val() === '0' && $('#vendorCityUrlId').val() === '' && $('#vendorCategoryUrlId').val() !== '') {
            e.preventDefault();
            $("#locationPopup").modal("show");
        }
    });
});


function getTargetList(target, arr, country, $el = null) {
    arr = arr.sort();
    var countryFlagImage = "";
    if(country)
        countryFlagImage = '<img src="https://f5prodstoragecontainer.blob.core.windows.net/prod-live-public/theme/images/flag-' + country + '.jpg" alt="">';
    var dataSelectValueFor = "";
    if ($el !== null && target === 'city') {
        var input = $el.parent().children("input");
        if (input.length > 0)
            dataSelectValueFor = $(input[0]).attr("id");
    }
    var tmpl = `<div class="b-search-select">
                    <p class="b-search-select-title">${target == 'state' && country == 'Canada' ? 'province' : target}</p>
                    <div class="dropdown">
                        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            ${target === 'country' ? countryFlagImage : ""}
                            <span class="text-value">${target == 'state' && country == 'Canada' ? 'province' : target}</span>
                            <i class="fa fa-chevron-down"></i>
                        </button>
                        <ul class="b-search-list dropdown-menu" data-select-value-for="${dataSelectValueFor}" data-attr="selectLocation" data-target="${target}"></ul>
                    </div>
                </div>`;

    ($el === null ? $('.b-search-dropdown-location, .b-menu-dropdown-location') : $el).append(tmpl);
    var dataTarget = $el === null ? $('[data-target="' + target + '"]') : $el.find('[data-target="' + target + '"]');
    $(dataTarget).siblings('.dropdown-toggle').find('.text-value').text(target == 'state' && country == 'Canada' ? 'province' : target);

    $(dataTarget).append(`<li data-value=""><span class="text-value"><span class="text-capitalize text-muted">${target == 'state' && country == 'Canada' ? 'province' : target}</span></span></li>`);
    arr.forEach(function (element, indx) {
        $('[data-target="' + target + '"]').append('<li data-value="' + (element.value ? element.value : element) + '"><span class="text-value">' + (element.name ? element.name : element) + '</span></li>');
    });
}

$(document).ready(function () {
    //search box autocomplete
    var updateSearchLocationSuggestBox = function (event, ui) {
        var result = ui.item.value.replace(/<\/?[^>]+(>|$)/g, "");
        $("#locationSearchId").val(result);
        return false;
    };

    var updateUpdateVendorSearchLocation = function (event, item) {
        var valueLat = item.lat;
        var valueLon = item.lon;

        var latID = $('#vendorLatId');
        var lonID = $('#vendorLonId');

        // clear vendorCityUrlId
        $('#vendorCityUrlId').val('');

        //set lat and lon values
        latID.val(valueLat);
        lonID.val(valueLon);

        //set full city, state
        $("#fullCityStateId").val(item.label.replace(/<[^>]*>?/g, ""));
        return false;
    };

    var locationRequestInProgress = false;

    $("body").on("keyup", "#locationSearchId", function (request, response) {
        if (!locationRequestInProgress)
            postLocationSearchRequest($("#locationSearchId").val());
    });

    if ($("#locationSearchId").length > 0) {
        $("#locationSearchId").on("autocompleteselect autocompletefocus", function (event, ui) {
            updateUpdateVendorSearchLocation(event, ui.item);
        });
    }

    function postLocationSearchRequest(value) {
        if (value === "")
            return;
        locationRequestInProgress = true;
        $.ajax({
            url: "/search/suggest?highlights=true&fuzzy=true&searchtype=1",
            dataType: "json",
            data: {
                term: value
            },
            error: function () {
                locationRequestInProgress = false;
            },
            success: function (data) {
                locationRequestInProgress = false;
                var resJSON = JSON.parse(data);
                var newData = [];

                resJSON.forEach(function (item) {
                    newData.push({
                        label: item.Text,
                        lat: item.Values[0],
                        lon: item.Values[1]
                    });
                });

                if (newData.length > 0)
                    updateUpdateVendorSearchLocation(event, newData[0]);

                $("#locationSearchId").autocomplete({
                    delay: 100,
                    source: newData,
                    select: updateSearchLocationSuggestBox,
                    focus: updateSearchLocationSuggestBox,
                    position: { my: "left-38 top+12", at: "left bottom" },
                    open: function (event, ui) {
                        $('.b-search-form-group').addClass('disabled');
                    },
                    close: function (event, ui) {
                        $('.b-search-form-group').removeClass('disabled');
                    }
                }).data("ui-autocomplete")._renderItem = function (ul, item) {
                    ul.addClass('b-search-dropdown b-search-dropdown-location');
                    return $("<li></li>")
                        .data("item.ui-autocomplete", item)
                        .append("<div data-lat='" + item.lat + "' data-lon='" + item.lon + "'>" + item.label + "</div>")
                        .appendTo(ul);
                };
                $("#locationSearchId").autocomplete("search", value);

                var currentValue = $("#locationSearchId").val();
                if (currentValue !== value && !locationRequestInProgress)
                    postLocationSearchRequest(currentValue);
            }
        });
    }
    var updateVendorCategorySuggestBox = function (event, ui) {
        var result = ui.item.value.replace(/<\/?[^>]+(>|$)/g, "");
        $("#vendorSearchId, #vendorSearchId-mobile").val(result);
        return false;
    };
});
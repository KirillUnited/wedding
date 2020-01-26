﻿$(function () {
    //show full width side on left menu
    var sideDiv = $(".left-menu hr.full-width");
    if (sideDiv.length > 0) {
        var offsetLeft = $(sideDiv[0]).offset().left;
        var width = $(sideDiv[0]).width();
        $(".left-menu hr.full-width").attr("style", "width:" + (width + offsetLeft) + "px;margin-left:-" + offsetLeft + "px");
    }
    //show current category

    $(".left-menu ul li a.current").parents("ul").show();

    //Toggle subcategories
    $(".left-menu ul.menu-dropdown-menu > li > a").click(function (event) {
        $(event.target).parent("li").children("ul").toggle();
    });

    //Show mobile filter

    $(".filters-button").click(function () {
        $('.left-menu').css('left', 0);
        $('.mobile-menu-overlay').show();
    });

    $(".mobile-menu-overlay").click(function () {
        $('.left-menu').css('left', '-100%');
    });

    //Products filter
    $(".filter-item .check").click(function (event) {
        $(event.target).toggleClass("fa-check-square-o");
        $(event.target).toggleClass("fa-square-o");
        $(event.target).parent(".filter-item").find("input").val($(event.target).is(".fa-check-square-o"));
        $(event.target).parents("form").submit();
    });
    $(".sellers a").click(function () {
        if ($('.filter-link input[name="ParentCategory"]').length == 1) {
            $(event.target).parents('form').attr('action', '/store/' + $('input[name="ParentCategory"]').val());
        }
        $(".filter-link").remove();
        $("#storeFilter").submit();
    });

    $(".filter-link i").click(function (event) {
        if ($(event.target).is(".subcategory")) {
            $(event.target).parents('form').attr('action', '/store/' + $('input[name="ParentCategory"]').val());
        }
        $(event.target).parent(".filter-link").remove();
        $("#storeFilter").submit();
    });

    $("select#SortBy").change(function (event) {
        $("#storeFilter").submit();
    });

    //Desktop product photos
    $(".product-photos img").click(function (event) {
        $(".product-img img").attr("src", $(event.target).attr("data-src"));
        $(".product-photos img").removeClass("current");
        $(event.target).addClass("current");
    });

    //Mobile product photos
    $(".product-images-pages .image-item").click(function (event) {
        if ($(event.target).is(".active"))
            return;
        $(".product-img img").attr("src", $(event.target).attr("data-src"));
        $(".product-images-pages .image-item").removeClass("active");
        $(event.target).addClass("active");
    });
    //Search products

    $("#search-products-form button").click(function (event) {
        event.preventDefault();
        var category = $("#search-products-form select").val();
        var q = $("#search-products-form input").val();
        if (category !== "" && category !== "All")
            q = category + " " + q; 
        q = q.trim();
        if (q !== "")
            window.location = "/search?q=" + q;
    });

    //Add to Cart form

    $("#addToCartForm i").click(function (event) {
        CalculateProductQty(event);
    });

    $("#updateProductQty i").click(function (event) {
        CalculateProductQty(event);
        UpdateCartPrices($(event.target).parents(".tb-qty").children("input"));
    });

    //Change qty of products

    $("#updateProductQty #qty").change(function (event) {
        UpdateCartPrices($(event.target));
    });

    //Recommendations link
    $("a.more.recommendations").click(function () {
        SignInModalShow(true);
    });
    //Recommendations products carousel
    $('.products-list.owl-carousel').owlCarousel({
        navElement: 'div role="presentation"',
        responsive: {
            0: {
                items: 2
            },
            480: {
                items: 2
            },
            768: {
                items: 4
            }
        },
        loop: false,
        nav: true,
        dots: false,
        margin: 10,
        dragEndSpeed: 1000
    });

    //Store carousel
    $('.store-slider.owl-carousel').owlCarousel({
        navElement: 'div role="presentation"',
        nav:true,
        items: 1,
        loop: true,
        dots: true
    });

    //Product details
    if ($("select#ddlProductSizes").length === 1) {
        $("#ddlProductSizes").change(function (el) {
            var sizeValue = $(el.target).val();
            var query = "";
            if (sizeValue !== "") {
                query = "&size=" + sizeValue;
                $("#size").val(sizeValue);
                $("#ddlProductSizes").popover('destroy');
            } else
                $("#size").val("");
            loadProductColors($("#productId").val(), query);

        });
        loadProductSizes($("#productId").val(), "");
    }
    if ($(".product-colors").length === 1) {
        $(".product-photos img:first-child").addClass("current");
        loadProductColors($("#productId").val(), "");
    }
});
function CalculateProductQty(event) {
    var tbQty = $(event.target).parents(".tb-qty").children("input");
    if (!tbQty)
        return;
    var value = parseInt($(tbQty).val());
    if (!value)
        return;
    if ($(event.target).is(".fa-minus")) {
        if (value > 1)
            value--;
    }
    else {
        value++;
    }
    $(tbQty).val(value);
}

function UpdateCartPrices(el) {
    var qty = $(el).val();
    var form = $(el).parents("form");
    var productId = form.children("input[name='productId']").val();
    var productVariationId= form.children("input[name='productVariationId']").val();
    $.ajax({
        type: "post",
        url: `/store/update-product-qty?productId=${productId}&qty=${qty}&productVariationId=${productVariationId}`,
        dataType: "json",
        success: function (result) {
            if (result.Result) {
                $(".subtotal").text(result.Subtotal);
                $(".total-price").text(result.TotalPrice);
                $(".shipping-price").text(result.EstimateShipping);
            }
            else {
                alert("Something went wrong. Please refresh the page and try again.If the issues persist, contact us at info@weddingventure.com");
            }
        }
    });
}

function CheckDropDownSizesSelected() {
    if ($("#ddlProductSizes").length === 1 && $("#ddlProductSizes").val() === "") {
        ShowSelectSizeError();
        return false;
    }
    return true;
}

function loadProductSizes(productId, query) {
    var currentSize = $("select#ddlProductSizes").val();
    $.ajax({
        url: `/store/product-sizes?productId=${productId}${query}`,
        method: 'POST',
        success: function (data) {
            if (data.Result) {
                $("#ddlProductSizes").html("");
                $("#ddlProductSizes").append(`<option value=''>Select</option>`);
                for (var size in data.Sizes) {
                    $("#ddlProductSizes").append(`<option value='${data.Sizes[size]}'>${data.Sizes[size]}</option>`);
                }
                $("select#ddlProductSizes").val(currentSize);
            }
        }
    });
}

function loadProductPhotos(productId, query) {
    $.ajax({
        url: `/store/product-photos?productId=${productId}${query}`,
        method: 'POST',
        success: function (data) {
            if (data.Result) {
                updateProductPrices(data.ProductPrice);
                
                //for mobile
                if ($(document).width() < 800) {
                    $(".product-images-pages").html("");
                    for (var photo in data.ProductPhotos) {
                        $(".product-images-pages").append(`<div class="image-item" data-src="${data.ProductPhotos[photo]}"/>`);
                    }
                    $(".product-images-pages .image-item:first-child").addClass("active");
                    $(".product-img img").attr("src", $(".product-images-pages .image-item:first-child").attr("data-src"));
                    $(".product-images-pages .image-item").click(function (event) {
                        if ($(event.target).is(".active"))
                            return;
                        $(".product-img img").attr("src", $(event.target).attr("data-src"));
                        $(".product-images-pages .image-item").removeClass("active");
                        $(event.target).addClass("active");
                    });
                } else {
                    $(".product-photos").html("");
                    for (var photo in data.ProductPhotos) {
                        $(".product-photos").append(`<img src="${photo}" data-src="${data.ProductPhotos[photo]}"/>`);
                    }
                    $(".product-img img").attr("src", $(".product-photos img:first-child").attr("data-src"));
                    $(".product-photos img:first-child").addClass("current");
                    $(".product-photos img").click(function (event) {
                        $(".product-img img").attr("src", $(event.target).attr("data-src"));
                        $(".product-photos img").removeClass("current");
                        $(event.target).addClass("current");
                    });
                }
            }
        }
    });
}
function updateProductPrices(prices) {
    if (prices.DiscountedPrice && prices.DiscountedPrice !== '') {
        $(".price-section").html(`<div class="price-block">
                                        <label>Price:</label> <s> ${prices.Price} </s>
                                    </div>
                                    <div class="price-block">
                                        <label>Discount price:</label> <span class="price">${prices.DiscountedPrice}</span>
                                    </div>
                                    <div class="price-block">
                                        <label>Save:</label> <b>
                                            ${prices.SavePoints}
                                            (${prices.SavePercent}%)
                                        </b>
                                    </div>`);
    } else {
        $(".price-section").html(`<div class="price-block">Price: <span class="price"> ${prices.Price}</span></div>`);
    }
    $("#currentPrice").val(prices.Subtotal);
    $("#productVariationId").val(prices.VariationId);
}

function loadProductColors(productId, query) {
    var colorId = $(".product-colors .thumb.current").attr("data-color-id");
    if (colorId)
        query += `&colorId=${colorId}`;
    $.ajax({
        url: `/store/product-colors?productId=${productId}${query}`,
        method: 'POST',
        success: function (data) {
            if (data.Result) {
                $(".product-colors").html("");
                updateProductPrices(data.ProductPrice);
                if (data.ProductColors.length > 0) {
                    $("#selectedColor").text(data.ProductColors[0].Title);
                    $("#colorId").val(data.ProductColors[0].Id);
                    for (var color in data.ProductColors) {
                        $(".product-colors").append(`<div class="thumb${data.ProductColors[color].IsCurrentlySelected ? " current" : ""}" data-color-id="${data.ProductColors[color].Id}" data-color-title="${data.ProductColors[color].Title}"><img  src="${data.ProductColors[color].ThumbUrl}" data-src="${data.ProductColors[color].PhotoUrl}" alt="${data.ProductColors[color].Title}"/></div>`);
                        if (data.ProductColors[color].IsCurrentlySelected)
                            $("#colorId").val(data.ProductColors[color].Id);
                    }
                    $(".product-colors .thumb").click(function (e) {
                        var el = e.target;
                        if (!$(el).is('.thumb'))
                            el = $(e.target).parent(".thumb");
                        $(".product-colors .thumb").removeClass("current");
                        $(el).addClass("current");
                        var colorId = $(el).attr("data-color-id");
                        var colorTitle = $(el).attr("data-color-title");
                        $("#selectedColor").text(colorTitle);
                        $("#colorId").val(colorId);
                        var currentSize = $("#size").val();
                        var query = "&colorId=" + colorId;
                        if (currentSize && currentSize !== "")
                            query += "&size=" + currentSize;
                        if ($("select#ddlProductSizes").length === 1) {
                            loadProductSizes($("#productId").val(), query);
                        }
                        loadProductPhotos($("#productId").val(), query);
                    });
                    if ($(document).width() > 800) {//for desktop
                        $(".product-colors .thumb img").mousemove(function (el) {
                            $(".product-img img").attr("src", $(el.target).attr("data-src"));
                        });

                        $(".product-colors .thumb img").mouseout(function () {
                            $(".product-img img").attr("src", $(".product-photos img.current").attr("data-src"));
                        });
                    }
                }
            }
        } 
    });
}

function ShowSelectSizeError() {
    var popoverPlacement = 'left';
    //for mobile
    if ($(document).width() < 800) {
        popoverPlacement = 'top';
    }
        //init popover
    $("#ddlProductSizes").popover({
            html: true,
            content: "<span class='error'>Select <b>Size</b> from the left to add to Shopping Cart</span>",
            placement: popoverPlacement,
            trigger: 'focus',
            container: 'body'
        });
        //toggle popover
    $("#ddlProductSizes").popover('toggle');
}

//Remove product from user cart page

function RemoveProduct(data) {
    if (data.Result) {
        $(`#item_${data.ProductId}_${(!data.ProductVariationId ? "" : data.ProductVariationId)}`).remove();
        $(".subtotal").text(data.Subtotal);
        $(".total-price").text(data.TotalPrice);
        $(".shipping-price").text(data.EstimatedShipping);
        $("#lblSubtotal").text(data.SubtotalLabel);
    }
    if ($(".cart-item").length === 0) {

        $(".content").html("<p class='text-center'>Your cart is empty.</p><div class='space h100'></div>");
        $(".checkout-block").remove();
    }
}

//Set up the paypal transaction
function InitPayPalCheckout(productId, productTitle, hasColor, hasSizes) {
    paypal.Buttons({
        //set button style
        style: {
            color: 'gold',
            shape: 'rect',
            label: 'checkout'
        },

        //validate order
        onInit: function (data, actions) {
            if (hasSizes) {
                actions.disable();
                $("#ddlProductSizes").change(function (event) {
                    if ($(event.target).val() === "" || !CheckIsUserAuth())
                        actions.disable();
                    else actions.enable();
                });
              
            }
            if (!CheckIsUserAuth())
                actions.disable();
            $('#isAuth').change(function () {
                if (CheckIsUserAuth())
                    actions.enable();
                else actions.disable();
            });
        },
        onClick: function (data, actions) {
            if (hasSizes) {
                CheckDropDownSizesSelected();
            }
            if (!CheckIsUserAuth()) {
                SignInModalShow(true);
            }       
        },

        //set transaction
        createOrder: function (data, actions) {
            var description = productTitle;
            if (hasColor) {
                description += " " + $(".product-colors .thumb.current").attr("data-color-title");
            }
            if (hasSizes) {
                description += " " + $("#ddlProductSizes").val();
            }

            var productPrice = parseFloat($("#currentPrice").val());
            var qty = parseInt($("#qty").val());
            var subtotal = productPrice * qty;
            var shipping = 0;
            if (subtotal < 100)
                shipping = 19.95;

            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value:  (subtotal + shipping).toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: subtotal
                            },
                            shipping: {
                                currency_code: 'USD',
                                value: shipping
                            }
                        }
                    },
                    items: [{
                        name: description,
                        unit_amount: {
                            currency_code: 'USD',
                            value: productPrice
                        },
                        quantity: qty
                    }]
                }]
            });
        },
        //save tranaction result
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                $('#createAccountLoading').show(); 
                var productItem = details.purchase_units[0].items[0];
                return fetch('/store/paypal-transaction-complete', {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        orderId: data.orderID,
                        payer: details.payer.email_address,
                        shippingAddress: {
                            Address: details.purchase_units[0].shipping.address.address_line_1,
                            City: details.purchase_units[0].shipping.address.admin_area_2,
                            State: details.purchase_units[0].shipping.address.admin_area_1,
                            Country: details.purchase_units[0].shipping.address.country_code,
                            Phone: details.purchase_units[0].shipping.address.phone,
                            ZipCode: details.purchase_units[0].shipping.address.postal_code,
                            FullName: details.purchase_units[0].shipping.name.full_name
                        },
                        userCart: {
                            Products: [{
                                productUID: productId,
                                productVariationUID: parseInt($("#productVariationId").val()),
                                qty: productItem.quantity
                            }],
                            TotalPrice: parseFloat(details.purchase_units[0].amount.value),
                            EstimatedShipping: parseFloat(details.purchase_units[0].amount.breakdown.shipping.value)
                        }
                    })
                }).then(response => {
                    $('#createAccountLoading').hide();  
                    if (response.ok)
                        window.location.href = response.url;
                    else alert("Something went wrong. Please contact us at info@weddingventure.com");
                });       
            });
        }
    }).render('#paypal-button-container');
}




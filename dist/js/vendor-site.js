/**
 * vendor site
 */
$(function () {
    $("body").on("change focus", ".has-label-animation", function () {
        var inp = $(this);

        inp.val() != ""
            ? inp.addClass("is-filled")
            : inp.removeClass("is-filled");
    });

    $.each($(".has-label-animation"), function (indexInArray, valueOfElement) {
        $(valueOfElement).trigger("change");
    });

    /**
     * List Items filter with tabs
     * Data attrs as params
     */
    const statusListSelector = '[data-attr="review-list"]';
    const reviewStatusList = getStatusList(statusListSelector);
    const tabFilterSelector = '[data-attr="tab-filter"]';

    // set items count in tabs
    $.each($(tabFilterSelector), function (indexInArray, valueOfElement) {
        let filter = $(this).data('filter');
        let itemCount = $(`[data-status="${filter}"]`).length;
        let $count = $(this).find(`[data-count]`);

        $count.text(itemCount);
    });

    $("body").on("click", tabFilterSelector, function (e) {
        e.preventDefault();

        const status = $(this).data("filter");
        const props = {
            reviewStatusList,
            statusListSelector,
        };

        $(tabFilterSelector).removeClass("active");
        $(this).addClass("active");
        renderStatusList(Object.assign(props, { status }));
    });
});

function getStatusList(list) {
    if (list) {
        const $review = $(list).find(`[data-status]`);
        const reviewStatusArr = [];

        $.each($review, function (indexInArray, valueOfElement) {
            reviewStatusArr.push($(this).data());
        });
        
        return reviewStatusArr;
    }
}

function reviewToHTML(params = {}) {
    const {status, statusMsg} = params;
    const {name, date, message} = params.props || {};
    const reviewStatusClass = status !== "None" ? status === "Published" ? "text-prime" : "text-second" : '';

    return `<div class="comment" data-status="${status || ''}" data-status-msg="${statusMsg || ''}">
                <div class="row">
                    <div class="col-5 col-sm-7">
                        <h5>${name || ''}</h5>
                    </div>
                    <div class="col-4 col-sm-2">
                        <span class="text-truncate date">${date || ''}</span>
                    </div>
                    <div class="col-3 col-sm-3">
                        <span class="${reviewStatusClass}">${statusMsg || ''}</span>
                    </div>
                    <div class="col">
                        <p class="text-sm">${message || ''}</p>
                    </div>
                </div>
            </div>
            `;
}

function renderStatusList(item = {}) {
    const {statusListSelector, reviewStatusList, status} = item;

    if (statusListSelector && reviewStatusList) {
        const $reviewList = $(statusListSelector);
        const reviews = reviewStatusList.filter(function (el, i, self) {
            return status.trim() == "all" || !status.trim() ? this : el.status == status;
        });

        $reviewList.html("");

        reviews.forEach(function (item) {
            let reviewHTML = reviewToHTML(item);

            $reviewList.append(reviewHTML);
        });
    }
}
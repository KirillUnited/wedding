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

    //delete button testimonial
    $('body').on('click', '[data-attr="removeTestimonial"]', function (e) {
        e.preventDefault();
        $(this).parents('.comment-testimonial').remove();
    });

    //delete testimonial edit popup onclick outside
    $('body').on('click', '.modal-msg.details-form_testimonial', function (e) {
        if (!$('.modal-msg-content').is(e.target) && $('.modal-msg-content').has(e.target).length === 0) {
            $(this).remove();
        }
    });

    initTestimonialEditButtons();

    function initTestimonialEditButtons() {
        //casheDOM
        const $buttons = $('[data-attr="editTestimonial"]');

        //bindEvents
        $.each($buttons, function () {
            const $button      = $(this);
            const $testimonial = $button.parents('.comment-testimonial');

            $button.on('click', function () {
                testimonialEditModal($testimonial);
            });
        });
    }

    function testimonialEditModal($testimonial) {
        let isOpened = false;

        //casheDOM
        const $input           = $testimonial.find('[type=text]');
        const $testimonialList = $('.testimonials-block');
        const ID               = $testimonial.attr('id');
        const $template        = $('#newPackage');
        const $templateClone   = $template.clone();

        //get data from testimonial        
        let data = _getInputData($input) || [];

        //bindEvents
        $('body').on('click', `[data-id=${ID}] [type=submit]`, _submitData);

        if (ID && $template.length && !isOpened) {
            _render();

            const $modal = $(`[data-id=${ID}]`);
            const $input = $modal.find('[type=text]');
            _setInputData(data, $input);
        }

        function _getInputData($input) {
            let data = [];

            $.each($input, function (index, el) {
                const name  = el.name;
                const value = el.value;

                data.push({
                    name,
                    value
                });
            });

            return data;
        }

        function _setInputData(data = [], $inputTestimonial) {
            $.each($inputTestimonial, function (index, el) {
                const name  = el.name;
                const value = data.filter(function (item) {
                    return item.name === name;
                })[0].value;

                $(el).val(value).change();
            });
        }

        function _submitData() {
            event.preventDefault();

            const $modal            = $(`[data-id=${ID}]`);
            const $inputModal       = $modal.find('[type=text]');
            const $testimonial      = $(`[id=${ID}]`);
            const $inputTestimonial = $testimonial.find('[type=text]');
            const newData           = _getInputData($inputModal);

            _setInputData(newData, $inputTestimonial);
            _updateData($inputTestimonial);

            $modal.remove();
        }

        function _updateData($inputTestimonial) {
            $.each($inputTestimonial, function (index, el) {
                const id    = this.id;
                const value = this.value;

                $('[data-label="' + id + '"]').text(value);
            });
        }

        function _render() {
            $templateClone.appendTo($testimonialList);
            $templateClone.html($($templateClone).html().replace(/\[#\]/g, '[' + ID + ']'))
                .html($($templateClone).html().replace(/_#__/g, '_' + ID + '__'))
                .html($($templateClone).html().replace(/#/g, ID))
                .html($($templateClone).html().replace(/Add testimonial/g, 'Edit testimonial')) //if edit modal
                .attr('data-id', ID)
                .fadeIn();

            $templateClone.find('.col-datepicker').datetimepicker({
                format: "MM.DD.YYYY"
            });
        }

        function destroy() {
            isOpened = false;
        }
    }

    
    $('body').on('click', '[data-target="newRespond"], [data-target="newDeclined"]', function (event) {
        event.preventDefault();

        const templateID = $(this).attr('data-target');
        const $template = $('[data-id="' + templateID +'"]');
        const $templateClone = $template.clone();
        const userId = $(this).attr('data-user-id');
        const broadcastId = $(this).attr('data-broadcast-id');

        $('[data-id="modal-br"]').remove();

        $templateClone.appendTo('.vendor-profile');
        $templateClone.html($($templateClone).html().replace(/#userId/g, userId))
            .html($($templateClone).html().replace(/#broadcastId/g, broadcastId))
            .attr('data-id', 'modal-br')
            .fadeIn();

        const button = $templateClone.find('[type=submit]');
        const createCookie = (id, status) => document.cookie = `br-${id}=${status};`/* TEMP COOKIE SAVE */

        button.on('click', function () {
            var form = $(this.form);
            /* TEMP COOKIE SAVE */
            createCookie(broadcastId, templateID.replace('new', ''));
            /* END TEMP COOKIE SAVE */
            form.submit();
        });
    });
});

function createCookie(id, status) {
    document.cookie = `br-${id}=${status};`;
}

function getCookie(name) {
    var results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');

    if (results)
        return (unescape(results[2]));
    else
        return null;
}

function renderCookie(id, status) {
    const defaultStatus = "";
    const props = {
        reviewStatusList: getStatusList('[data-attr="review-list"]'),
        statusListSelector: '[data-attr="review-list"]',
    };

    $('[data-attr="tab-filter"]').removeClass("active");
    $('[data-filter=""]').addClass("active");
    renderStatusList(Object.assign(props, { status: defaultStatus }));
    // set items count in tabs
    $.each($('[data-attr="tab-filter"]'), function (indexInArray, valueOfElement) {
        let filter = $(this).data('filter');
        let itemCount = $(`[data-status="${filter}"]`).length;
        let $count = $(this).find(`[data-count]`);

        $count.text(itemCount);
    });
}

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
    let { status, statusMsg, type } = params;
    let { name, date, message, repliesCount, respond, userId, broadcastId } = params.props || params;
    let statusClass = status !== "None" ? status === "Published" ? "text-prime" : "text-second" : "";

    if (type === "leads") {
        statusClass = "text-prime";
        /**
         * TEMP COOKIE GET
         */
        if (getCookie(`br-${broadcastId}`)) {
            status = getCookie(`br-${broadcastId}`) ? getCookie(`br-${broadcastId}`) : status;
            statusMsg = status;
            statusClass = status === "Declined" ? "text-second" : statusClass;
        }
        /* END TEMP */

        var buttons = !respond ? '' : `
                <div class="col-12">
                    <div class="btn btn-prime" data-target="newRespond" data-user-id="${userId}" data-broadcast-id="${broadcastId}" type="button" onclick="ResponseOnBroadcast(${broadcastId}, this)">respond</div>
                    <div class="btn btn-prime btn-prime-invert" data-user-id="${userId}" data-broadcast-id="${broadcastId}"
                         data-target="newDeclined">decline</div>
                </div>                                                         
        `;

        return `
                <div class="comment comment-lead" id="br-${broadcastId}" data-status="${status || ''}" data-status-msg="${statusMsg || ''}">
                    <div class="row">
                        <div class="col-5 col-sm-6">
                            <h5>${name || ''}</h5>
                        </div>
                        <div class="col-4 col-sm-2">
                            <span class="text-truncate date">${date || ''}</span>
                        </div>
                        <div class="col-3 col-sm-2">
                            <span class="text-truncate date">${repliesCount || '0'} proposals</span>
                        </div>
                        <div class="col-3 col-sm-2">
                            <span class="${statusClass}">${statusMsg || ''}</span>
                        </div>
                        <div class="col-12">
                            <span class="text-sm">A new lead is looking for a photographer</span>
                        </div>
                        <div class="col-12">
                            <p class="text-sm">Dating 12/14/2019 Seattle, WA Budjet $N/A</p>
                        </div>
                        <div class="col-12">
                            <p>${message || ''}</p>
                        </div>
                        ${buttons}
                    </div>
                </div>
                `;
    }

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
    const { statusListSelector, reviewStatusList, status } = item;

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
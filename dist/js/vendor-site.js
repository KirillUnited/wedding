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
            const $button = $(this);
            const $testimonial = $button.parents('.comment-testimonial');

            $button.on('click', function () {
                testimonialEditModal($testimonial);
            });
        });
    }

    function testimonialEditModal($testimonial) {
        let isOpened = false;

        //casheDOM
        const $input = $testimonial.find('[type=text]');
        const $testimonialList = $('.testimonials-block');
        const ID = $testimonial.attr('id');
        const $template = $('#newPackage');
        const $templateClone = $template.clone();

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
                const name = el.name;
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
                const name = el.name;
                const value = data.filter(function (item) {
                    return item.name === name;
                })[0].value;

                $(el).val(value).change();
            });
        }

        function _submitData() {
            event.preventDefault();

            const $modal = $(`[data-id=${ID}]`);
            const $inputModal = $modal.find('[type=text]');
            const $testimonial = $(`[id=${ID}]`);
            const $inputTestimonial = $testimonial.find('[type=text]');
            const newData = _getInputData($inputModal);

            _setInputData(newData, $inputTestimonial);
            _updateData($inputTestimonial);

            $modal.remove();
        }

        function _updateData($inputTestimonial) {
            $.each($inputTestimonial, function (index, el) {
                const id = this.id;
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
        const $template = $('[data-id="' + templateID + '"]');
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

/**
 * VENDOR BLOG TAB
 */
$(function () {
    const postPreviewTemplate = (options) => {
        const {
            previewImage,
            previewTitle,
            previewDescription,
            _id,
        } = options || {};

        return `
            <li class="post-list-item" data-item="${_id || ''}">
                <div class="post-preview">                    
                    <a href="#" class="post-preview-img has-img-fit">
                        ${previewImage
                ? `<img src="${previewImage}" alt="">`
                : ""
            }                        
                    </a>
                    <div class="post-preview-content">
                        <a href="#" class="post-preview-bin js-modal" data-target="modal-alert">
                            <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.56 11.01">
                                <g id="Layer_2" data-name="Layer 2"><g><g id="bin"><g id="delete"><path class="cls-1" d="M.61,9.78A1.23,1.23,0,0,0,1.83,11h4.9A1.23,1.23,0,0,0,8,9.78V2.45H.61Zm8-9.17H6.42L5.81,0H2.75L2.14.61H0V1.83H8.56Z"></path></g></g></g></g>
                            </svg>
                        </a>
                        <h5 class="post-preview-title">
                            ${previewTitle || "Post preview title"}
                        </h5>
                        <p class="post-preview-description">
                            ${previewDescription || "Post preview description"}
                        </p>
                        <a href="#" class="post-preview-link js-modal" data-target="modal-edit-blog" data-item-edit>
                            Edit
                            <i class="fa fa-angle-right"></i>
                        </a>
                    </div>
                </div>
            </li>
        `;
    };

    var ITEM_LIST_DATA = [
        {
            previewDescription: "We had the opportunity to film Romeo and Tami’s wedding. The couple decided to host their wedding",
            previewImage: "https://f5prodstoragecontainer.blob.core.windows.net/prod-live-public/vendor-site/theme/images/side-banner-2.jpg",
            previewTitle: "Wedding Videography: Romeo And Tami’s Wedding Reel",
            _id: 0
        }
    ];
    var VendorTab = VendorTab || {};
    VendorTab.ItemList = class {
        constructor(props) {
            let defaultConfig = {
                selectorName: '[data-itemlist]',
                itemAttrName: 'data-item',
                formName: 'item_list_form',
                formImageSelectorName: '[data-attr="previewImage"]',
                itemEditButtonSelectorName: '[data-item-edit]',
                itemDeleteButtonSelectorName: '[data-item-delete]',
                getItemTemplate: () => { },
            }
            this.config = Object.assign(defaultConfig, props);

            if (this.config.selectorName) {
                this.init();
            }
        }

        init() {
            this.data = {};
            this.DELETE_ITEM_ID = null;
            this.form = document.forms[this.config.formName];
            this.eventsBinding();
        }

        eventsBinding() {
            $(document).on("submit", `[name=${this.config.formName}]`, this.onSubmit.bind(this));
            $(document).on("click", function (e) {
                if ($(this.config.itemEditButtonSelectorName).is(e.target) || $(this.config.itemEditButtonSelectorName).has(e.target).length) {
                    let $item = $(e.target).closest("[data-item]");
                    let ITEM_ID = $item.data("item");

                    if ($item.length && ITEM_ID !== '') {
                        this.getItem(ITEM_ID);
                    }
                }

                if ($(this.config.itemDeleteButtonSelectorName).is(e.target) || $(this.config.itemDeleteButtonSelectorName).has(e.target).length) {
                    if (this.DELETE_ITEM_ID === null) {
                        return false;
                    }
                    this.deleteItem(this.DELETE_ITEM_ID);
                }
            }.bind(this));
            $(document).on("change", `#IMAGE_UPLOAD`, uploadImagePreview);
            $(document).on("click", `[data-target="modal-alert"]`, (e) => {
                let $item = $(e.target).closest("[data-item]");

                this.DELETE_ITEM_ID = $item.data("item");
            });
        }

        getItem(id) {
            const form = this.form;

            ITEM_LIST_DATA.filter(el => el._id == id).map((item) => {
                form.elements["id"].value = item._id;
                form.elements["previewTitle"].value = item.previewTitle;
                form.elements["previewDescription"].value = item.previewDescription;

                if (item.previewImage) {
                    $(this.config.formImageSelectorName)
                        .attr("src", item.previewImage)
                        .parent()
                        .addClass("has-img-fit");
                }
            });
        }

        createItem() {
            ITEM_LIST_DATA.push(Object.assign(this.data));
            this.formReset();
            $(this.config.selectorName).append(this.config.getItemTemplate(this.data));
        }

        editItem(id) {
            let editData = Object.assign(this.data, { _id: id });

            for (var i in ITEM_LIST_DATA) {
                if (ITEM_LIST_DATA[i]._id == id) {
                    ITEM_LIST_DATA[i] = editData;
                    break;
                }
            }
            this.formReset();
            $(`[${this.config.itemAttrName}="${id}"]`).replaceWith(this.config.getItemTemplate(editData));
        }

        deleteItem(id) {
            ITEM_LIST_DATA = ITEM_LIST_DATA.filter(function (el) {
                return el._id != id;
            });
            $(`[${this.config.itemAttrName}="${id}"]`).remove();
            console.log(ITEM_LIST_DATA);
        }

        onSubmit(e) {
            e.preventDefault();
            const id = this.form.elements["id"].value;

            this._collectUserInputData();

            if (!id)
                this.createItem();
            else
                this.editItem(id);
        }

        _collectUserInputData() {
            let data = {};
            let newIndex = $(`[${this.config.itemAttrName}]`).length
                ? $(`[${this.config.itemAttrName}]:last`).data("item") + 1
                : 0;

            for (const el of this.form.elements) {
                const name = el.name;
                const value =
                    name === "previewImage"
                        ? $(this.config.formImageSelectorName).attr("src")
                        : el.value;

                data[name] = value;
            }

            this.data = Object.assign(data, { _id: newIndex });
            console.log(ITEM_LIST_DATA);
        }

        formReset() {
            this.form.reset();
            $(this.config.formImageSelectorName)
                .attr("src", "")
                .parent()
                .removeClass("has-img-fit");
            this.form.elements["id"].value = '';
        }
    }

    const blogTabItemList = new VendorTab.ItemList({ getItemTemplate: postPreviewTemplate });

    $('body').on('submit', '#add-blog-post-form', function () {
        $(this).closest('.post-edit').fadeOut();
    });

    $('body').on('click', '[data-target="modal-edit-blog"]', function () {
        blogTabItemList.formReset();
    });

    $('body').on('click', '[data-item-delete]', function () {
        $(this).closest('[data-itemlist-alert]').fadeOut();
    });
});
/* END VENDOR BLOG TAB */

function uploadImagePreview() {
    var $form = $(this).form();
    var $preview = $form.find('[data-attr="previewImage"]');
    var file = this.files;
    var reader = new FileReader();
    var spinnerTemplate = `
                            <span class="spinner">
                                <i class="fa fa-spinner fa-spin" style="font-size:1.2em"></i>  Uploading...
                            </span>
                            `;

    if (file[0] !== undefined) {
        reader.readAsDataURL(file[0]);

        $preview.parent().append(spinnerTemplate);

        reader.onload = function (e) {
            var src = e.target.result;

            $preview.parent().find('.spinner').remove();

            if (file[0].type === 'image/jpeg' || file[0].type === 'image/png') {
                $preview.attr('src', src).parent().addClass('has-img-fit');
            } else {
                $(this).val('');
                alert('Invalid format!');
            }
        };
    }
}

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
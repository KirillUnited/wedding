
//on success message send name of the messaging form so that we can get correct vendor data
function OnSendMessageSuccess(formName) {
    if (formName === '#popUpMessageForm') {//pop up mwssage window
        var dataVendorID = $("#popUpMessageFormBtn").data("vendor-id");
        var ajaxAction = $("#popUpMessageFormBtn").data("ajax-action");
    } else if (formName === '#pageMessageForm') {//page message window
        dataVendorID = $("#pageMessageFormBtn").data("vendor-id");
        ajaxAction = $("#pageMessageFormBtn").data("ajax-action");
    } else if (formName === '#contactVendorModal') {//page message window
        dataVendorID = $("#contactVendorModalBtn").data("vendor-id");
        ajaxAction = $("#contactVendorModalBtn").data("ajax-action");
    }
    else if (formName === '#contactVendorForm') {//page message window
        dataVendorID = $("#contactVendorFormBtn").data("vendor-id");
        ajaxAction = $("#contactVendorFormBtn").data("ajax-action");
    }
    //log send message
    $.ajax({
        type: "POST",
        url: AJAX_PATH,
        data: "action=" + ajaxAction + "&" +
            "id=" + dataVendorID,
        dataType: 'html',
        success: function () {
        }
    });
    if (formName === '#popUpMessageForm') {
        $('#createAccountLoading').hide();
        $('#popUpMessage').modal('hide');
        $('#popUpMessageForm .text-error').text('');
        setTimeout(function () {
            $('#successMessageText .alert').text('Your message has been sent successfully! We will notify you via the email you provided when the vendor responds to your inquiry.');
            $('#successMessageText').modal('show');
        }, 600);
    }
    else if (formName === '#contactVendorModal') {
        $('#createAccountLoading').hide();
        //$('#contactVendorModal').hide();
        $('#contactVendorModal .text-error').text('');
        setTimeout(function () {
            $('#successMessageText .alert').text('Your message has been sent successfully! We will notify you via the email you provided when the vendor responds to your inquiry.');
            $('#successMessageText').modal('show');
        }, 600);
    }
    else {
        window.location = '/messages/';
    }
}

//on failure message send name of the messaging form so that we can get correct vendor data
function OnSendMessageError(formName) {
    var messageText = 'An error occurred while saving your message. Please refresh the page and try again. If the issues persist, contact us at vendors@weddingventure.com';
    $('#createAccountLoading').hide();
    if (formName === '#popUpMessageForm') {
        $('#popUpMessageForm .text-error').text(messageText);
    } else if (formName === '#pageMessageForm') {
        $('#pageMessageForm .text-error').text(messageText);
    } else if (formName === '#contactVendorModal') {
        $('#contactVendorModal .text-error').text(messageText);
    } else if (formName === '#contactVendorForm') {
        $('#contactVendorForm .text-error').text(messageText);
    }
}
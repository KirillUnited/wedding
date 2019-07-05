
//check if user is auth
function CheckIsUserAuth() {
    //check if user auth
    var isAuth = $('#isAuth').val() === 'true' ? true : false;
    if (isAuth) {
        return true;
    }
    else {
        return false;
    }
}

var form = null;
//check if user is auth
function IsAllowed(event, formEvent) {
    //find form
    form = $(formEvent);
    //if not auth
    if (!CheckIsUserAuth()) {
        //if validation is ok
        if ($(form).valid()) {
            //prevent submit form
            event.preventDefault();

            //update email field
            var email = $(form).find('.email_field').val();
            $('#signInForm input[name="Email"]').val(email);
            $('#regForm input[name="Email"]').val(email);
            //update first name field
            var firstName = $(form).find('.name_field').val();
            $('#regForm input[name="FirstName"]').val(firstName);

            //message block
            if (formEvent === '#popUpMessageForm' || formEvent === '#pageMessageForm') {
                $("#regForm p:first").text("To help prevent spam, you must register before your message can be delivered to the vendor.");
            }

            //cart block
            if (formEvent === '#addToCartForm') {
                $("#regForm h2").text("Register to Proceed");
                $("#regForm p:first").text("You must register to complete the purchase. Your purchase confirmation will be delivered to the  email address you specify below.");
                $("#regForm p .description").text("You must register and confirm your email to purchase store items.");
            }

            //review block
            if (formEvent === '#formReview') {
                $("#regForm p:first").text('To prevent bogus reviews and to keep the quality of the site high, we ask that you register and verify your e-mail address. Your e-mail will never be shown in association with this review on our site or revealed to a vendor.');

                //try to find user name from previous reviews if exist
                var vendorId = $(form).find('#Vendor_UID').val();
                $.ajax({
                    type: "POST",
                    url: "/vendor-reviews/GetFirstNameFromReviewRequest?email=" + email + "&vendorId=" + vendorId,
                    dataType: 'json',
                    success: function (data) {
                        if (data.FirstName && data.FirstName !== "")
                            $('#regForm input[name="FirstName"]').val(data.FirstName);
                    }
                });
            }

            //show sign up form
            SignInModalShow(true);
        }
    //if auth
    } else {
        if ($(form).valid()) {
            ShowLoading();
        }       
    }
}

//success user auth
function OnAuthorizeSuccess(response) {
    //if ok
    if (response.Success) {
        $('.account_error_message').text('');
        $('#isAuth').val(true);
        //check if on the check list page
        if (isChecklist) {
            //reload checklist window
            UpdateCheckList();
        }
        
        //load user menu
        $('#account-block').load('/Account/_AccountMobile');
        $('#account-desktop-block').load('/Account/_AccountDeskTop', function () { $('#signup').modal('hide'); });        
    }
    //if error
    else {
        $('.account_error_message').text(response.Message);
    }
    //hide loader
    $('#createAccountLoading').hide();

    if (response.url)
        window.location.href = response.url;

    //submit form
    $(form).submit();
}

//request has failed
function OnAuthorizeError() {
    $('#createAccountLoading').hide();
    $('.account_error_message').text('An error occurred during account authorization. Please refresh the page and try again. If the issues persist, contact us at vendors@weddingventure.com');
}

//sign out 
function SignOut() {
    $('#isAuth').val(false);

    $('#account-block').load('/Account/_AccountMobile');
    $('#account-desktop-block').load('/Account/_AccountDeskTop');
    window.location.href = window.location.origin;
    //window.location.reload();
    //if (isChecklist) {
    //    //reload checklist window
    //    UpdateCheckList();
    //}
}

//show loader
function ShowLoading() {
    $('#createAccountLoading').show();  
}

//show sign in pop up
function SignInModalShow(flag) {
    if (flag) {
        $('#signInForm p:first').text('Sign in to access your preferences and saved data, talk to vendors and more.');
        $('#registration-form').hide();
        $('#signin-form').show();
    } else {
        $('#regForm p:first').text('Register to save your choices.  We will customize the site based on your preferences.');
        $('#signin-form').hide();
        $('#registration-form').show();       
    }
    $('#signup').modal('show');  
}


/*-----------forgot password-------------*/
function OnResetPasswordSuccess(response) {
    $('#createAccountLoading').hide();
    $('#signup').fadeOut(10000, function () {
        $('#signup').modal('hide');
    });
}
function OnResetPasswordError(response) {
    $('#createAccountLoading').hide();
    $('.signin-window .text-danger').html('<li>An error occurred during reset password. Please refresh the page and try again. If the issues persist, contact us at vendors@weddingventure.com</li>');
}
/*-----------change password-------------*/
function OnChangePasswordSuccess(response) {
    $('#createAccountLoading').hide();
    $('#change-password').fadeOut(10000, function () {
        $('#change-password').modal('hide');
    });
}
function OnChangePasswordError(response) {
    $('#createAccountLoading').hide();
    $('.signin-window .text-danger').html('<li>An error occurred during change password. Please refresh the page and try again. If the issues persist, contact us at vendors@weddingventure.com</li>');
}
/*-----------change email-------------*/
function OnChangeEmailSuccess(response) {
    $('#createAccountLoading').hide();
    $('#change-email').fadeOut(10000, function () {
        $('#change-email').modal('hide');
    });
}
function OnChangeEmailError(response) {
    $('#createAccountLoading').hide();
    $('.signin-window .text-danger').html('<li>An error occurred during change e-mail. Please refresh the page and try again. If the issues persist, contact us at vendors@weddingventure.com</li>');
}
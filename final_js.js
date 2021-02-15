this.media='all'

//for track analytics
var AJAX_PATH = "/ajax/html.aspx";
//used to know if user on the checklist page
var isChecklist = false;

var marketUrl = getCookieGlobal("marketUrl");
var fullCityState = getCookieGlobal("fullCityState");

/*----------------------------------------------------------------*/
/*--------------------------- GEO-SELECTORS ----------------------*/
/*----------------------------------------------------------------*/

$(document).ready(
);

/*----------------------------------------------------------------*/
/* --------------   VENDOR DETAILS  ------------------------------*/
/*----------------------------------------------------------------*/
$(
);

/**
 * Catalog main filter checkboxes validation
 */



/*----------------------------------------------------------------*/
/* --------------   COOKIES  -------------------------------------*/
/*----------------------------------------------------------------*/
var COOKIE_NAME_PREFIX_FOR_POPUP_CAMPAIGNS = "campaign_";
var COOKIE_VALUE_POPUP_CAMPAIGN_DONOTSHOW = "do-not-show";

// set





// get
function getCookieGlobal(nameAA) {
    nameAA = nameAA + "=";
    var carrayAA = document.cookie.split(';');

    for (var i = 0; i < carrayAA.length; i++) {
        var cAA = carrayAA[i];
        while (cAA.charAt(0) === ' ') 

        if (cAA.indexOf(nameAA) === 0) {}

    }

    return null;
}

// delete



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






$(document).ready(
);






/*----------------------------------------------------------------*/
/* ------------   SEARCH  ----------------------------------------*/
/*----------------------------------------------------------------*/
$(document).ready(
);

/*----------------------------------------------------------------*/
/* --------------   VISUAL SEARCH  -------------------------------*/
/*----------------------------------------------------------------*/
// ease in all cards
$(".love-image").fadeIn(1000);

// Heart behavior for when user likes an image
var numVisualSearchImagesLiked = 0;
$('.love-image .heart').on('click', 
);

// Read a page's GET URL variables and return them as an associative array. Use:  var name2 = getQueryStringParams()["name2"];  or  var me = getQueryStringParams()["me"];



/*----------------------------------------------------------------*/
/* ------------   INTERSTITIALS AND EMAIL POPUPS  ----------------*/
/*----------------------------------------------------------------*/
// the user has seen this campaign - do not show it to them again



// should we show this popup campaign to this user, or did they dismiss it already?



// reset the campaign for the user



//send filter



//add filter to query string



/*
 Modal Dialogs functionality
*/
$(
);

/*Al page*/
$(
);
/*-----------------------------------Wedding Store---------------------------------------------------*/
/*Shipping Address Form Customize Placeholder*/
$(
);

/*Add shipping Address dialog*/
$(
);

/*Remove user address*/
$(
);
/*Track product click*/
$(
);

//------------------------------------------------------Mobile top nav menu

//show mobile menu



//hide mobile menu



//show dropdown menu



//show search top nav field on mobile



var prevSubMobileMenu = null;//need to keep previous selected sub menu item
//Show sub-menu



//find correct sub menu and show it



//------------------------------------------------------mobile map-filters window
var filtersIsOpen = false;
//show map-filters window



//toggle to map



//toggle to window



//hide filters



//hide map-filters window



$(
);


$(
);

/*-------------------------------------Articles-------------------------------------*/
var page = 1;



/*-------------------------------------Facebook popup-------------------------------------*/

//$(document).ready(function () {
//    if (!sessionStorage.getItem("FB_POPUP_SHOW")) {
//        window.setTimeout(function () {
//            $('.fb-popup').modal().fadeIn();
//            sessionStorage.setItem("FB_POPUP_SHOW", "true");
//        }, 30000);
//    }
//});

/*-------------------------------------Webchat popup-------------------------------------*/


/*-------------------------------------Retired/unregistered vendor popup-------------------------------------*/
$(document).ready(
);

/*-------------------------------- Country dropdown-----------------------------------------*/
$(
);


$(document).ready(
);





$(document).ready(
);

//check if user is auth



var form = null;
//check if user is auth



//success user auth



//request has failed



//sign out 



//show loader



//hide loader



//show sign in pop up




/*-----------forgot password-------------*/




/*-----------change password-------------*/




/*-----------change email-------------*/











//update sign forms and user's data for content pages
$(
);

//-----------------------------------------------------------broadcast messages

//on success broadcast sending



//on failure broadcast sending



//show broadcast form pop up 



//-----------------------------------------------------------featured vendors contact forms
//on success 



//on failure 




//-----------------------------------------------------------vendor contact forms

//on success message send name of the messaging form so that we can get correct vendor data



//on failure message send name of the messaging form so that we can get correct vendor data



//spam control
var spamPlaceholders =
   [{ Q: "what's 3 plus 4 ?", A: "7" }, { Q: "what's 5 plus 5 ?", A: "10" }, { Q: "what's 1 plus 2 ?", A: "3" },
        { Q: "what's 3 plus 3 ?", A: "6" }, { Q: "what's 5 minus 1 ?", A: "4" }, { Q: "what's 4 plus 5 ?", A: "9" },
        { Q: "what's 2 plus 2 ?", A: "4" }, { Q: "what's 7 plus 1 ?", A: "8" }, { Q: "what's 3 plus 2 ?", A: "5" },
        { Q: "what's 4 plus 6 ?", A: "10" }];
var wrongSpamAnswerNumber = 0;



$(
);

$(document).ready(
);




/* slick slider default (mobile) */



/* Featured Content slider */




$('.filter').slideUp(0);

$('.mobile-buttons .green').click(
);



/*----------------------------------------------------------------*/
/*-------------------------- VENUES SLIDER -----------------------*/
/*----------------------------------------------------------------*/

// not found
$('.venues-slider.owl-carousel').owlCarousel({
    navElement: 'div role="presentation"',
    responsive: {
        0: {
            margin: 10
        },
        480: {
            margin: 10
        },
        768: {
            margin: 30
        }
    },
    loop: false,
    nav: false,
    dots: false,
    items: 3,
    mouseDrag: false,
    dragEndSpeed: 1000
});




/********************************************************************
*************************** EDIT 29.01.2018 *************************
*********************************************************************/


/*----------------------------------------------------------------*/
/* --------------   FUNCTION RESETS ALL FILTERS   ----------------*/
/*----------------------------------------------------------------*/

 resetFilter();

/*----------------------------------------------------------------*/
/* -----------   FUNCTION OPENED WINDOW GET E-BOOK   -------------*/
/*----------------------------------------------------------------*/



$(document).ready(
);

/*----------------------------------------------------------------*/
/* ----   FUNCTION SHOW POPUP WINDOW OF CLICK FILTER ITEM   ------*/
/*----------------------------------------------------------------*/

 popupWedding();

/*----------------------------------------------------------------*/
/* ------------------   POPUP PHOTOS WINDOW   --------------------*/
/*----------------------------------------------------------------*/

 popupPhotos();

/*----------------------------------------------------------------*/
/* -------------------  SIDEBAR SLIDER INIT    -------------------*/
/*----------------------------------------------------------------*/

$(document).ready(
);




/*----------------------------------------------------------------*/
/* ----------------  BACK TO TOP BUTTON (/photo-search) ----------*/
/*----------------------------------------------------------------*/

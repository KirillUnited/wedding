/**
 * VENDOR WEBSITE COMMON SCRIPTS
 */
$(function () {
    // Hide Header on scroll down and show on scroll up
    var scrollTimeOut = true,
        lastYPos = 0,
        yPos = 0,
        yPosDelta = 5,
        nav = $(".vw-header"),
        navContent = $("#menu-active"),
        navHeight = nav.outerHeight(),
        setNavClass = function () {
            scrollTimeOut = false;
            yPos = $(window).scrollTop();

            if (Math.abs(lastYPos - yPos) >= yPosDelta) {
                if (
                    yPos > lastYPos &&
                    yPos > navHeight &&
                    !navContent.prop('checked')
                ) {
                    nav.addClass("nav-up");
                    nav.removeClass("scroll-up");
                } else {
                    nav.removeClass("nav-up");
                    nav.addClass("scroll-up");
                }
                lastYPos = yPos;
            }
            if (yPos === 0) {
                nav.removeClass("scroll-up");
            }
        };

    $(window).scroll(function (e) {
        scrollTimeOut = true;
    });

    setInterval(function () {
        if (scrollTimeOut) {
            setNavClass();
        }
    }, 25);
});

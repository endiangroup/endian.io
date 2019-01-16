$(document).foundation();
var burger = $("#burger");
var menu = $("#mobile-menu");
burger.click(function () {
    menu.fadeIn();
    if (burger.hasClass("open")) {
        burger.removeClass("open");
        menu.fadeOut();
    }
    else {
        burger.addClass("open");
        menu.fadeIn();
    }
    return false;
});

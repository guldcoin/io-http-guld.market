$(document).ready(function () {
    function welcomeCenter() {
        var height = $('body').height();
        var logoCenter = $('.main').outerHeight();

        var free_space = height - logoCenter - 180; // 180px from top and bottom nav
        var off_top = (free_space / 2);
        if (off_top < 1) {
            off_top = 3;
        }

        $('.main').css("margin-top", off_top + "px");
    }

    $(window).resize(function () {
        welcomeCenter();
    });

    // Force to load
    setTimeout(function () {
        $(window).resize();
    }, 100);
});
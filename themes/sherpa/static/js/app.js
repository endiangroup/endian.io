$(document).foundation();
// Mobile navigation
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
// Footnotes
var footnotes = [];
var idx = 0;
var host_regex = new RegExp(location.host);
$('article a').each(function () {
    var el = $(this);
    if (el.html() != "*") {
        if (!host_regex.test(el.attr('href')) && el.attr('href').charAt(0) != '/') {
            el.addClass('external-link');
        }
        return;
    }
    // Index is zero-based; make human readable.
    ++idx;
    var footnote = {
        idx: idx,
        href: el.attr("href"),
        id: "reference-" + idx,
        title: el.attr("title")
    };
    // Update the element
    el.addClass("footnote");
    el.attr("id", footnote.id);
    el.attr("href", "#footnote-" + idx);
    el.html(String(idx));
    var content = "<p>" + footnote.title + "</p><p>";
    if (footnote.href != "none") {
        content += "<a href='" + footnote.href + "' target='_blank'><i class='fi-link'></i> " + footnote.href + "</a></p>";
    }
    footnotes.push(footnote);
});
if (footnotes.length) {
    var footnotes_el = $('<ol id="footnotes"></ol>');
    var article_footer = $('article section');
    for (var i = 0; i < footnotes.length; i++) {
        footnotes_el.append("<li class='footnote' id='footnote-" + footnotes[i].idx + "'><span><a href='#" + footnotes[i].id + "'><i class='fi-arrow-up'></i></a> " + footnotes[i].title + ".</span>");
        if (footnotes[i].href != "none") {
            var parts = footnotes[i].href.split(",");
            for (var j = 0; j < parts.length; j++) {
                footnotes_el.append("<i class='fi-link'></i> <a href='" + footnotes[i].href + "'>" + parts[j] + "</a><br/>");
            }
        }
    }
    article_footer.append("<h2 id='notes'>Notes</h2>").append(footnotes_el);
}
$('a.footnote').click(function () {
    var el = $(this);
    var target = $('span', $(el.attr('href')));
    target.addClass("highlight");
    setTimeout(function () {
        target.removeClass('highlight');
    }, 3000);
});
// Internal links
var linkMap = {};
$('h2,h3,h4,h5').each(function () {
    var el = $(this);
    var id = el.attr('id');
    if (id) {
        linkMap[el.text()] = id;
    }
});
$('strong').each(function () {
    var el = $(this);
    var text = el.text();
    for (let key in linkMap) {
        if (text != key) {
            continue;
        }
        el.wrap('<a href="#' + linkMap[key] + '"></a>');
    }
});
// Tables
$('table').basictable();
// Smooth scrolling for foothotes
var jump = function (e) {
    e.preventDefault();
    var target = $(this).attr("href");
    $('html,body').animate({
        scrollTop: $(target).offset().top - $('#main').height() - 20
    }, 200, function () {
        //location.hash = target;
    });
};
$(document).ready(function () {
    $('a[href*="#"]').bind("click", jump); //Gets all hrefs
    return false;
});
// Deteminsitic images
var Trianglify;
function makeTriangles() {
    $('.trianglify').each(function () {
        var el = $(this);
        var pattern = Trianglify({
            height: Math.ceil(el.height()),
            width: Math.floor(el.width()),
            cell_size: 20,
            variance: 0.8,
            seed: el.data('seed'),
        });
        el.append(pattern.canvas());
    });
}
$(window).resize(function () {
    $('.trianglify canvas').remove();
    makeTriangles();
});
makeTriangles();

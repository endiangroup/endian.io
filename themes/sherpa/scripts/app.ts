$(document).foundation()

// Mobile navigation
var burger = $("#burger");
var menu   = $("#mobile-menu");
burger.click(function(){
    menu.fadeIn();

    if (burger.hasClass("open")) {
        burger.removeClass("open");
        menu.fadeOut();
    } else {
        burger.addClass("open");
        menu.fadeIn();
    }
    return false;
});

// CTAs
interface MessageSample {
    support, agent, visitor, bot : any
}

interface Slaask {
    isOpen():boolean
    isLive():boolean
    show()
    identifyContact()
    sendMessage(any)
    Message(any,string):void
    MessageSample:MessageSample
}
interface Window {
    _slaask:Slaask
}

let lastBotMessage:string = ""

$('.ctas a.cta[data-message]').each(function() {
    let el = $(this)
    el.click(()=> {
        if (!window._slaask) {
            return false
        }

        let slaask = window._slaask
        let messageText = el.data('message')

        if (!slaask.isOpen()) {
            slaask.show()
        }

        slaask.identifyContact()

        if (slaask.isLive() && lastBotMessage != messageText){
            slaask.sendMessage(
                new slaask.Message(
                    slaask.MessageSample.bot,
                    messageText,
                ),
            )
            lastBotMessage = messageText
        }
        return false
    })
})

// Footnotes
var footnotes = [];
var idx = 0;
var host_regex = new RegExp(location.host);

$('article a').each(function() {

    var el = $(this);

    if (el.html() != "*") {

        if (!host_regex.test(el.attr('href')) && el.attr('href').charAt(0) != '/') {
            el.addClass('external-link');
            el.attr('target','_blank');
        }

        return;
    }

    // Index is zero-based; make human readable.
    ++idx;

    var footnote = {
        idx:   idx,
        href:  el.attr("href"),
        id:    "reference-"+idx,
        title: el.attr("title")
    };

    // Update the element
    el.addClass("footnote");
    el.attr("id", footnote.id);
    el.attr("href","#footnote-"+idx);
    el.attr("title", $('<div>'+el.attr("title")+'</div>').text());
    el.html(String(idx));

    var content = "<p>"+footnote.title+"</p><p>";

    if (footnote.href != "none") {
        content += "<a href='"+footnote.href+"' target='_blank'><i class='fi-link'></i> " + footnote.href + "</a></p>"
    }

    footnotes.push(footnote);
});

if (footnotes.length) {

    var footnotes_el   = $('<ol id="footnotes"></ol>');
    var article_footer = $('article section');

    for (var i = 0; i < footnotes.length; i++) {
        footnotes_el.append("<li class='footnote' id='footnote-"+footnotes[i].idx+"'><span><a href='#"+footnotes[i].id+"'><i class='fi-arrow-up'></i></a> " + footnotes[i].title + ".</span>");

        if (footnotes[i].href != "none"){
            var parts = footnotes[i].href.split(",");
            for (var j = 0; j < parts.length; j++) {
                footnotes_el.append("<i class='fi-link'></i> <a class='fn-link' href='"+footnotes[i].href+"'>"+parts[j]+"</a><br/>");
            }
        }
    }

    article_footer.append("<h2 id='notes'>Notes</h2>").append(footnotes_el);
}

$('a.footnote').click(function(){
    var el = $(this);
    var target = $('span',$(el.attr('href')));
    target.addClass("highlight");
    setTimeout(function () {
        target.removeClass('highlight');
    }, 3000);
});

// Internal links
var linkMap = {};
$('h2,h3,h4,h5').each(function() {
    var el = $(this);
    var id = el.attr('id');
    if (id) {
        linkMap[el.text()] = id;
    }
});

$('strong').each(function() {
    var el = $(this);
    var text = el.text();

    for (let key in linkMap) {
        if (text != key) {
            continue;
        }
        el.wrap('<a href="#'+linkMap[key]+'"></a>');
    }
});

// Tables
var tables = $('table') as any;
if (tables.length > 0) {
    tables.basictable();
}

// Smooth scrolling for foothotes
var jump=function(e) {
    e.preventDefault();
    var target = $(this).attr("href");
    $('html,body').animate(
        {
            scrollTop: $(target).offset().top - $('#main').height() - 20
        },
        200,
        function()
        {
            //location.hash = target;
        });
}

$(document).ready(function() {
    $('a[href*="#"]').bind("click", jump);
    return false;
});

// Deteminsitic images
var Trianglify:any;

function makeTriangles() {
    var cellSize = 41;
    if (document.body.clientWidth < 1280) {
        cellSize = 55;
    }

    $('.trianglify').each(function(){
        var el = $(this);
        var pattern = Trianglify({
            height: Math.ceil(el.height()),
            width: Math.floor(el.width()),
            cell_size: cellSize,
            variance: 0.8,
            seed: el.data('seed'),
            stroke_width: 1.51,
        });
        el.append(pattern.svg());
        $('svg',el).fadeIn();
    });
}

var width = 0;

$( window ).resize(function() {
    if (width == document.body.clientWidth) {
        return;
    }

    width = document.body.clientWidth;

    $('.trianglify svg').remove();
    makeTriangles();
});
makeTriangles();

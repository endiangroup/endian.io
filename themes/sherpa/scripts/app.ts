$(document).foundation()

var buffer = $('.buffer');
var header = $('header');
buffer.height(header.height());

$('.top-section').on('sticky.zf.stuckto:top', function(){
$(this).addClass('shrink');
$('.buffer').show();
$('header').hide();
}).on('sticky.zf.unstuckfrom:top', function(){
  $(this).removeClass('shrink');
$('header').slideDown();
$('.buffer').slideUp();
})

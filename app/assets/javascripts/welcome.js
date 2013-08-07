$(document).ready(function() {

$(".myBox").click(function(){
     window.location=$(this).find("a").attr("href");
     return false;
});

$(".welcome").mouseenter(function(){
  $(".welcome").fadeTo("fast",1);
});

$(".welcome").mouseleave(function(){
  $(".welcome").fadeTo("fast",.8);
});


// change welcome to body to do for all pages

$('body').css('display', 'none');

$('body').fadeIn(1000);



$('.link').click(function(event) {

event.preventDefault();

newLocation = this.href;

$('body').fadeOut(1000, newpage);

});



function newpage() {

window.location = newLocation;

}

});


$(document).ready(function() {

  $(".myBox").click(function(event){
      event.preventDefault();
      newLocation = "/home";
      $('body').fadeOut(500, newpage);
  });

  $(".pvwatts").click(function(event){
      event.preventDefault();
      newLocation = "http://www.nrel.gov/rredc/pvwatts/";
      $('body').fadeOut(500, newpage);
  });

  $(".cleantechnica").click(function(event){
      event.preventDefault();
      newLocation = "http://cleantechnica.com/2012/10/08/average-size-of-solar-in-the-united-states-small/";
      $('body').fadeOut(500, newpage);
  });

  $(".welcome").mouseenter(function(){
    $(".welcome").fadeTo("fast",1);
  });

  $(".welcome").mouseleave(function(){
    $(".welcome").fadeTo("fast",.8);
  });

  $(".logo").mouseenter(function(){
    $(".logo").fadeTo("fast",1);
  });

  $(".logo").mouseleave(function(){
    $(".logo").fadeTo("fast",.8);
  });

  $(".data").mouseenter(function(){
    $(".data").fadeTo("fast",1);
  });

  $(".data").mouseleave(function(){
    $(".data").fadeTo("fast",.8);
  });


  // change welcome to body to do for all pages

  $('body').css('display', 'none');

  $('body').fadeIn(1000);



  $('a').click(function(event) {

  event.preventDefault();

  newLocation = this.href;

  $('body').fadeOut(500, newpage);

  });



  function newpage() {

  window.location = newLocation;

  }



  });

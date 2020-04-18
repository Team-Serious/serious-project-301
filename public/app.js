'use strict';
$(document).ready(function () {
  // $('dropdown-menu').hide();
  $('.drop').click(function () {
    $('.dropdown-menu').toggleClass('hidden');
    $('.arrow').toggleClass('up');
  });
});

$ (document).ready(function(){
  $('.info-div').hide();
  $('.info-btn').on('click',function(){

      $('.info-div').toggle();
  })

})
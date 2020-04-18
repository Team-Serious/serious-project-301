'use strict';
$(document).ready(function () {
  // $('dropdown-menu').hide();
  $('.drop').click(function () {
    $('.dropdown-menu').toggleClass('hidden');
    $('.arrow').toggleClass('up');
  });

  $('.RowaidInfo').hover(function(){
    $('.Rowaid').toggleClass('animate');
  });
  $('.HussineInfo').hover(function(){
    $('.Hussine').toggleClass('animate');
  });
  $('.Batoolnfo').hover(function(){
    $('.Batool').toggleClass('animate');
  });
  $('.DarahInfo').hover(function(){
    $('.Darah').toggleClass('animate');
  });
});



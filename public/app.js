'use strict';
$(document).ready(function () {
  // drop down menu
  $('.drop').click(function () {
    $('.dropdown-menu').toggleClass('hidden');
    $('.arrow').toggleClass('up');
  });

  // about us
  $('.RowaidInfo').hover(function () {
    $('.Rowaid').toggleClass('animate');
  });
  $('.HussineInfo').hover(function () {
    $('.Hussine').toggleClass('animate');
  });
  $('.Batoolnfo').hover(function () {
    $('.Batool').toggleClass('animate');
  });
  $('.DarahInfo').hover(function () {
    $('.Darah').toggleClass('animate');
  });

  // search result
  $('.info-div').hide();
  $('.bgblack').hide();
  $('.info-btn').on('click', function () {
    let divId = $(this).attr('id');
    divId = '#div'+divId;
    $(divId).toggle();
    $('.bgblack').show();
  });

  $('.bgblack').on('click', function(){
    $('.info-div').hide();
    $('.bgblack').hide();
  });

  $('.closepop').on('click', function(){
    let popId= $(this).attr('id');
    popId= '#di'+ popId;
    $(popId).toggle();
    $('.bgblack').hide();
  })
 
});

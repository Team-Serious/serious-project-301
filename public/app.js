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
  $('.info-btn').on('click', function () {
    let divId = $(this).attr('id');
    divId = '#div'+divId;
    $(divId).toggle();
  });

  $('.closepop').on('click', function(){
    let popId= $(this).attr('id');
    console.log(popId);
    popId= '#di'+ popId;
    console.log(popId);
    $(popId).toggle();
  })
});

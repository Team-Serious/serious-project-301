'use strict';
$(document).ready(function () {
  // $('dropdown-menu').hide();
  $('.drop').click(function () {
    $('.dropdown-menu').toggleClass('hidden');
    $('.arrow').toggleClass('up');
  });
});

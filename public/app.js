'use strict';
$(document).ready(function () {
  // menu
  $('.dot').click(function () {
    $('.cont').toggleClass('showMenu');
    $('.pl2').toggleClass('pl3');
    $('.pl').toggleClass('p5');
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

  // search result page -- learn more div
  $('.info-div').hide();
  $('.bgblack').hide();
  $('.info-btn').on('click', function () {
    let divId = $(this).attr('id');
    divId = '#div' + divId;
    $(divId).toggle();
    $('.bgblack').show();
  });
  // search result page -- dark background
  $('.bgblack').on('click', function () {
    $('.info-div').hide();
    $('.bgblack').hide();
  });
  // search result page -- close popup
  $('.closepop').on('click', function () {
    let popId = $(this).attr('id');
    popId = '#di' + popId;
    $(popId).toggle();
    $('.bgblack').hide();
  });


  // search page -- recommendation 'search breed'
  $('input[type="radio"]').on('click',recommended);
  $('#se').on('keyup',recommended);

  // user page -- lear more
  $('.info-div').hide();
  $('.bgblack').hide();
  $('.info-btn').on('click', function () {
    let divId = $(this).attr('id');
    divId = '#div' + divId;
    $(divId).toggle();
    $('.bgblack').show();
  });
});





function recommended(){
  let catsBreed = ['abys', 'aege', 'abob', 'acur', 'asho', 'awir', 'amau', 'amis', 'bali', 'bamb'];
  let dogsBreed = ['Akbash_Dog', 'Afghan_Hound', 'Airedale_Terrier', 'Alaskan_Husky', 'American_Bulldog', 'Akita'];

  let petBreed = [];
  let str = '';
  if($('input[name="pet"]:checked').val()==='cat'){
    catsBreed.forEach(e => {
      petBreed.push(e);
    });
  }else if($('input[name="pet"]:checked').val()==='dog'){
    dogsBreed.forEach(e => {
      petBreed.push(e);
    });
  }else{
    catsBreed = [...catsBreed,...dogsBreed];
    catsBreed.forEach(e => {
      petBreed.push(e);
    });
  }

  str=petBreed.join(' ');
  let q = $('#se').val();
  let s =`\\b(${q})\\w+`;
  let regx = new RegExp(s,'gi');
  let char = str.match(regx) || ['no matches found'];
  $('#petBreeds').text(char);
}


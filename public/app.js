'use strict';
$(document).ready(function () {
  // menu
  $('.dot').click(function () {
    $('.cont').toggleClass('showMenu');
    $('.menudiv').toggleClass('menudiv2');
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

  // moving cat
  let right = 0;
  let top =0;
  setInterval(function () {
    right=-400;
    top=$(window).scrollTop();
    $('.tuna').css('top', `${top}px`);
  }, 30000);
  setInterval(function () {
    if (right < $(window).width()) right += 10;
    $('.tuna').css('right', `${right}px`);
  }, 50);




  // search page -- recommendation 'search breed'
  $('input[type="radio"]').on('click', recommended);
  $('#se').on('keyup', recommended);


  // user page -- update button
  // $('.updateUser').on('click',function(){
  //   let userPetId = $('.updateUser').attr('id');
  //   console.log(userPetId),'pppppppppppppppppp';
  //   $(`form${userPetId}`).toggle();
  // });

  // user page -- learn more
  // $('.info-div').hide();
  // $('.bgblack').hide();
  // $('.info-btn').on('click', function () {
  //   let divId = $(this).attr('id');
  //   divId = '#div' + divId;
  //   $(divId).toggle();
  //   $('.bgblack').show();
  // });
});





function recommended() {
  let catsBreed = ['abys', 'aege', 'abob', 'acur', 'asho', 'awir', 'amau', 'amis', 'bali', 'bamb'];
  let dogsBreed = ['Akbash_Dog', 'Afghan_Hound', 'Airedale_Terrier', 'Alaskan_Husky', 'American_Bulldog', 'Akita'];

  let petBreed = [];
  let str = '';
  if ($('input[name="pet"]:checked').val() === 'cat') {
    catsBreed.forEach(e => {
      petBreed.push(e);
    });
  } else if ($('input[name="pet"]:checked').val() === 'dog') {
    dogsBreed.forEach(e => {
      petBreed.push(e);
    });
  } else {
    catsBreed = [...catsBreed, ...dogsBreed];
    catsBreed.forEach(e => {
      petBreed.push(e);
    });
  }

  str = petBreed.join(' ');
  let q = $('#se').val();
  let s = `\\b(${q})\\w+`;
  let regx = new RegExp(s, 'gi');
  let char = str.match(regx) || ['no matches found'];
  $('#petBreeds').text(char);
}

$('.shortDisc').hover(function(){
  let divId= $(this).attr('id');
  divId= '#img'+ divId;
  console.log(divId);
  $(divId).toggleClass('imgflip');
})
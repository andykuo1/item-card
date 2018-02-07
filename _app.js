$(document).ready(function() {
  $('.card').hover(function(){
    $(this).addClass('flip');
  },function(){
    $(this).removeClass('flip');
  });

  $('title').html(name);
  $('.item-name').html(name);
  $('.item-description').html(desc);
  $('.item-stat').html(stat);
  $('.item-action').html(acts);
});

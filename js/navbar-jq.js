/**
 * Created by antonsidorenko on 16.02.17.
 */
(function($, undefined) {
   $(function() {
       var dropdown = $('.dropdown');
       dropdown.on('mouseenter', function () {
           $(this).children('a').children('.arrow').addClass('openedArrow');
           $(this).children('.submenu').stop().slideDown({
               duration: 400,
               queue: false,
               start: function() {
                   $(this).stop().animate({
                       'background-color': '#244510'
                   }, {
                       duration: 600
                   })
               }
           });
       });

       dropdown.on('mouseleave', function () {
           $(this).children('a').children('.arrow').removeClass('openedArrow');
           $(this).children('.submenu').stop().slideUp({
               duration: 400,
               queue: false,
               start: function() {
                   $(this).stop().animate({
                       'background-color': '#3e7319'
                   }, {
                       duration: 600
                   })
               }
           });
       });

       $('nav a').on('click', function(e) {
           e.preventDefault();
       })
   });
})(jQuery);
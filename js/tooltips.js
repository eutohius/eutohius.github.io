/**
 * Created by antonsidorenko on 11.02.17.
 */
(function ($, undefined) {
    $(function(){
        var labels = document.body.querySelectorAll('label');
        $(labels).on('mouseenter', function() {
            $(this).next('.tooltip').fadeIn('slow');
        });
        $(labels).on('mouseleave', function() {
            $(this).next('.tooltip').fadeOut('slow');
        });
        $('.showAllButton').on('click', function(e) {
            $('.tooltip').fadeToggle('slow');
            e.preventDefault();
        })
    });
})(jQuery);
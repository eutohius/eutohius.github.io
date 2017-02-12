/**
 * Created by antonsidorenko on 11.02.17.
 */
(function ($, undefined) {
    $(function(){
        var labels = document.body.querySelectorAll('input');
        $(labels).on('mouseenter', function() {
            $(this).closest('label').next('.tooltip').fadeIn('slow');
        });
        $(labels).on('mouseleave', function() {
            $(this).closest('label').next('.tooltip').fadeOut('slow');
        });
        $('.showAllButton').on('click', function(e) {
            $('.tooltip').fadeIn('slow');
            e.preventDefault();
            setTimeout(function () {
                $('.tooltip').fadeOut('slow');
            }, 2000)
        })
    });
})(jQuery);
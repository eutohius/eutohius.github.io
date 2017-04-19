/**
 * Created by antonsidorenko on 14.04.17.
 */
(function($, undefined){
    $(function() {
        var $figures = $(document.body.querySelectorAll('.services_figure'));
        $figures.hover(function() {
            $(this).find('.services_mask').fadeIn();
        },
        function() {
            $(this).find('.services_mask').fadeOut();
        })

    });
})(jQuery);
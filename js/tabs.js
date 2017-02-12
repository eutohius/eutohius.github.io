/**
 * Created by antonsidorenko on 10.02.17.
 */
(function($, undefined){
    $(function() {
        var tabs = $(document.body.querySelectorAll('.tab'));
        tabs.on('click', function(){
            $(this).addClass('active').siblings().removeClass('active')
                .closest('.tabsContainer').find('.text').hide().eq($(this).index()).show();
        });
    });
})(jQuery);
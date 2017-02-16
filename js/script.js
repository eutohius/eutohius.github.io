/**
 * Created by antonsidorenko on 15.02.17.
 */
(function($, undefined){
    $(function(){
        //jcarousel plugin installation and configuration
        $('.jcarousel').jcarousel({
            list: '.jcarousel-list',
            items: '.jcarousel-item',
            animation: {
                duration: 800,
                easing: 'swing'
            },
            wrap: 'circular'
        })
            .jcarouselAutoscroll({
            interval: 5000,
            target: '+=1',
            autostart: true
        });

        $(document).on('keydown', function(e) {
           if (e.keyCode ==39) $('.jcarousel').jcarousel('scroll', '+=1');
            else if (e.keyCode == 37) $('.jcarousel').jcarousel('scroll', '-=1');
        });

        $('.jcarousel-control-next').on('click', function() {
            $('.jcarousel').jcarousel('scroll', '+=1');
            return false;
        });

        $('.jcarousel-control-prev').on('click', function() {
            $('.jcarousel').jcarousel('scroll', '-=1');
            return false;
        });

        //custom select plugin installation
        $(document.getElementById('select')).prettyDropdown({
            customClass: 'triangle',
            height: 30,
            hoverIntent: 1500
        });

        //custom checkbox implementation
        (function() {
            $('.jqCheckbox').on('mousedown', function () {
                changeCheck($(this));
            });

            $('.jslabe').on('mousedown', function() {
                changeCheck($(this).next('.jqCheckbox'));
            });

            $('.jqCheckbox').each(function() {
                changeCheckStart($(this));
            });

            function changeCheck(el){
                var input = el.find('input');
                if (!input.attr('checked')) {
                    el.css('background-position', '0 -17px');
                    input.attr('checked', true);
                }
                else {
                    el.css('background-position', '0 0');
                    input.attr('checked', false);
                }
                return true;
            }

            function changeCheckStart(el) {
                var input = el.find('input');
                if (input.attr('checked')) {
                    el.css('background-position', '0 -17px');
                    return true;
                }
            }
        })()

    });
})(jQuery);
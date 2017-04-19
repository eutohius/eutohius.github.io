/**
 * Created by antonsidorenko on 13.04.17.
 */
(function($, undefined){
    $(function() {
        var $accordion = $(document.querySelector('.accordion')),
            $panels = $accordion.find('.accordion_section');
        $panels.on('click', function() {
           var $thisPanel = $(this);
           if(!$thisPanel.data('opened')) open($thisPanel);
           else close($accordion);
        });

        function open($accPanel) {
            close($accordion);
            $accPanel.data('opened', true);
            $accPanel.find('.accordion_plus').css({
                'background-color': '#f4b60d'
            })
                .html('-')
                .next('.accordion_heading').css({
                'background-color': '#f4b60d'
            });
            $accPanel.animate({
                height: '180px'
            });
        }

        function close($acc) {
            $acc.find('.accordion_section')
                .each(function() {
                    if (!$(this).data('opened')) return;
                    $(this).data('opened', false)
                        .find('.accordion_plus')
                        .css({
                            'background-color': '#fff'
                        })
                        .html('+')
                        .next('.accordion_heading')
                        .css({
                            'background-color': '#fff'
                        });
                    $(this).animate({
                        height: '42px'
                    });
                });
        }

    });
})(jQuery);
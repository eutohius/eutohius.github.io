/**
 * Created by antonsidorenko on 21.04.17.
 */
(function($, undefined){
    $(function() {
        var $pagination = $(document.querySelector('.carousel_pagination')),
            $bg = $(document.querySelector('.carousel_bg')),
            radios = document.querySelectorAll('.carousel input[type=radio]'),
            $radios = $(radios);

        $radios.on('change', function() {
            refresh();
        });
        setInterval(checkNext, 5000);

        function refresh() {
            $radios.each(function() {
                var self = this;
                if (!$(this).is(':checked')) return;
                $bg
                    .fadeOut(500, function() {
                        $bg.css({
                            background: 'url("' + self.getAttribute('data-imgurl') + '") center center'
                        })
                    })
                    .fadeIn();
            });
        }

        function checkNext() {
            var next = 0;
            for (var i = 0; i < radios.length; i++) {
                if ($(radios[i]).is(':checked') && i != 2) next = i+1;
            }
            $(radios[next]).prop('checked', true)
                .change();
        }
    });
})(jQuery);
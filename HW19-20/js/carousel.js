/**
 * Created by antonsidorenko on 13.04.17.
 */
(function($, undefined) {
    $(function() {
        var $carousel = $(document.body.querySelector('.carousel')),
            $bg = $(document.body.querySelector('.carousel_bg')),
            $firstRadio = $(document.body.querySelector('.carousel_pagination label')),
            $currentRadio = $firstRadio;

        var $pagination = $carousel.find('.carousel_pagination');
        $pagination.on('change', function() {
            $pagination.find('label').each(function() {
                if (!$(this).prev('input[type=radio]').is(':checked')) return;
                var url = this.getAttribute('data-imgurl');
                $bg.fadeOut(600, function() {
                    $bg.css({
                        'background': 'url("' + url + '") center center'
                    })
                })
                    .fadeIn(800);
            });
        });

        setInterval(nextButton, 5000);


        function nextButton() {
            console.log($currentRadio.is(':last-child'));
            $currentRadio.prev()
                .attr('checked', false);
            if ($currentRadio.is(':last-child')) $currentRadio = $firstRadio;
            else $currentRadio = $currentRadio.next().next();
            $currentRadio.prev()
                .attr('checked', true)
                .change();
        }
    });
})(jQuery);
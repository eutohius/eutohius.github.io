"use strict";

(function($, undefined) {
    $(function() {
        var testJSON = JSON.stringify(test);
        localStorage.setItem('testJSON', testJSON);
        localStorage.setItem('correctAnswersJSON', JSON.stringify(correctAnswers));
        document.getElementById('testWrap').innerHTML = tmpl(document.getElementById('testTemplate').innerHTML,
            JSON.parse(localStorage.getItem('testJSON')));
        var parsedCorrectAnswers = JSON.parse(localStorage.getItem('correctAnswersJSON'));
        var checkButton = document.getElementById('check');
        var $checkboxes = $(document.getElementById('testWrap')).children('form').find(':checkbox');
        var $modalBox = $('.myModalBox');
        $(checkButton).on('click', function(e) {
            e.preventDefault();
            var userChecked = [];
            $($checkboxes.filter(':checked').each(function() {
                userChecked.push(this.getAttribute('name'));
            }));

            // Так как в данном случае в массиве могут быть только данные строкового типа, и всегда в одном порядке, можно использовать
            // упрощенный способ сравнения массива: приведение массива к строке с последующим сравнением.

            if (userChecked.join() === parsedCorrectAnswers.join()) showModalBox('You are correct!');
            else showModalBox('Wrong, try again...');

            $checkboxes.each(function() {
                $(this).prop('checked', false);
            });


        });

        function showModalBox(text) {
            $modalBox.html(text)
                .fadeIn();
            setTimeout(function() {
                $modalBox.fadeOut();
            }, 2000);
        }
    });
})(jQuery);

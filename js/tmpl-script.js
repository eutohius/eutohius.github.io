/**
 * Created by antonsidorenko on 21.02.17.
 */
(function($, undefined) {
    $(function() {
        var result = tmpl(document.getElementById('template').innerHTML, data);
        $(document.body).append(result);

    });
})(jQuery);


/**
 * Created by antonsidorenko on 08.03.17.
 */
(function($, undefined){
    $(function() {
        var $searchBox = $(document.getElementById('pixBox')),
            $searchForm = $(document.getElementById('search')),
            $results = $('.results');
        var key = '4774586-4cf093bc6404559772a9e7be8';

        $searchForm.on('submit', function(e) {
            e.preventDefault();
            $results.empty();
            var q = toUrlCode($searchBox.val());

            if(q) {
                $results.append('<p class="caption">Showing results for "' + $searchBox.val() + '"</p>');
                getResponse(q);
            }
            else {
                $results.append('Sorry, could you be more specific?</p>');
            }
        });

        function getResponse (input) {
            $.ajax({
                url: 'https://pixabay.com/api?key=' + key
                + '&q=' + toUrlCode(input) + '&safesearch=true&per_page=50',
                dataType: 'json',
                success: displayResults
            });
        }

        function displayResults(data, textStatus) {
            var hitsQty = data.hits.length;
            if(hitsQty == 0) {
                $results.append('<p>No matches found.</p>');
                return;
            }
            for(var i = 0; i < hitsQty; i++) {
                try {
                    $results.append('<a href="' + data.hits[i].pageURL + '" target="_blank"><img src="' + data.hits[i].webformatURL +
                        '" alt="' + data.hits[i].tags + '"</a>');
                }

                catch(e) {
                    console.log('oops, something went wrong, please try again');
                }
            }
            console.log(data, textStatus);

        }

        function toUrlCode(input) {
            return input.trim().split(' ').join('+');
        }
    });
})(jQuery);
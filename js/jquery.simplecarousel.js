/**
 * Created by antonsidorenko on 21.02.17.
 */
(function($, undefined) {
    $(function() {
        var defaults = {
            imageWidth: 640,
            imageHeight: 480,
            margin: 15,
            initialPicture: 3
        };
        $.fn.simpleCarousel = function (params) {

            var options = $.extend({}, defaults, params);
            var imgQty = this.find('li').length;
            var wrapperWidth = this[0].getBoundingClientRect().width;
            var step = options.imageWidth + options.margin,
                minLeftValue = -imgQty * (options.imageWidth+ options.margin) + wrapperWidth,
                maxLeftValue = 0;
            var leftArrow = $(document.querySelector('.carousel-arrow-left')),
                rightArrow = $(document.querySelector('.carousel-arrow-right')),
                carList = this.find('.carousel-list');

            this.css({
                'width': 'calc(100vw - 50px)',
                'height': options.imageHeight + 'px',
                'overflow': 'hidden',
                'margin': 'auto'
            })
                .find('.carousel-list').css({
                'list-style': 'none',
                'width': (options.imageWidth + options.margin) * imgQty + 'px',
                'height': '480px',
                'position': 'relative',
                'left': (function () {
                    if (options.initialPicture < 1 || options.initialPicture > 10) return 5 * step + (wrapperWidth - options.imageWidth) / 2 + 'px';
                    if (options.initialPicture == 1) return 0;
                    if (options.initialPicture >= imgQty) return wrapperWidth - step * imgQty;
                    else return -(options.initialPicture - 1) * step + (wrapperWidth - options.imageWidth) / 2 + 'px';
                })(),
                'z-index': '1'
            })
                .find('.carousel-element').css({
                'display': 'block',
                'margin-right': options.margin + 'px',
                'float': 'left'
            });

            this.find('.carousel-arrow').css({
               'background-image': 'url(img/arrows-sprite.png)',
                'cursor': 'pointer',
                'position': 'absolute',
                'height': '128px',
                'width': '128px',
                'top': options.imageHeight/2 - 64 + 'px',
                'opacity': '.3',
                'z-index': '5'
            })
                .on('mouseenter', function() {
                    $(this).stop().animate({
                            'opacity': 1
                        },
                        {
                            duration: 300
                        })
                })
                .on('mouseleave', function() {
                    $(this).stop().animate({
                            'opacity': .3
                        },
                        {
                            duration: 300
                        })
                });

            leftArrow.css({
                'left': '5px'
            })
                .on('click', function() {
                    var currentLeftValue = parseInt(carList.css('left'));
                    var targetLeftValue = currentLeftValue > minLeftValue + step ? currentLeftValue - step : minLeftValue;
                    carList.stop().animate({
                        left: targetLeftValue
                    }, 500)
                });

            rightArrow.css({
                'right': '5px',
                'background-position': '0 128px'
            })
                .on('click', function() {
                    var currentLeftValue = parseInt(carList.css('left'));
                    var targetLeftValue = currentLeftValue < -step ? currentLeftValue + step : maxLeftValue;
                    carList.stop().animate({
                        left: targetLeftValue
                    }, 500)
            });



            return this;
        };
});
})(jQuery);
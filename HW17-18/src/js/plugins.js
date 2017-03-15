/*!
 * jQuery Color Animations v@VERSION
 * https://github.com/jquery/jquery-color
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: @DATE
 */

( function( root, factory ) {
    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( [ "jquery" ], factory );
    } else if ( typeof exports === "object" ) {
        module.exports = factory( require( "jquery" ) );
    } else {
        factory( root.jQuery );
    }
} )( this, function( jQuery, undefined ) {

    var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor " +
            "borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",

        // plusequals test for += 100 -= 100
        rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,

        // a set of RE's that can match strings and generate color tuples.
        stringParsers = [ {
            re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            parse: function( execResult ) {
                return [
                    execResult[ 1 ],
                    execResult[ 2 ],
                    execResult[ 3 ],
                    execResult[ 4 ]
                ];
            }
        }, {
            re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            parse: function( execResult ) {
                return [
                    execResult[ 1 ] * 2.55,
                    execResult[ 2 ] * 2.55,
                    execResult[ 3 ] * 2.55,
                    execResult[ 4 ]
                ];
            }
        }, {

            // this regex ignores A-F because it's compared against an already lowercased string
            re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
            parse: function( execResult ) {
                return [
                    parseInt( execResult[ 1 ], 16 ),
                    parseInt( execResult[ 2 ], 16 ),
                    parseInt( execResult[ 3 ], 16 )
                ];
            }
        }, {

            // this regex ignores A-F because it's compared against an already lowercased string
            re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
            parse: function( execResult ) {
                return [
                    parseInt( execResult[ 1 ] + execResult[ 1 ], 16 ),
                    parseInt( execResult[ 2 ] + execResult[ 2 ], 16 ),
                    parseInt( execResult[ 3 ] + execResult[ 3 ], 16 )
                ];
            }
        }, {
            re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            space: "hsla",
            parse: function( execResult ) {
                return [
                    execResult[ 1 ],
                    execResult[ 2 ] / 100,
                    execResult[ 3 ] / 100,
                    execResult[ 4 ]
                ];
            }
        } ],

        // jQuery.Color( )
        color = jQuery.Color = function( color, green, blue, alpha ) {
            return new jQuery.Color.fn.parse( color, green, blue, alpha );
        },
        spaces = {
            rgba: {
                props: {
                    red: {
                        idx: 0,
                        type: "byte"
                    },
                    green: {
                        idx: 1,
                        type: "byte"
                    },
                    blue: {
                        idx: 2,
                        type: "byte"
                    }
                }
            },

            hsla: {
                props: {
                    hue: {
                        idx: 0,
                        type: "degrees"
                    },
                    saturation: {
                        idx: 1,
                        type: "percent"
                    },
                    lightness: {
                        idx: 2,
                        type: "percent"
                    }
                }
            }
        },
        propTypes = {
            "byte": {
                floor: true,
                max: 255
            },
            "percent": {
                max: 1
            },
            "degrees": {
                mod: 360,
                floor: true
            }
        },

        // colors = jQuery.Color.names
        colors,

        // local aliases of functions called often
        each = jQuery.each;

// define cache name and alpha properties
// for rgba and hsla spaces
    each( spaces, function( spaceName, space ) {
        space.cache = "_" + spaceName;
        space.props.alpha = {
            idx: 3,
            type: "percent",
            def: 1
        };
    } );

    function clamp( value, prop, allowEmpty ) {
        var type = propTypes[ prop.type ] || {};

        if ( value == null ) {
            return ( allowEmpty || !prop.def ) ? null : prop.def;
        }

        // ~~ is an short way of doing floor for positive numbers
        value = type.floor ? ~~value : parseFloat( value );

        if ( type.mod ) {

            // we add mod before modding to make sure that negatives values
            // get converted properly: -10 -> 350
            return ( value + type.mod ) % type.mod;
        }

        // for now all property types without mod have min and max
        return Math.min( type.max, Math.max( 0, value ) );
    }

    function stringParse( string ) {
        var inst = color(),
            rgba = inst._rgba = [];

        string = string.toLowerCase();

        each( stringParsers, function( i, parser ) {
            var parsed,
                match = parser.re.exec( string ),
                values = match && parser.parse( match ),
                spaceName = parser.space || "rgba";

            if ( values ) {
                parsed = inst[ spaceName ]( values );

                // if this was an rgba parse the assignment might happen twice
                // oh well....
                inst[ spaces[ spaceName ].cache ] = parsed[ spaces[ spaceName ].cache ];
                rgba = inst._rgba = parsed._rgba;

                // exit each( stringParsers ) here because we matched
                return false;
            }
        } );

        // Found a stringParser that handled it
        if ( rgba.length ) {

            // if this came from a parsed string, force "transparent" when alpha is 0
            // chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
            if ( rgba.join() === "0,0,0,0" ) {
                jQuery.extend( rgba, colors.transparent );
            }
            return inst;
        }

        // named colors
        return colors[ string ];
    }

    color.fn = jQuery.extend( color.prototype, {
        parse: function( red, green, blue, alpha ) {
            if ( red === undefined ) {
                this._rgba = [ null, null, null, null ];
                return this;
            }
            if ( red.jquery || red.nodeType ) {
                red = jQuery( red ).css( green );
                green = undefined;
            }

            var inst = this,
                type = jQuery.type( red ),
                rgba = this._rgba = [];

            // more than 1 argument specified - assume ( red, green, blue, alpha )
            if ( green !== undefined ) {
                red = [ red, green, blue, alpha ];
                type = "array";
            }

            if ( type === "string" ) {
                return this.parse( stringParse( red ) || colors._default );
            }

            if ( type === "array" ) {
                each( spaces.rgba.props, function( key, prop ) {
                    rgba[ prop.idx ] = clamp( red[ prop.idx ], prop );
                } );
                return this;
            }

            if ( type === "object" ) {
                if ( red instanceof color ) {
                    each( spaces, function( spaceName, space ) {
                        if ( red[ space.cache ] ) {
                            inst[ space.cache ] = red[ space.cache ].slice();
                        }
                    } );
                } else {
                    each( spaces, function( spaceName, space ) {
                        var cache = space.cache;
                        each( space.props, function( key, prop ) {

                            // if the cache doesn't exist, and we know how to convert
                            if ( !inst[ cache ] && space.to ) {

                                // if the value was null, we don't need to copy it
                                // if the key was alpha, we don't need to copy it either
                                if ( key === "alpha" || red[ key ] == null ) {
                                    return;
                                }
                                inst[ cache ] = space.to( inst._rgba );
                            }

                            // this is the only case where we allow nulls for ALL properties.
                            // call clamp with alwaysAllowEmpty
                            inst[ cache ][ prop.idx ] = clamp( red[ key ], prop, true );
                        } );

                        // everything defined but alpha?
                        if ( inst[ cache ] && jQuery.inArray( null, inst[ cache ].slice( 0, 3 ) ) < 0 ) {

                            // use the default of 1
                            inst[ cache ][ 3 ] = 1;
                            if ( space.from ) {
                                inst._rgba = space.from( inst[ cache ] );
                            }
                        }
                    } );
                }
                return this;
            }
        },
        is: function( compare ) {
            var is = color( compare ),
                same = true,
                inst = this;

            each( spaces, function( _, space ) {
                var localCache,
                    isCache = is[ space.cache ];
                if ( isCache ) {
                    localCache = inst[ space.cache ] || space.to && space.to( inst._rgba ) || [];
                    each( space.props, function( _, prop ) {
                        if ( isCache[ prop.idx ] != null ) {
                            same = ( isCache[ prop.idx ] === localCache[ prop.idx ] );
                            return same;
                        }
                    } );
                }
                return same;
            } );
            return same;
        },
        _space: function() {
            var used = [],
                inst = this;
            each( spaces, function( spaceName, space ) {
                if ( inst[ space.cache ] ) {
                    used.push( spaceName );
                }
            } );
            return used.pop();
        },
        transition: function( other, distance ) {
            var end = color( other ),
                spaceName = end._space(),
                space = spaces[ spaceName ],
                startColor = this.alpha() === 0 ? color( "transparent" ) : this,
                start = startColor[ space.cache ] || space.to( startColor._rgba ),
                result = start.slice();

            end = end[ space.cache ];
            each( space.props, function( key, prop ) {
                var index = prop.idx,
                    startValue = start[ index ],
                    endValue = end[ index ],
                    type = propTypes[ prop.type ] || {};

                // if null, don't override start value
                if ( endValue === null ) {
                    return;
                }

                // if null - use end
                if ( startValue === null ) {
                    result[ index ] = endValue;
                } else {
                    if ( type.mod ) {
                        if ( endValue - startValue > type.mod / 2 ) {
                            startValue += type.mod;
                        } else if ( startValue - endValue > type.mod / 2 ) {
                            startValue -= type.mod;
                        }
                    }
                    result[ index ] = clamp( ( endValue - startValue ) * distance + startValue, prop );
                }
            } );
            return this[ spaceName ]( result );
        },
        blend: function( opaque ) {

            // if we are already opaque - return ourself
            if ( this._rgba[ 3 ] === 1 ) {
                return this;
            }

            var rgb = this._rgba.slice(),
                a = rgb.pop(),
                blend = color( opaque )._rgba;

            return color( jQuery.map( rgb, function( v, i ) {
                return ( 1 - a ) * blend[ i ] + a * v;
            } ) );
        },
        toRgbaString: function() {
            var prefix = "rgba(",
                rgba = jQuery.map( this._rgba, function( v, i ) {
                    if ( v != null ) {
                        return v;
                    }
                    return i > 2 ? 1 : 0;
                } );

            if ( rgba[ 3 ] === 1 ) {
                rgba.pop();
                prefix = "rgb(";
            }

            return prefix + rgba.join() + ")";
        },
        toHslaString: function() {
            var prefix = "hsla(",
                hsla = jQuery.map( this.hsla(), function( v, i ) {
                    if ( v == null ) {
                        v = i > 2 ? 1 : 0;
                    }

                    // catch 1 and 2
                    if ( i && i < 3 ) {
                        v = Math.round( v * 100 ) + "%";
                    }
                    return v;
                } );

            if ( hsla[ 3 ] === 1 ) {
                hsla.pop();
                prefix = "hsl(";
            }
            return prefix + hsla.join() + ")";
        },
        toHexString: function( includeAlpha ) {
            var rgba = this._rgba.slice(),
                alpha = rgba.pop();

            if ( includeAlpha ) {
                rgba.push( ~~( alpha * 255 ) );
            }

            return "#" + jQuery.map( rgba, function( v ) {

                    // default to 0 when nulls exist
                    return ( "0" + ( v || 0 ).toString( 16 ) ).substr( -2 );
                } ).join( "" );
        },
        toString: function() {
            return this._rgba[ 3 ] === 0 ? "transparent" : this.toRgbaString();
        }
    } );
    color.fn.parse.prototype = color.fn;

// hsla conversions adapted from:
// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

    function hue2rgb( p, q, h ) {
        h = ( h + 1 ) % 1;
        if ( h * 6 < 1 ) {
            return p + ( q - p ) * h * 6;
        }
        if ( h * 2 < 1 ) {
            return q;
        }
        if ( h * 3 < 2 ) {
            return p + ( q - p ) * ( ( 2 / 3 ) - h ) * 6;
        }
        return p;
    }

    spaces.hsla.to = function( rgba ) {
        if ( rgba[ 0 ] == null || rgba[ 1 ] == null || rgba[ 2 ] == null ) {
            return [ null, null, null, rgba[ 3 ] ];
        }
        var r = rgba[ 0 ] / 255,
            g = rgba[ 1 ] / 255,
            b = rgba[ 2 ] / 255,
            a = rgba[ 3 ],
            max = Math.max( r, g, b ),
            min = Math.min( r, g, b ),
            diff = max - min,
            add = max + min,
            l = add * 0.5,
            h, s;

        if ( min === max ) {
            h = 0;
        } else if ( r === max ) {
            h = ( 60 * ( g - b ) / diff ) + 360;
        } else if ( g === max ) {
            h = ( 60 * ( b - r ) / diff ) + 120;
        } else {
            h = ( 60 * ( r - g ) / diff ) + 240;
        }

        // chroma (diff) == 0 means greyscale which, by definition, saturation = 0%
        // otherwise, saturation is based on the ratio of chroma (diff) to lightness (add)
        if ( diff === 0 ) {
            s = 0;
        } else if ( l <= 0.5 ) {
            s = diff / add;
        } else {
            s = diff / ( 2 - add );
        }
        return [ Math.round( h ) % 360, s, l, a == null ? 1 : a ];
    };

    spaces.hsla.from = function( hsla ) {
        if ( hsla[ 0 ] == null || hsla[ 1 ] == null || hsla[ 2 ] == null ) {
            return [ null, null, null, hsla[ 3 ] ];
        }
        var h = hsla[ 0 ] / 360,
            s = hsla[ 1 ],
            l = hsla[ 2 ],
            a = hsla[ 3 ],
            q = l <= 0.5 ? l * ( 1 + s ) : l + s - l * s,
            p = 2 * l - q;

        return [
            Math.round( hue2rgb( p, q, h + ( 1 / 3 ) ) * 255 ),
            Math.round( hue2rgb( p, q, h ) * 255 ),
            Math.round( hue2rgb( p, q, h - ( 1 / 3 ) ) * 255 ),
            a
        ];
    };


    each( spaces, function( spaceName, space ) {
        var props = space.props,
            cache = space.cache,
            to = space.to,
            from = space.from;

        // makes rgba() and hsla()
        color.fn[ spaceName ] = function( value ) {

            // generate a cache for this space if it doesn't exist
            if ( to && !this[ cache ] ) {
                this[ cache ] = to( this._rgba );
            }
            if ( value === undefined ) {
                return this[ cache ].slice();
            }

            var ret,
                type = jQuery.type( value ),
                arr = ( type === "array" || type === "object" ) ? value : arguments,
                local = this[ cache ].slice();

            each( props, function( key, prop ) {
                var val = arr[ type === "object" ? key : prop.idx ];
                if ( val == null ) {
                    val = local[ prop.idx ];
                }
                local[ prop.idx ] = clamp( val, prop );
            } );

            if ( from ) {
                ret = color( from( local ) );
                ret[ cache ] = local;
                return ret;
            } else {
                return color( local );
            }
        };

        // makes red() green() blue() alpha() hue() saturation() lightness()
        each( props, function( key, prop ) {

            // alpha is included in more than one space
            if ( color.fn[ key ] ) {
                return;
            }
            color.fn[ key ] = function( value ) {
                var local, cur, match, fn,
                    vtype = jQuery.type( value );

                if ( key === "alpha" ) {
                    fn = this._hsla ? "hsla" : "rgba";
                } else {
                    fn = spaceName;
                }
                local = this[ fn ]();
                cur = local[ prop.idx ];

                if ( vtype === "undefined" ) {
                    return cur;
                }

                if ( vtype === "function" ) {
                    value = value.call( this, cur );
                    vtype = jQuery.type( value );
                }
                if ( value == null && prop.empty ) {
                    return this;
                }
                if ( vtype === "string" ) {
                    match = rplusequals.exec( value );
                    if ( match ) {
                        value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] === "+" ? 1 : -1 );
                    }
                }
                local[ prop.idx ] = value;
                return this[ fn ]( local );
            };
        } );
    } );

// add cssHook and .fx.step function for each named hook.
// accept a space separated string of properties
    color.hook = function( hook ) {
        var hooks = hook.split( " " );
        each( hooks, function( i, hook ) {
            jQuery.cssHooks[ hook ] = {
                set: function( elem, value ) {
                    var parsed;

                    if ( value !== "transparent" && ( jQuery.type( value ) !== "string" || ( parsed = stringParse( value ) ) ) ) {
                        value = color( parsed || value );
                        value = value.toRgbaString();
                    }
                    elem.style[ hook ] = value;
                }
            };
            jQuery.fx.step[ hook ] = function( fx ) {
                if ( !fx.colorInit ) {
                    fx.start = color( fx.elem, hook );
                    fx.end = color( fx.end );
                    fx.colorInit = true;
                }
                jQuery.cssHooks[ hook ].set( fx.elem, fx.start.transition( fx.end, fx.pos ) );
            };
        } );

    };

    color.hook( stepHooks );

    jQuery.cssHooks.borderColor = {
        expand: function( value ) {
            var expanded = {};

            each( [ "Top", "Right", "Bottom", "Left" ], function( i, part ) {
                expanded[ "border" + part + "Color" ] = value;
            } );
            return expanded;
        }
    };

// Basic color names only.
// Usage of any of the other color names requires adding yourself or including
// jquery.color.svg-names.js.
    colors = jQuery.Color.names = {

        // 4.1. Basic color keywords
        aqua: "#00ffff",
        black: "#000000",
        blue: "#0000ff",
        fuchsia: "#ff00ff",
        gray: "#808080",
        green: "#008000",
        lime: "#00ff00",
        maroon: "#800000",
        navy: "#000080",
        olive: "#808000",
        purple: "#800080",
        red: "#ff0000",
        silver: "#c0c0c0",
        teal: "#008080",
        white: "#ffffff",
        yellow: "#ffff00",

        // 4.2.3. "transparent" color keyword
        transparent: [ null, null, null, 0 ],

        _default: "#ffffff"
    };

} );;/*! jCarousel - v0.3.4 - 2015-09-23
* http://sorgalla.com/jcarousel/
* Copyright (c) 2006-2015 Jan Sorgalla; Licensed MIT */
(function($) {
    'use strict';

    var jCarousel = $.jCarousel = {};

    jCarousel.version = '0.3.4';

    var rRelativeTarget = /^([+\-]=)?(.+)$/;

    jCarousel.parseTarget = function(target) {
        var relative = false,
            parts    = typeof target !== 'object' ?
                           rRelativeTarget.exec(target) :
                           null;

        if (parts) {
            target = parseInt(parts[2], 10) || 0;

            if (parts[1]) {
                relative = true;
                if (parts[1] === '-=') {
                    target *= -1;
                }
            }
        } else if (typeof target !== 'object') {
            target = parseInt(target, 10) || 0;
        }

        return {
            target: target,
            relative: relative
        };
    };

    jCarousel.detectCarousel = function(element) {
        var carousel;

        while (element.length > 0) {
            carousel = element.filter('[data-jcarousel]');

            if (carousel.length > 0) {
                return carousel;
            }

            carousel = element.find('[data-jcarousel]');

            if (carousel.length > 0) {
                return carousel;
            }

            element = element.parent();
        }

        return null;
    };

    jCarousel.base = function(pluginName) {
        return {
            version:  jCarousel.version,
            _options:  {},
            _element:  null,
            _carousel: null,
            _init:     $.noop,
            _create:   $.noop,
            _destroy:  $.noop,
            _reload:   $.noop,
            create: function() {
                this._element
                    .attr('data-' + pluginName.toLowerCase(), true)
                    .data(pluginName, this);

                if (false === this._trigger('create')) {
                    return this;
                }

                this._create();

                this._trigger('createend');

                return this;
            },
            destroy: function() {
                if (false === this._trigger('destroy')) {
                    return this;
                }

                this._destroy();

                this._trigger('destroyend');

                this._element
                    .removeData(pluginName)
                    .removeAttr('data-' + pluginName.toLowerCase());

                return this;
            },
            reload: function(options) {
                if (false === this._trigger('reload')) {
                    return this;
                }

                if (options) {
                    this.options(options);
                }

                this._reload();

                this._trigger('reloadend');

                return this;
            },
            element: function() {
                return this._element;
            },
            options: function(key, value) {
                if (arguments.length === 0) {
                    return $.extend({}, this._options);
                }

                if (typeof key === 'string') {
                    if (typeof value === 'undefined') {
                        return typeof this._options[key] === 'undefined' ?
                                null :
                                this._options[key];
                    }

                    this._options[key] = value;
                } else {
                    this._options = $.extend({}, this._options, key);
                }

                return this;
            },
            carousel: function() {
                if (!this._carousel) {
                    this._carousel = jCarousel.detectCarousel(this.options('carousel') || this._element);

                    if (!this._carousel) {
                        $.error('Could not detect carousel for plugin "' + pluginName + '"');
                    }
                }

                return this._carousel;
            },
            _trigger: function(type, element, data) {
                var event,
                    defaultPrevented = false;

                data = [this].concat(data || []);

                (element || this._element).each(function() {
                    event = $.Event((pluginName + ':' + type).toLowerCase());

                    $(this).trigger(event, data);

                    if (event.isDefaultPrevented()) {
                        defaultPrevented = true;
                    }
                });

                return !defaultPrevented;
            }
        };
    };

    jCarousel.plugin = function(pluginName, pluginPrototype) {
        var Plugin = $[pluginName] = function(element, options) {
            this._element = $(element);
            this.options(options);

            this._init();
            this.create();
        };

        Plugin.fn = Plugin.prototype = $.extend(
            {},
            jCarousel.base(pluginName),
            pluginPrototype
        );

        $.fn[pluginName] = function(options) {
            var args        = Array.prototype.slice.call(arguments, 1),
                returnValue = this;

            if (typeof options === 'string') {
                this.each(function() {
                    var instance = $(this).data(pluginName);

                    if (!instance) {
                        return $.error(
                            'Cannot call methods on ' + pluginName + ' prior to initialization; ' +
                            'attempted to call method "' + options + '"'
                        );
                    }

                    if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
                        return $.error(
                            'No such method "' + options + '" for ' + pluginName + ' instance'
                        );
                    }

                    var methodValue = instance[options].apply(instance, args);

                    if (methodValue !== instance && typeof methodValue !== 'undefined') {
                        returnValue = methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function() {
                    var instance = $(this).data(pluginName);

                    if (instance instanceof Plugin) {
                        instance.reload(options);
                    } else {
                        new Plugin(this, options);
                    }
                });
            }

            return returnValue;
        };

        return Plugin;
    };
}(jQuery));

(function($, window) {
    'use strict';

    var toFloat = function(val) {
        return parseFloat(val) || 0;
    };

    $.jCarousel.plugin('jcarousel', {
        animating:   false,
        tail:        0,
        inTail:      false,
        resizeTimer: null,
        lt:          null,
        vertical:    false,
        rtl:         false,
        circular:    false,
        underflow:   false,
        relative:    false,

        _options: {
            list: function() {
                return this.element().children().eq(0);
            },
            items: function() {
                return this.list().children();
            },
            animation:   400,
            transitions: false,
            wrap:        null,
            vertical:    null,
            rtl:         null,
            center:      false
        },

        // Protected, don't access directly
        _list:         null,
        _items:        null,
        _target:       $(),
        _first:        $(),
        _last:         $(),
        _visible:      $(),
        _fullyvisible: $(),
        _init: function() {
            var self = this;

            this.onWindowResize = function() {
                if (self.resizeTimer) {
                    clearTimeout(self.resizeTimer);
                }

                self.resizeTimer = setTimeout(function() {
                    self.reload();
                }, 100);
            };

            return this;
        },
        _create: function() {
            this._reload();

            $(window).on('resize.jcarousel', this.onWindowResize);
        },
        _destroy: function() {
            $(window).off('resize.jcarousel', this.onWindowResize);
        },
        _reload: function() {
            this.vertical = this.options('vertical');

            if (this.vertical == null) {
                this.vertical = this.list().height() > this.list().width();
            }

            this.rtl = this.options('rtl');

            if (this.rtl == null) {
                this.rtl = (function(element) {
                    if (('' + element.attr('dir')).toLowerCase() === 'rtl') {
                        return true;
                    }

                    var found = false;

                    element.parents('[dir]').each(function() {
                        if ((/rtl/i).test($(this).attr('dir'))) {
                            found = true;
                            return false;
                        }
                    });

                    return found;
                }(this._element));
            }

            this.lt = this.vertical ? 'top' : 'left';

            // Ensure before closest() call
            this.relative = this.list().css('position') === 'relative';

            // Force list and items reload
            this._list  = null;
            this._items = null;

            var item = this.index(this._target) >= 0 ?
                           this._target :
                           this.closest();

            // _prepare() needs this here
            this.circular  = this.options('wrap') === 'circular';
            this.underflow = false;

            var props = {'left': 0, 'top': 0};

            if (item.length > 0) {
                this._prepare(item);
                this.list().find('[data-jcarousel-clone]').remove();

                // Force items reload
                this._items = null;

                this.underflow = this._fullyvisible.length >= this.items().length;
                this.circular  = this.circular && !this.underflow;

                props[this.lt] = this._position(item) + 'px';
            }

            this.move(props);

            return this;
        },
        list: function() {
            if (this._list === null) {
                var option = this.options('list');
                this._list = $.isFunction(option) ? option.call(this) : this._element.find(option);
            }

            return this._list;
        },
        items: function() {
            if (this._items === null) {
                var option = this.options('items');
                this._items = ($.isFunction(option) ? option.call(this) : this.list().find(option)).not('[data-jcarousel-clone]');
            }

            return this._items;
        },
        index: function(item) {
            return this.items().index(item);
        },
        closest: function() {
            var self    = this,
                pos     = this.list().position()[this.lt],
                closest = $(), // Ensure we're returning a jQuery instance
                stop    = false,
                lrb     = this.vertical ? 'bottom' : (this.rtl && !this.relative ? 'left' : 'right'),
                width;

            if (this.rtl && this.relative && !this.vertical) {
                pos += this.list().width() - this.clipping();
            }

            this.items().each(function() {
                closest = $(this);

                if (stop) {
                    return false;
                }

                var dim = self.dimension(closest);

                pos += dim;

                if (pos >= 0) {
                    width = dim - toFloat(closest.css('margin-' + lrb));

                    if ((Math.abs(pos) - dim + (width / 2)) <= 0) {
                        stop = true;
                    } else {
                        return false;
                    }
                }
            });


            return closest;
        },
        target: function() {
            return this._target;
        },
        first: function() {
            return this._first;
        },
        last: function() {
            return this._last;
        },
        visible: function() {
            return this._visible;
        },
        fullyvisible: function() {
            return this._fullyvisible;
        },
        hasNext: function() {
            if (false === this._trigger('hasnext')) {
                return true;
            }

            var wrap = this.options('wrap'),
                end = this.items().length - 1,
                check = this.options('center') ? this._target : this._last;

            return end >= 0 && !this.underflow &&
                ((wrap && wrap !== 'first') ||
                    (this.index(check) < end) ||
                    (this.tail && !this.inTail)) ? true : false;
        },
        hasPrev: function() {
            if (false === this._trigger('hasprev')) {
                return true;
            }

            var wrap = this.options('wrap');

            return this.items().length > 0 && !this.underflow &&
                ((wrap && wrap !== 'last') ||
                    (this.index(this._first) > 0) ||
                    (this.tail && this.inTail)) ? true : false;
        },
        clipping: function() {
            return this._element['inner' + (this.vertical ? 'Height' : 'Width')]();
        },
        dimension: function(element) {
            return element['outer' + (this.vertical ? 'Height' : 'Width')](true);
        },
        scroll: function(target, animate, callback) {
            if (this.animating) {
                return this;
            }

            if (false === this._trigger('scroll', null, [target, animate])) {
                return this;
            }

            if ($.isFunction(animate)) {
                callback = animate;
                animate  = true;
            }

            var parsed = $.jCarousel.parseTarget(target);

            if (parsed.relative) {
                var end    = this.items().length - 1,
                    scroll = Math.abs(parsed.target),
                    wrap   = this.options('wrap'),
                    current,
                    first,
                    index,
                    start,
                    curr,
                    isVisible,
                    props,
                    i;

                if (parsed.target > 0) {
                    var last = this.index(this._last);

                    if (last >= end && this.tail) {
                        if (!this.inTail) {
                            this._scrollTail(animate, callback);
                        } else {
                            if (wrap === 'both' || wrap === 'last') {
                                this._scroll(0, animate, callback);
                            } else {
                                if ($.isFunction(callback)) {
                                    callback.call(this, false);
                                }
                            }
                        }
                    } else {
                        current = this.index(this._target);

                        if ((this.underflow && current === end && (wrap === 'circular' || wrap === 'both' || wrap === 'last')) ||
                            (!this.underflow && last === end && (wrap === 'both' || wrap === 'last'))) {
                            this._scroll(0, animate, callback);
                        } else {
                            index = current + scroll;

                            if (this.circular && index > end) {
                                i = end;
                                curr = this.items().get(-1);

                                while (i++ < index) {
                                    curr = this.items().eq(0);
                                    isVisible = this._visible.index(curr) >= 0;

                                    if (isVisible) {
                                        curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                                    }

                                    this.list().append(curr);

                                    if (!isVisible) {
                                        props = {};
                                        props[this.lt] = this.dimension(curr);
                                        this.moveBy(props);
                                    }

                                    // Force items reload
                                    this._items = null;
                                }

                                this._scroll(curr, animate, callback);
                            } else {
                                this._scroll(Math.min(index, end), animate, callback);
                            }
                        }
                    }
                } else {
                    if (this.inTail) {
                        this._scroll(Math.max((this.index(this._first) - scroll) + 1, 0), animate, callback);
                    } else {
                        first  = this.index(this._first);
                        current = this.index(this._target);
                        start  = this.underflow ? current : first;
                        index  = start - scroll;

                        if (start <= 0 && ((this.underflow && wrap === 'circular') || wrap === 'both' || wrap === 'first')) {
                            this._scroll(end, animate, callback);
                        } else {
                            if (this.circular && index < 0) {
                                i    = index;
                                curr = this.items().get(0);

                                while (i++ < 0) {
                                    curr = this.items().eq(-1);
                                    isVisible = this._visible.index(curr) >= 0;

                                    if (isVisible) {
                                        curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                                    }

                                    this.list().prepend(curr);

                                    // Force items reload
                                    this._items = null;

                                    var dim = this.dimension(curr);

                                    props = {};
                                    props[this.lt] = -dim;
                                    this.moveBy(props);

                                }

                                this._scroll(curr, animate, callback);
                            } else {
                                this._scroll(Math.max(index, 0), animate, callback);
                            }
                        }
                    }
                }
            } else {
                this._scroll(parsed.target, animate, callback);
            }

            this._trigger('scrollend');

            return this;
        },
        moveBy: function(properties, opts) {
            var position = this.list().position(),
                multiplier = 1,
                correction = 0;

            if (this.rtl && !this.vertical) {
                multiplier = -1;

                if (this.relative) {
                    correction = this.list().width() - this.clipping();
                }
            }

            if (properties.left) {
                properties.left = (position.left + correction + toFloat(properties.left) * multiplier) + 'px';
            }

            if (properties.top) {
                properties.top = (position.top + correction + toFloat(properties.top) * multiplier) + 'px';
            }

            return this.move(properties, opts);
        },
        move: function(properties, opts) {
            opts = opts || {};

            var option       = this.options('transitions'),
                transitions  = !!option,
                transforms   = !!option.transforms,
                transforms3d = !!option.transforms3d,
                duration     = opts.duration || 0,
                list         = this.list();

            if (!transitions && duration > 0) {
                list.animate(properties, opts);
                return;
            }

            var complete = opts.complete || $.noop,
                css = {};

            if (transitions) {
                var backup = {
                        transitionDuration: list.css('transitionDuration'),
                        transitionTimingFunction: list.css('transitionTimingFunction'),
                        transitionProperty: list.css('transitionProperty')
                    },
                    oldComplete = complete;

                complete = function() {
                    $(this).css(backup);
                    oldComplete.call(this);
                };
                css = {
                    transitionDuration: (duration > 0 ? duration / 1000 : 0) + 's',
                    transitionTimingFunction: option.easing || opts.easing,
                    transitionProperty: duration > 0 ? (function() {
                        if (transforms || transforms3d) {
                            // We have to use 'all' because jQuery doesn't prefix
                            // css values, like transition-property: transform;
                            return 'all';
                        }

                        return properties.left ? 'left' : 'top';
                    })() : 'none',
                    transform: 'none'
                };
            }

            if (transforms3d) {
                css.transform = 'translate3d(' + (properties.left || 0) + ',' + (properties.top || 0) + ',0)';
            } else if (transforms) {
                css.transform = 'translate(' + (properties.left || 0) + ',' + (properties.top || 0) + ')';
            } else {
                $.extend(css, properties);
            }

            if (transitions && duration > 0) {
                list.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', complete);
            }

            list.css(css);

            if (duration <= 0) {
                list.each(function() {
                    complete.call(this);
                });
            }
        },
        _scroll: function(item, animate, callback) {
            if (this.animating) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            if (typeof item !== 'object') {
                item = this.items().eq(item);
            } else if (typeof item.jquery === 'undefined') {
                item = $(item);
            }

            if (item.length === 0) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            this.inTail = false;

            this._prepare(item);

            var pos     = this._position(item),
                currPos = this.list().position()[this.lt];

            if (pos === currPos) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            var properties = {};
            properties[this.lt] = pos + 'px';

            this._animate(properties, animate, callback);

            return this;
        },
        _scrollTail: function(animate, callback) {
            if (this.animating || !this.tail) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            var pos = this.list().position()[this.lt];

            if (this.rtl && this.relative && !this.vertical) {
                pos += this.list().width() - this.clipping();
            }

            if (this.rtl && !this.vertical) {
                pos += this.tail;
            } else {
                pos -= this.tail;
            }

            this.inTail = true;

            var properties = {};
            properties[this.lt] = pos + 'px';

            this._update({
                target:       this._target.next(),
                fullyvisible: this._fullyvisible.slice(1).add(this._visible.last())
            });

            this._animate(properties, animate, callback);

            return this;
        },
        _animate: function(properties, animate, callback) {
            callback = callback || $.noop;

            if (false === this._trigger('animate')) {
                callback.call(this, false);
                return this;
            }

            this.animating = true;

            var animation = this.options('animation'),
                complete  = $.proxy(function() {
                    this.animating = false;

                    var c = this.list().find('[data-jcarousel-clone]');

                    if (c.length > 0) {
                        c.remove();
                        this._reload();
                    }

                    this._trigger('animateend');

                    callback.call(this, true);
                }, this);

            var opts = typeof animation === 'object' ?
                           $.extend({}, animation) :
                           {duration: animation},
                oldComplete = opts.complete || $.noop;

            if (animate === false) {
                opts.duration = 0;
            } else if (typeof $.fx.speeds[opts.duration] !== 'undefined') {
                opts.duration = $.fx.speeds[opts.duration];
            }

            opts.complete = function() {
                complete();
                oldComplete.call(this);
            };

            this.move(properties, opts);

            return this;
        },
        _prepare: function(item) {
            var index  = this.index(item),
                idx    = index,
                wh     = this.dimension(item),
                clip   = this.clipping(),
                lrb    = this.vertical ? 'bottom' : (this.rtl ? 'left'  : 'right'),
                center = this.options('center'),
                update = {
                    target:       item,
                    first:        item,
                    last:         item,
                    visible:      item,
                    fullyvisible: wh <= clip ? item : $()
                },
                curr,
                isVisible,
                margin,
                dim;

            if (center) {
                wh /= 2;
                clip /= 2;
            }

            if (wh < clip) {
                while (true) {
                    curr = this.items().eq(++idx);

                    if (curr.length === 0) {
                        if (!this.circular) {
                            break;
                        }

                        curr = this.items().eq(0);

                        if (item.get(0) === curr.get(0)) {
                            break;
                        }

                        isVisible = this._visible.index(curr) >= 0;

                        if (isVisible) {
                            curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                        }

                        this.list().append(curr);

                        if (!isVisible) {
                            var props = {};
                            props[this.lt] = this.dimension(curr);
                            this.moveBy(props);
                        }

                        // Force items reload
                        this._items = null;
                    }

                    dim = this.dimension(curr);

                    if (dim === 0) {
                        break;
                    }

                    wh += dim;

                    update.last    = curr;
                    update.visible = update.visible.add(curr);

                    // Remove right/bottom margin from total width
                    margin = toFloat(curr.css('margin-' + lrb));

                    if ((wh - margin) <= clip) {
                        update.fullyvisible = update.fullyvisible.add(curr);
                    }

                    if (wh >= clip) {
                        break;
                    }
                }
            }

            if (!this.circular && !center && wh < clip) {
                idx = index;

                while (true) {
                    if (--idx < 0) {
                        break;
                    }

                    curr = this.items().eq(idx);

                    if (curr.length === 0) {
                        break;
                    }

                    dim = this.dimension(curr);

                    if (dim === 0) {
                        break;
                    }

                    wh += dim;

                    update.first   = curr;
                    update.visible = update.visible.add(curr);

                    // Remove right/bottom margin from total width
                    margin = toFloat(curr.css('margin-' + lrb));

                    if ((wh - margin) <= clip) {
                        update.fullyvisible = update.fullyvisible.add(curr);
                    }

                    if (wh >= clip) {
                        break;
                    }
                }
            }

            this._update(update);

            this.tail = 0;

            if (!center &&
                this.options('wrap') !== 'circular' &&
                this.options('wrap') !== 'custom' &&
                this.index(update.last) === (this.items().length - 1)) {

                // Remove right/bottom margin from total width
                wh -= toFloat(update.last.css('margin-' + lrb));

                if (wh > clip) {
                    this.tail = wh - clip;
                }
            }

            return this;
        },
        _position: function(item) {
            var first  = this._first,
                pos    = first.position()[this.lt],
                center = this.options('center'),
                centerOffset = center ? (this.clipping() / 2) - (this.dimension(first) / 2) : 0;

            if (this.rtl && !this.vertical) {
                if (this.relative) {
                    pos -= this.list().width() - this.dimension(first);
                } else {
                    pos -= this.clipping() - this.dimension(first);
                }

                pos += centerOffset;
            } else {
                pos -= centerOffset;
            }

            if (!center &&
                (this.index(item) > this.index(first) || this.inTail) &&
                this.tail) {
                pos = this.rtl && !this.vertical ? pos - this.tail : pos + this.tail;
                this.inTail = true;
            } else {
                this.inTail = false;
            }

            return -pos;
        },
        _update: function(update) {
            var self = this,
                current = {
                    target:       this._target,
                    first:        this._first,
                    last:         this._last,
                    visible:      this._visible,
                    fullyvisible: this._fullyvisible
                },
                back = this.index(update.first || current.first) < this.index(current.first),
                key,
                doUpdate = function(key) {
                    var elIn  = [],
                        elOut = [];

                    update[key].each(function() {
                        if (current[key].index(this) < 0) {
                            elIn.push(this);
                        }
                    });

                    current[key].each(function() {
                        if (update[key].index(this) < 0) {
                            elOut.push(this);
                        }
                    });

                    if (back) {
                        elIn = elIn.reverse();
                    } else {
                        elOut = elOut.reverse();
                    }

                    self._trigger(key + 'in', $(elIn));
                    self._trigger(key + 'out', $(elOut));

                    self['_' + key] = update[key];
                };

            for (key in update) {
                doUpdate(key);
            }

            return this;
        }
    });
}(jQuery, window));

(function($) {
    'use strict';

    $.jcarousel.fn.scrollIntoView = function(target, animate, callback) {
        var parsed = $.jCarousel.parseTarget(target),
            first  = this.index(this._fullyvisible.first()),
            last   = this.index(this._fullyvisible.last()),
            index;

        if (parsed.relative) {
            index = parsed.target < 0 ? Math.max(0, first + parsed.target) : last + parsed.target;
        } else {
            index = typeof parsed.target !== 'object' ? parsed.target : this.index(parsed.target);
        }

        if (index < first) {
            return this.scroll(index, animate, callback);
        }

        if (index >= first && index <= last) {
            if ($.isFunction(callback)) {
                callback.call(this, false);
            }

            return this;
        }

        var items = this.items(),
            clip = this.clipping(),
            lrb  = this.vertical ? 'bottom' : (this.rtl ? 'left'  : 'right'),
            wh   = 0,
            curr;

        while (true) {
            curr = items.eq(index);

            if (curr.length === 0) {
                break;
            }

            wh += this.dimension(curr);

            if (wh >= clip) {
                var margin = parseFloat(curr.css('margin-' + lrb)) || 0;
                if ((wh - margin) !== clip) {
                    index++;
                }
                break;
            }

            if (index <= 0) {
                break;
            }

            index--;
        }

        return this.scroll(index, animate, callback);
    };
}(jQuery));

(function($) {
    'use strict';

    $.jCarousel.plugin('jcarouselControl', {
        _options: {
            target: '+=1',
            event:  'click',
            method: 'scroll'
        },
        _active: null,
        _init: function() {
            this.onDestroy = $.proxy(function() {
                this._destroy();
                this.carousel()
                    .one('jcarousel:createend', $.proxy(this._create, this));
            }, this);
            this.onReload = $.proxy(this._reload, this);
            this.onEvent = $.proxy(function(e) {
                e.preventDefault();

                var method = this.options('method');

                if ($.isFunction(method)) {
                    method.call(this);
                } else {
                    this.carousel()
                        .jcarousel(this.options('method'), this.options('target'));
                }
            }, this);
        },
        _create: function() {
            this.carousel()
                .one('jcarousel:destroy', this.onDestroy)
                .on('jcarousel:reloadend jcarousel:scrollend', this.onReload);

            this._element
                .on(this.options('event') + '.jcarouselcontrol', this.onEvent);

            this._reload();
        },
        _destroy: function() {
            this._element
                .off('.jcarouselcontrol', this.onEvent);

            this.carousel()
                .off('jcarousel:destroy', this.onDestroy)
                .off('jcarousel:reloadend jcarousel:scrollend', this.onReload);
        },
        _reload: function() {
            var parsed   = $.jCarousel.parseTarget(this.options('target')),
                carousel = this.carousel(),
                active;

            if (parsed.relative) {
                active = carousel
                    .jcarousel(parsed.target > 0 ? 'hasNext' : 'hasPrev');
            } else {
                var target = typeof parsed.target !== 'object' ?
                                carousel.jcarousel('items').eq(parsed.target) :
                                parsed.target;

                active = carousel.jcarousel('target').index(target) >= 0;
            }

            if (this._active !== active) {
                this._trigger(active ? 'active' : 'inactive');
                this._active = active;
            }

            return this;
        }
    });
}(jQuery));

(function($) {
    'use strict';

    $.jCarousel.plugin('jcarouselPagination', {
        _options: {
            perPage: null,
            item: function(page) {
                return '<a href="#' + page + '">' + page + '</a>';
            },
            event:  'click',
            method: 'scroll'
        },
        _carouselItems: null,
        _pages: {},
        _items: {},
        _currentPage: null,
        _init: function() {
            this.onDestroy = $.proxy(function() {
                this._destroy();
                this.carousel()
                    .one('jcarousel:createend', $.proxy(this._create, this));
            }, this);
            this.onReload = $.proxy(this._reload, this);
            this.onScroll = $.proxy(this._update, this);
        },
        _create: function() {
            this.carousel()
                .one('jcarousel:destroy', this.onDestroy)
                .on('jcarousel:reloadend', this.onReload)
                .on('jcarousel:scrollend', this.onScroll);

            this._reload();
        },
        _destroy: function() {
            this._clear();

            this.carousel()
                .off('jcarousel:destroy', this.onDestroy)
                .off('jcarousel:reloadend', this.onReload)
                .off('jcarousel:scrollend', this.onScroll);

            this._carouselItems = null;
        },
        _reload: function() {
            var perPage = this.options('perPage');

            this._pages = {};
            this._items = {};

            // Calculate pages
            if ($.isFunction(perPage)) {
                perPage = perPage.call(this);
            }

            if (perPage == null) {
                this._pages = this._calculatePages();
            } else {
                var pp    = parseInt(perPage, 10) || 0,
                    items = this._getCarouselItems(),
                    page  = 1,
                    i     = 0,
                    curr;

                while (true) {
                    curr = items.eq(i++);

                    if (curr.length === 0) {
                        break;
                    }

                    if (!this._pages[page]) {
                        this._pages[page] = curr;
                    } else {
                        this._pages[page] = this._pages[page].add(curr);
                    }

                    if (i % pp === 0) {
                        page++;
                    }
                }
            }

            this._clear();

            var self     = this,
                carousel = this.carousel().data('jcarousel'),
                element  = this._element,
                item     = this.options('item'),
                numCarouselItems = this._getCarouselItems().length;

            $.each(this._pages, function(page, carouselItems) {
                var currItem = self._items[page] = $(item.call(self, page, carouselItems));

                currItem.on(self.options('event') + '.jcarouselpagination', $.proxy(function() {
                    var target = carouselItems.eq(0);

                    // If circular wrapping enabled, ensure correct scrolling direction
                    if (carousel.circular) {
                        var currentIndex = carousel.index(carousel.target()),
                            newIndex     = carousel.index(target);

                        if (parseFloat(page) > parseFloat(self._currentPage)) {
                            if (newIndex < currentIndex) {
                                target = '+=' + (numCarouselItems - currentIndex + newIndex);
                            }
                        } else {
                            if (newIndex > currentIndex) {
                                target = '-=' + (currentIndex + (numCarouselItems - newIndex));
                            }
                        }
                    }

                    carousel[this.options('method')](target);
                }, self));

                element.append(currItem);
            });

            this._update();
        },
        _update: function() {
            var target = this.carousel().jcarousel('target'),
                currentPage;

            $.each(this._pages, function(page, carouselItems) {
                carouselItems.each(function() {
                    if (target.is(this)) {
                        currentPage = page;
                        return false;
                    }
                });

                if (currentPage) {
                    return false;
                }
            });

            if (this._currentPage !== currentPage) {
                this._trigger('inactive', this._items[this._currentPage]);
                this._trigger('active', this._items[currentPage]);
            }

            this._currentPage = currentPage;
        },
        items: function() {
            return this._items;
        },
        reloadCarouselItems: function() {
            this._carouselItems = null;
            return this;
        },
        _clear: function() {
            this._element.empty();
            this._currentPage = null;
        },
        _calculatePages: function() {
            var carousel = this.carousel().data('jcarousel'),
                items    = this._getCarouselItems(),
                clip     = carousel.clipping(),
                wh       = 0,
                idx      = 0,
                page     = 1,
                pages    = {},
                curr,
                dim;

            while (true) {
                curr = items.eq(idx++);

                if (curr.length === 0) {
                    break;
                }

                dim = carousel.dimension(curr);

                if ((wh + dim) > clip) {
                    page++;
                    wh = 0;
                }

                wh += dim;

                if (!pages[page]) {
                    pages[page] = curr;
                } else {
                    pages[page] = pages[page].add(curr);
                }
            }

            return pages;
        },
        _getCarouselItems: function() {
            if (!this._carouselItems) {
                this._carouselItems = this.carousel().jcarousel('items');
            }

            return this._carouselItems;
        }
    });
}(jQuery));

(function($, document) {
    'use strict';

    var hiddenProp,
        visibilityChangeEvent,
        visibilityChangeEventNames = {
            hidden: 'visibilitychange',
            mozHidden: 'mozvisibilitychange',
            msHidden: 'msvisibilitychange',
            webkitHidden: 'webkitvisibilitychange'
        }
    ;

    $.each(visibilityChangeEventNames, function(key, val) {
        if (typeof document[key] !== 'undefined') {
            hiddenProp = key;
            visibilityChangeEvent = val;
            return false;
        }
    });

    $.jCarousel.plugin('jcarouselAutoscroll', {
        _options: {
            target:    '+=1',
            interval:  3000,
            autostart: true
        },
        _timer: null,
        _started: false,
        _init: function () {
            this.onDestroy = $.proxy(function() {
                this._destroy();
                this.carousel()
                    .one('jcarousel:createend', $.proxy(this._create, this));
            }, this);

            this.onAnimateEnd = $.proxy(this._start, this);

            this.onVisibilityChange = $.proxy(function() {
                if (document[hiddenProp]) {
                    this._stop();
                } else {
                    this._start();
                }
            }, this);
        },
        _create: function() {
            this.carousel()
                .one('jcarousel:destroy', this.onDestroy);

            $(document)
                .on(visibilityChangeEvent, this.onVisibilityChange);

            if (this.options('autostart')) {
                this.start();
            }
        },
        _destroy: function() {
            this._stop();

            this.carousel()
                .off('jcarousel:destroy', this.onDestroy);

            $(document)
                .off(visibilityChangeEvent, this.onVisibilityChange);
        },
        _start: function() {
            this._stop();

            if (!this._started) {
                return;
            }

            this.carousel()
                .one('jcarousel:animateend', this.onAnimateEnd);

            this._timer = setTimeout($.proxy(function() {
                this.carousel().jcarousel('scroll', this.options('target'));
            }, this), this.options('interval'));

            return this;
        },
        _stop: function() {
            if (this._timer) {
                this._timer = clearTimeout(this._timer);
            }

            this.carousel()
                .off('jcarousel:animateend', this.onAnimateEnd);

            return this;
        },
        start: function() {
            this._started = true;
            this._start();

            return this;
        },
        stop: function() {
            this._started = false;
            this._stop();

            return this;
        }
    });
}(jQuery, document));;/*!
 * jQuery Pretty Dropdowns Plugin v3.1.3 by T. H. Doan (http://thdoan.github.io/pretty-dropdowns/)
 *
 * jQuery Pretty Dropdowns by T. H. Doan is licensed under the MIT License.
 * Read a copy of the license in the LICENSE file or at
 * http://choosealicense.com/licenses/mit
 */

(function($) {
  $.fn.prettyDropdown = function(oOptions) {
    // Default options
    oOptions = $.extend({
      customClass: 'arrow',
      height: 50,
      hoverIntent: 200
    }, oOptions);
    var nHoverIndex,
      nLastIndex,
      nTimer,
      aKeys = [
        '0','1','2','3','4','5','6','7','8','9',,,,,,,,
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
      ],
      $current,
      handleKeypress = function(e) {
        var $dropdown = $('.prettydropdown > ul.active'),
          nItemsHeight = $dropdown.height()/(oOptions.height-2),
          nItemsPerPage = nItemsHeight%1<0.5 ? Math.floor(nItemsHeight) : Math.ceil(nItemsHeight),
          sKey;
        if (!$dropdown.length) return;
        e.preventDefault();
        e.stopPropagation();
        nHoverIndex = $dropdown.children('li.hover').index();
        nLastIndex = $dropdown.children().length-1;
        $current = $dropdown.children().eq(nHoverIndex);
        $dropdown.data('lastKeypress', +new Date());
        switch (e.which) {
          case 13: // Enter
            $current.click();
            return;
          case 27: // Esc
            resetDropdown($dropdown[0]);
            return;
          case 32: // Space
            sKey = ' ';
            break;
          case 33: // Page Up
            toggleHover($current, 0);
            toggleHover($dropdown.children().eq(Math.max(nHoverIndex-nItemsPerPage-1, 0)), 1);
            return;
          case 34: // Page Down
            toggleHover($current, 0);
            toggleHover($dropdown.children().eq(Math.min(nHoverIndex+nItemsPerPage-1, nLastIndex)), 1);
            return;
          case 35: // End
            toggleHover($current, 0);
            toggleHover($dropdown.children().eq(nLastIndex), 1);
            return;
          case 36: // Home
            toggleHover($current, 0);
            toggleHover($dropdown.children().eq(0), 1);
            return;
          case 38: // Up
            toggleHover($current, 0);
            // If not already key-navigated or first item is selected, cycle to the last item;
            // else select the previous item
            toggleHover(nHoverIndex ? $dropdown.children().eq(nHoverIndex-1) : $dropdown.children().eq(nLastIndex), 1);
            return;
          case 40: // Down
            toggleHover($current, 0);
            // If last item is selected, cycle to the first item;
            // else select the next item
            toggleHover(nHoverIndex===nLastIndex ? $dropdown.children().eq(0) : $dropdown.children().eq(nHoverIndex+1), 1);
            return;
          default:
            sKey = aKeys[e.which-48];
        }
        if (sKey) { // Alphanumeric key pressed
          clearTimeout(nTimer);
          $dropdown.data('keysPressed', $dropdown.data('keysPressed')===undefined ? sKey : $dropdown.data('keysPressed') + sKey);
          nTimer = setTimeout(function() {
            $dropdown.removeData('keysPressed');
          }, 300);
          // Build index of matches
          var aMatches = [],
            nCurrentIndex = $current.index(),
            $items = $dropdown.children();
          $items.each(function(nIndex) {
            if ($(this).text().toLowerCase().indexOf($dropdown.data('keysPressed'))===0) aMatches.push(nIndex);
          });
          if (aMatches.length) {
            // Cycle through items matching key(s) pressed
            for (var i=0; i<aMatches.length; ++i) {
              if (aMatches[i]>nCurrentIndex) {
                toggleHover($items, 0);
                toggleHover($items.eq(aMatches[i]), 1);
                break;
              }
              if (i===aMatches.length-1) {
                toggleHover($items, 0);
                toggleHover($items.eq(aMatches[0]), 1);
              }
            }
          }
        }
      },
      resetDropdown = function(o) {
        var $dropdown = $(o.currentTarget||o);
        $dropdown.data('hover', false);
        clearTimeout(nTimer);
        nTimer = setTimeout(function() {
          if (!$dropdown.data('hover')) {
            if ($dropdown.hasClass('reverse')) $dropdown.prepend($dropdown.children('li:last-child'));
            $dropdown.removeClass('active changing reverse').css('height', '');
            $dropdown.children().removeClass('hover nohover');
            $dropdown.removeData('clicked');
            $(window).off('keydown', handleKeypress);
          }
        }, (o.type==='mouseleave' && !$dropdown.data('clicked')) ? oOptions.hoverIntent : 0);
      },
      hoverDropdownItem = function(e) {
        var $dropdown = $(e.currentTarget);
        if (!$dropdown.hasClass('active') || new Date()-$dropdown.data('lastKeypress')<200) return;
        toggleHover($dropdown.children(), 0, 1);
        toggleHover($(e.target), 1, 1);
      },
      toggleHover = function($el, bOn, bNoScroll) {
        if (bOn) {
          $el.removeClass('nohover').addClass('hover');
          if ($el.length===1 && $current && !bNoScroll) {
            // Ensure items are always in view
            var $dropdown = $el.parent(),
              nDropdownHeight = $dropdown.outerHeight(),
              nItemOffset = $el.offset().top-$dropdown.offset().top-1; // -1px for top border
            if ($el.index()===0) {
              $dropdown.scrollTop(0);
            } else if ($el.index()===nLastIndex) {
              $dropdown.scrollTop($dropdown.children().length*oOptions.height);
            } else {
              if (nItemOffset+oOptions.height>nDropdownHeight) $dropdown.scrollTop($dropdown.scrollTop()+oOptions.height+nItemOffset-nDropdownHeight);
              else if (nItemOffset<0) $dropdown.scrollTop($dropdown.scrollTop()+nItemOffset);
            }
          }
        } else {
          $el.removeClass('hover').addClass('nohover');
        }
      };
    // Validate options
    if (isNaN(oOptions.height) || oOptions.height<8) oOptions.height = 8;
    if (isNaN(oOptions.hoverIntent) || oOptions.hoverIntent<0) oOptions.hoverIntent = 200;
    return this.each(function() {
      var $this = $(this);
      if ($this.data('loaded')) return true; // Continue
      $this.outerHeight(oOptions.height);
      // NOTE: $this.css('margin') returns empty string in Firefox.
      // See https://github.com/jquery/jquery/issues/3383
      var nWidth = $this.outerWidth(),
        // Height - 2px for borders
        sHtml = '<ul' + ($this.attr('title')?' title="'+$this.attr('title')+'"':'') + ' style="max-height:' + (oOptions.height-2) + 'px;margin:'
          + $this.css('margin-top') + ' '
          + $this.css('margin-right') + ' '
          + $this.css('margin-bottom') + ' '
          + $this.css('margin-left') + ';">',
        renderItem = function(el, sClass) {
          return '<li data-value="' + el.value + '"'
            + (el.title ? ' title="' + el.title + '"' : '')
            + (sClass ? ' class="' + sClass + '"' : '')
            + ((oOptions.height!==50) ? ' style="height:' + (oOptions.height-2) + 'px;line-height:' + (oOptions.height-2) + 'px"' : '')
            + '>' + el.text + '</li>';
        };
      $this.children('option:selected').each(function() {
        sHtml += renderItem(this, 'selected');
      });
      $this.children('option:not(:selected)').each(function() {
        sHtml += renderItem(this);
      });
      sHtml += '</ul>';
      $this.css('visibility', 'hidden').wrap('<div class="prettydropdown ' + oOptions.customClass + ' loading"></div>').before(sHtml).data('loaded', true);
      var $dropdown = $this.parent().children('ul'),
        nWidth = $dropdown.outerWidth(true),
        nOuterWidth;
      // Calculate width if initially hidden
      if ($dropdown.width()<=0) {
        var $clone = $dropdown.parent().clone().css({
            position: 'absolute',
            top: '-100%'
          });
        $('body').append($clone);
        nWidth = $clone.children('ul').outerWidth(true);
        $('li', $clone).width(nWidth);
        nOuterWidth = $clone.children('ul').outerWidth(true);
        $clone.remove();
      }
      // Set dropdown width and event handler
      // NOTE: Setting width using width(), then css() because width() only can
      // return a float, which can result in a missing right border when there
      // is a scrollbar.
      $dropdown.children('li').width(nWidth);
      $dropdown.children('li').css('width', $dropdown.children('li').css('width')).click(function() {
        var $li = $(this);
        // Only update if different value selected
        if ($dropdown.hasClass('active') && $li.data('value')!==$dropdown.children('li.selected').data('value')) {
          $dropdown.children('li.selected').removeClass('selected');
          $dropdown.prepend($li.addClass('selected')).removeClass('reverse');
          // Sync <select> element
          $this.children('option[value="' + $li.data('value') +'"]').prop('selected', true);
          $this.trigger('change');
        }
        $dropdown.toggleClass('active');
        // Try to keep drop-down menu within viewport
        if ($dropdown.hasClass('active')) {
          var nWinHeight = window.innerHeight,
            nOffsetTop = $dropdown.offset().top,
            nScrollTop = document.body.scrollTop,
            nDropdownHeight = $dropdown.outerHeight(),
            nDropdownBottom = nOffsetTop-nScrollTop+nDropdownHeight;
          if (nDropdownBottom>nWinHeight) {
            // Expand to direction that has the most space
            if (nOffsetTop-nScrollTop>nWinHeight-(nOffsetTop-nScrollTop+oOptions.height)) {
              $dropdown.addClass('reverse').append($dropdown.children('li.selected'));
              if (nOffsetTop-nScrollTop+oOptions.height<nDropdownHeight) {
                $dropdown.outerHeight(nOffsetTop-nScrollTop+oOptions.height);
                $dropdown.scrollTop(nDropdownHeight);
              }
            } else {
              $dropdown.height($dropdown.height()-(nDropdownBottom-nWinHeight));
            }
          }
          $(window).on('keydown', handleKeypress);
        } else {
          $dropdown.addClass('changing').data('clicked', true); // Prevent FOUC
          resetDropdown($dropdown[0]);
        }
      });
      $dropdown.on({
        mouseenter: function() {
          $dropdown.data('hover', true);
        },
        mouseleave: resetDropdown,
        mousemove:  hoverDropdownItem
      });
      // Done with everything!
      $dropdown.parent().width(nOuterWidth||$dropdown.outerWidth(true)).removeClass('loading');
    });
  };
}(jQuery));

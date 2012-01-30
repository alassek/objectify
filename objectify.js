/*!
 * Copyright (c) 2012 Lyconic, LLC.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/***
 * @namespace Convert form fields into nested hashes quickly and painlessly.
 ***/
var Objectify = (function ($) {
  var self;

  /***
   * Because javascript type-checking is something special.
   ***/
  function primitive ( obj ) {
    return Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1];
  }

  /***
   * Because `hasOwnProperty` can be overwritten.
   ***/
  function hasOwnProperty ( obj, key ) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  /***
   * The secret sauce, as it were. This is what inserts a value into the correct nesting.
   ***/
  function normalize ( key, value, params ) {
    var isArrayValue = key.match( /\[\]$/ ),
        namespace    = self.unpack( key ),
        p = params, k;

    do {
      k = namespace.shift();
      if ( namespace.length > 0 ) {
        p[ k ] || (p[ k ] = {});
        p = p[ k ];
      }
    } while ( namespace.length > 0 );

    if ( isArrayValue ) {
      p[ k ] || (p[ k ] = []);
      if ( !p[ k ].push ) throw("Expected array, got " + typeof(p[k]) + " instead.");
      p[ k ].push( value );
    } else {
      p[ k ] = value;
    }

    return params;
  }

  return self = {
    /***
     * This is the method that does the heavy lifting.
     *
     * @method convert(<selection>)
     * @param selection can be a jQuery selector string, a jQuery instance, or a plain object.
     * @returns {Object}
     * @example
     *
     *   Objectify.convert('form') -> { ... }
     *   Objectify.convert( $('form') ) -> { ... }
     *   Objectify.convert({ ... }) -> { ... }
     ***/
    'convert': function ( selection ) {
      var fields = [], obj = {};

      if ( (primitive(selection) === 'String') || (selection instanceof jQuery) ) {

        if ( $(selection).is('form') ) fields = $(selection).serializeArray();
        else fields = $(selection).find('input, select, textarea').serializeArray();

      } else if ( primitive(selection) == 'Object' ) {

        for (var key in selection) {
          if ( hasOwnProperty(selection, key) ) {
            fields.push({ name: key, value: selection[key] });
          }
        }

      }

      $.each( fields, function ( i, field ) {
        normalize( field.name, field.value, obj );
      });

      return obj;
    },

    /***
     * Takes a packed string and returns and `Array` of parsed tokens.
     *
     * @method unpack(<string>)
     * @returns {Array} tokens
     * @example
     *
     *   Objectify.unpack('user[address][street_address]') -> ['user', 'address', 'street_address']
     ***/
    'unpack': function ( string ) {
      var pattern = /^[\[\]]*([^\[\]]+)\]*/,
          namespace = [], s;

      while ( s = string.match(pattern) ) {
        namespace.push( s[1] );
        string = string.replace( pattern, '' );
      }

      return namespace;
    },

    /***
     * Takes one or more arguments and turns them into a single packed string. Pass in an empty `[]` for an array value.
     *
     * @method pack(<arg1>, <arg2>, ...)
     * @returns {String}
     * @example
     *
     *   Objectify.pack('user', 'address', 'street_address') -> 'user[address][street_address]'
     *   Objectify.pack('user', 'phone_numbers', []) -> 'user[phone_numbers][]'
     ***/
    'pack': function () {
      if ( arguments.length === 0 ) return;

      if ( arguments.length === 1 )
      if ( $.isArray(arguments[0]) ) return self.pack.apply(null, arguments[0]);

      var args      = Array.prototype.slice.call( arguments, 1 ),
          fieldName = arguments[ 0 ];

      $.each( args, function ( i, name ) {
        if ( primitive(name) === 'Array' ) fieldName += '[]';
        else fieldName += '[' + name + ']';
      });

      return fieldName;
    },

    /***
     * Walk into a nested object, to arbitrary depth, and pull out the value
     *
     * @method walk(<obj>, <namespace>)
     * @param {Object} <obj> The nested object
     * @param {Array} <namespace> The chain of keys to walk down
     * @extra If `walk` excounters an `undefined` value it will immediately break and return undefined.
     * @example
     *
     *   var obj = { user: { address: { street_address: '123 Nowhere st.' } } };
     *   Objectify.walk(obj, ['user', 'address', 'street_address']) -> '123 Nowhere st.'
     *   Objectify.walk(obj, ['user', 'address', 'foo', 'bar']) -> undefined
     ***/
    'walk': function ( obj, namespace ) {
      while ( namespace.length > 0 ) {
        if ( obj === undefined ) break;
        obj = obj[ namespace.shift() ];
      }
      return obj;
    }
  };
})(jQuery);

(function ($) {
  /***
   * jQuery plugin to convert the selected nodes. Parameters are treated like `walk` params.
   *
   * @example
   *
   *   $('form').objectify() -> { ... }
   *   $('form').objectify('user', 'address', 'street_address') -> '123 Nowhere st.'
   ***/
  $.fn.objectify = function () {
    return Objectify.walk( Objectify.convert(this), Array.prototype.slice.call(arguments) );
  }  
})(jQuery);

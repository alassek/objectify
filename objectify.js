
var Objectify = (function (undefined) {
  
  var filters = {};

  /** related to: convert
   *  process(form) -> Object
   *  - form (HTMLFormElement): Form to be parsed
  **/
  function process (form) {
    if (!form instanceof HTMLFormElement) throw("Expected an HTMLFormElement, got " + typeof(form) + " instead.");
    
    var inputs = form.getElementsByTagName('input'),
        selects = form.getElementsByTagName('select'),
        textareas = form.getElementsByTagName('textarea'),
        fields = [], obj = {};
    
    // getElementsByTagName is using a more elemental form
    // of array that doesn't have Prototype's extensions
    inputs = $A(inputs), selects = $A(selects), textareas = $A(textareas);
    fields = fields.concat(inputs).concat(selects).concat(textareas);
    
    fields = fields.map(getKeyValuePairs)
                   .compact()
                   .reject(filterNames)
                   .map(stripWhiteSpace);

    fields.each(function(field) {
      normalizeParam(field[0], field[1], obj);
    });
    
    return obj;
  }
  
  /** related to: process
   *  getKeyValuePairs(field) -> Array
   *  - field (Element): Form element to extract name/value from
  **/
  function getKeyValuePairs (field) {
    switch (field.type) {
      case "select-one":
        return [field.name, field.options[field.selectedIndex].value];
      case "checkbox":
        return [field.name, field.checked];
      default:
        return [field.name, field.value];
    }    
  }
  
  /** related to: process
   *  stripWhiteSpace(pair)
   *  - pair (Array): Name/Value pair in Array
   *
   *  Strips whitespace from name, and value if value is String
  **/
  function stripWhiteSpace (pair) {
    return [
      pair[0].toString().strip(),
      typeof pair[1] === "string" ? pair[1].toString().strip() : pair[1]
    ];
  }
  
  /** related to: process
   *  filterNames(pair) -> Boolean
   *  - pair (Array): Name/Value pair in Array
   *
   *  Returns true if name/value is empty
   *  Also ignores "_method" parameter
  **/
  function filterNames (pair) {
    if (pair === undefined || pair.compact().length === 0) return true;
    var nameEmpty = (pair.length > 0 && pair[0].length === 0),
        methodParam = /^_method$/.test(pair[0]);
    return nameEmpty || methodParam;
  }

  /** related to: process
   *  normalizeParam(key, value, params) -> undefined
   *  - key (String): The parameter name to be parsed
   *  - value (String): The value to be assigned
   *  - params (Object): The data object being constructed
   *
   *  Takes a single key/value pair and assigns the value to the
   *  correct object according to the key's value.
  **/
  function normalizeParam(key, value, params) {
    var namespace = [],
        isArrayValue = key.match(/\[\]$/);

    key.scan(/^[\[\]]*([^\[\]]+)\]*/, function(s){ namespace.push(s[1]); });

    var k, p = params;
    do {
      k = namespace.shift();
      if (namespace.length > 0) {
        p[k] = p[k] || {};
        p = p[k];
      }
    } while (namespace.length > 0);
    
    if (isArrayValue) {
      p[k] = p[k] || [];
      if (!Object.isArray(p[k])) throw("Expected array, got " + typeof(p[k]) + " instead.");
      p[k].push(value);
    } else {
      p[k] = value;
    }
  }
  
  return {
    
    /**
     *  Objectify.convert(forms) -> Object | Array
     *  - forms (HTMLFormElement | Array): Form or Array of forms to be parsed
    **/
    convert: function (forms) {
      if (Object.isArray(forms)) {
        return forms.each(function (form) {
          return process(form);
        });
      }
      return process(forms);
    },
    
    fields: function (options) {
      jQuery.extend(filters, options);
      console.log(filters);
    }

  };
  
})();
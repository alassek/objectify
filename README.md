### Objectify

Objectify converts forms to complex objects using a name-attribute convention.
The reason for this is to decouple the value of a form serialization from its
presentation to a user. Computers and People think about data in very different
ways, and it simply doesn't make sense to make one dependent on the other.

Objectify requires the Prototype Javascript framework.

## The Objectify Parameter Convention

Objectify uses the HTTP parameter convention popularized by PHP & Ruby:

Nested objects are written inside square-brackets: [ ]

    <input type="text" name="person[email]" value="some.dude@test.com" />
    
    {
      person: {
        email: "some.dude@test.com"
      }
    }

Objects can be nested to arbitrary depth:

    <input type="text" name="person[phone_numbers][0][extension]" value="214" />
    
    {
      person: {
        phone_numbers: {
          "0": {
            extension: "214"
          }
        }
      }
    }

Form fields that need to be combined into an array end in '[]'

    <input type="text" name="person[phone_numbers][]" value="555-2178" />
    <input type="text" name="person[phone_numbers][]" value="555-8634" />
    
    {
      person: {
        phone_numbers: ['555-2178', '555-8634']
      }
    }
    
## Post-Processing fields

If you want Objectify to process a field in a particular way, Objectify.fields gives
you two options:

You can provide a Javascript object constructor to convert the field:

    Objectify.fields({
      'id': Number
    });

    <input type="hidden" name="person[id]" value="235" />
    
    {
      person: {
        id: 235
      }
    }

If the constructor is Number, parseInt or parseFloat will be used as appropriate.
If the constructor is Date, null will be returned if the date is invalid.

You can also provide a function to do your own processing on the field:

    Objectify.fields({
      id: function(field) {
        field = field.replace(/\D/, '');
        return parseInt(field, 10);
      }
    });

If you have two fields with the same name that need to be treated differently,  you
can qualify the field name. Exact matches will always trump field names:

    Objectify.fields({
      'company[id]': String,
      id: Number
    });
    
    <input type="text" name="company[id]" value="acme-inc" />
    <input type="text" name="person[id]" value="45332" />
    
    {
      person: { id: 45332 },
      company: { id: 'acme-inc' }
    }
    
You can call Objectify.fields as many times as you need to keep your code clean, all
filters passed in this way will be combined the next time you convert a form. Passing
in the same filter twice will result in the filter being overwritten with the newer
version.

## API status

* Objectify.fields is not yet supported
* Adding nested objects after "[]" is not yet supported, but will be
  - If you're good with Regular Expressions, I would appreciate some help with this
* Multi-Selects are not yet supported
  
This is a work in progress, and anything currently in the documentation may change.
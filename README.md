# Objectify

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
    
## Converting a form

Given a form with the id 'person', you simply pass it into `Objectify.convert()` in one of two ways:

    var person1 = Objectify.convert('#person'),      // jQuery selector string
        person2 = Objectify.convert( $('#person') ); // jQuery instance works too

`Objectify.convert` will also accept an object:

```javascript
var obj = {
  'person[address][street_address]': '123 Nowhere st.'
};

Objectify.convert(obj)
//{
//  person: {
//    address: {
//      street_address: '123 Nowhere st.'
//    }
//  }
//}
```

That's it!

## API status

* Adding nested objects after "[]" is not yet supported, I'm not sure if this is actually necessary.
  
This is a work in progress, and anything currently in the documentation may change.
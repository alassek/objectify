# Objectify

Objectify converts forms to complex objects using a name-attribute convention.
The reason for this is to decouple the value of a form serialization from its
presentation to a user. Computers and People think about data in very different
ways, and it simply doesn't make sense to make one dependent on the other.

Objectify requires jQuery, although it is not a jQuery plugin per se.

## The Objectify Parameter Convention

Objectify uses the HTTP parameter convention popularized by PHP & Ruby:

Nested objects are written inside square-brackets: [ ]

  ```html
  <!-- an input named like this -->
  <input type="text" name="person[email]" value="some.dude@test.com" />
  ```
  
  ```javascript
  // would be converted to this
  {
    person: {
      email: "some.dude@test.com"
    }
  }
  ```

Objects can be nested to arbitrary depth:

  ```html
  <input type="text" name="person[phone_numbers][0][extension]" value="214" />
  ```
  
  ```javascript
  {
    person: {
      phone_numbers: {
        "0": {
          extension: "214"
        }
      }
    }
  }
  ```

Form fields that need to be combined into an array end in '[]'

  ```html
  <input type="text" name="person[phone_numbers][]" value="555-2178" />
  <input type="text" name="person[phone_numbers][]" value="555-8634" />
  ```
  
  ```javascript
  {
    person: {
      phone_numbers: ['555-2178', '555-8634']
    }
  }
  ```
    
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

## Useful helper methods

### Objectify.pack

```javascript
Objectify.pack('user', 'address', 'street_address') //=> 'user[address][street_address]'
Objectify.pack('user', 'phone_numbers', []) //=> 'user[phone_numbers][]'
```

### Objectify.unpack

```javascript
Objectify.unpack('user[address][street_address]') //=> ['user', 'address', 'street_address']
```

### Objectify.walk

```javascript
var obj = Objectify.convert('#user_form');
Objectify.walk(obj, ['user', 'address', 'street_address']) //=> '123 Nowhere st.'
```

### jQuery plugin

With no arguments, behaves like `convert`. With arguments, behaves like `walk`.

```javascript
$('#user_form').objectify() //=> { ... }
$('#user_form').objectify('user', 'address', 'street_address') //=> '123 Nowhere st.'
```

## API status

* Adding nested objects after "[]" is not yet supported, I'm not sure if this is actually necessary.
  
This is a work in progress, and anything currently in the documentation may change.
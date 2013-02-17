# Objectify

Objectify converts forms to complex objects using the [PHP/Ruby name-attribute convention][so].
The reason for this is to decouple the value of a form serialization from its
presentation to a user. Getting data from your forms should _not_ be tightly-coupled to your
markup.

For more information about this parameter format, see [guides.rubyonrails.org][params].
  [so]: http://stackoverflow.com/questions/7578269/where-did-this-ruby-parameter-convention-come-from
  [params]: http://guides.rubyonrails.org/form_helpers.html#understanding-parameter-naming-conventions

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

```javascript
var person1 = Objectify.convert('#person'),      // jQuery selector string
    person2 = Objectify.convert( $('#person') ), // jQuery instance works too
    person3 = $('#person').objectify();          // jQuery prototype method
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

### Objectify.normalize

```javascript
Objectify.normalize({ 'person[address][street_address]': '123 Nowhere st.' })
//{
//  person: {
//    address: {
//      street_address: '123 Nowhere st.'
//    }
//  }
//}
```

### Objectify.denormalize

```javascript
Objectify.denormalize({ foo: { bar: 'baz' } }) //=> { 'foo[bar]': 'baz' }
```

### Objectify.walk

```javascript
var obj = Objectify.convert('#user_form');
Objectify.walk(obj, 'user', 'address', 'street_address') //=> '123 Nowhere st.'
```

### jQuery plugin

With no arguments, behaves like `convert`. With arguments, behaves like `walk`.

```javascript
$('#user_form').objectify() //=> { user: { address: { street_address: '123 Nowhere st.' } } }
$('#user_form').objectify('user', 'address', 'street_address') //=> '123 Nowhere st.'
```

## API status

The Objectify API has been stable for some time now, and I have been using it in production successfully. I don't foresee any major changes.
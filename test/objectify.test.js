(function($, undefined) {

  $(document).ready(function () {
    
    module('Objectify.convert');

    var personForm = $('#person-fixture').get(0),
        personObj = Objectify.convert(personForm);
  
    test('Object definitions', function() {
      ok(personObj.person, 'Person object exists');
      ok(personObj.person.name, 'Person has a name');
      ok(personObj.person.email, 'Person has an email');
      ok(personObj.person.address, 'Person has an Address');
      ok(personObj.person.address.street_address, 'Address has a street_address');
      ok(personObj.person.address.city, 'Address has a city');
      ok(personObj.person.address.state, 'Address has a state');
      ok(personObj.person.address.zip, 'Address has a zip');
      ok(personObj.person.authorizations, 'Authorizations object exists');
      ok(Object.isArray(personObj.person.authorizations), 'Authorizations is an array');
    });
  
    test('_method parameter is ignored', function () {
      equal(personObj['_method'], undefined, "_method parameter is not added to object");
    });

    var personFixture = {
      "person": {
        "id": "1",
        "name": "Joe Blow",
        "email": "joe.blow@test.com",
        "address": {
          "street_address": "123 Somewhere St",
          "city": "Omaha",
          "state": "NE",
          "zip": "68144"
        },
        "authorizations": ["1", "2", "3"]
      }
    };
  
    test('Object structure', function() {
      same(
        personObj,
        personFixture,
        "Object structure is generated as expected"
      );
    });
  
    module('Objectify.fields');
  
    test('Objectify.fields() with no args returns the current filters', function () {
      
      Objectify.fields({
        id: Number,
        "something[id]": String
      });
      
      same(
        Objectify.fields(),
        { id: Number, "something[id]": String },
        "The filters passed into Objectify.fields have been stored correctly"
      );
    });
  
    test('field filters are persistent and additive', function () {
      
      function zipConverter (zip) {
        return zip + "-1234";
      }
      
      Objectify.fields({
        zip: zipConverter,
        "be_integers": Number,
        "be_floats": Number,
        date: String, // should not match
        good: Date, // should match
        bad: Date, // should be string
        "parseInt": Number
      });
      
      same(
        Objectify.fields(),
        {
          id: Number,
          "something[id]": String,
          zip: zipConverter,
          "be_integers": Number,
          "be_floats": Number,
          date: String,
          good: Date,
          bad: Date,
          "parseInt": Number
        },
        "The two Objectify.fields() objects have been combined together"
      );
    });
  
    var filtersObj;
  
    test('User-provided field filters are applied', function () {
      filtersObj = Objectify.convert($('form#filters-fixture').get(0));
      
      equal(filtersObj.something.zip, "68144-1234", "user-defined functions are used correctly");
    });
  
    test('Exact field matches take precedence over general matches', function () {
      ok(filtersObj.id === 1, "id was converted to Number");
      ok(filtersObj.something.id === "2", "something[id] filter overrode general id filter");
    });
    
    test('parseInt is used for Numbers with no decimal point', function () {
      same(filtersObj.these_should.be_strings, ["1", "2", "3"], "these_should[be_strings][] were combined into an array but left untouched");
      same(filtersObj.these_should.be_integers, [4, 5, 6], "these_should[be_integers][] were parsed into an array of integers");
      same(filtersObj.these_should.be_floats, [10.1, 10.2, 10.3], "these_should[be_floats][] were parsed into an array of floats");
    });
    
    test('Number data types correctly avoid the parseInt octal bug', function () {
      ok(filtersObj.testing.parseInt === 9, "testing[parseInt] was parsed into a base-10 integer");
    });
    
    test('Date parsing', function () {
      ok(filtersObj.date.good instanceof Date, "date was correctly converted to Date instance");
      ok(filtersObj.date.good === new Date("Wed Aug 25 2010 21:14:47 GMT-0500 (CST)"), "date was parsed to correct Date");
      equal(filtersObj.date.bad, "2010-8-25 9pm", "non-parsable date should be left as String");
    });
    
    test('Objectify.fields.clear() removes filters', function () {
      Objectify.fields.clear();
      same(Objectify.fields(), {}, "Fields filters are now empty");
    });
  
  });
  
})(jQuery);
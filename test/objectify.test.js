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
  
    Objectify.fields({
      id: Number,
      "person[authorizations][]": Number
    });
  
    // testing if field filters are persistent and additive
    Objectify.fields({
      "person[address][zip]": function (zip) {
        return zip + "-1234";
      }
    })
  
    var filtersObj = Objectify.convert($('form#filters-fixture').get(0));
  
    test('User-provided field filters are applied', function () {
      ok(filtersObj.person.id instanceof Number, "id was converted to Number");
      equal(filtersObj.person.authorizations, [1, 2, 3], "authorizations were converted to Numbers");
      equal(filtersObj.person.address.zip, "68144-1234", "zip was passed through provided function");
    });
  
    Objectify.fields({
      zip: Number
    });

    test('Exact field matches take precedence over general matches', function () {
      ok(filtersObj.person.address.zip === "68144-1234", "person[address][zip] overrides zip filter");
    });
  
  });
  
})(jQuery);
(function($, undefined) {
  
  $(document).ready(function(){
    module('Objectify.convert');

    var form = $('form').get(0),
        formObj = Objectify.convert(form);
    
    test('Object definitions', function() {
      ok(formObj.person, 'Person object exists');
      ok(formObj.person.name, 'Person has a name');
      ok(formObj.person.email, 'Person has an email');
      ok(formObj.person.address, 'Person has an Address');
      ok(formObj.person.address.street_address, 'Address has a street_address');
      ok(formObj.person.address.city, 'Address has a city');
      ok(formObj.person.address.state, 'Address has a state');
      ok(formObj.person.address.zip, 'Address has a zip');
      ok(formObj.person.authorizations, 'Authorizations object exists');
      ok(Object.isArray(formObj.person.authorizations), 'Authorizations is an array');
    });
    
    test('_method parameter is ignored', function () {
      equal(formObj['_method'], undefined, "_method parameter is not added to object");
    });

    var fixtureObj = {
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
        formObj,
        fixtureObj,
        "Object structure is generated as expected"
      );
    });
    
    test('Multiple forms', function() {
      same(
        [
          Objectify.convert($('form').get(0)),
          Objectify.convert($('form').get(0))
        ],
        [
          Object.clone(fixtureObj),
          Object.clone(fixtureObj)
        ],
        "Multiple forms are processed correctly"
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
    
    formObj = Objectify.convert($('form').get(0));
    
    test('User-provided field filters are applied', function () {
      ok(formObj.person.id instanceof Number, "id was converted to Number");
      equal(formObj.person.authorizations, [1, 2, 3], "authorizations were converted to Numbers");
      equal(formObj.person.address.zip, "68144-1234", "zip was passed through provided function");
    });
    
    Objectify.fields({
      zip: Number
    });

    test('Exact field matches take precedence over general matches', function () {
      ok(formObj.person.address.zip === "68144-1234", "person[address][zip] overrides zip filter");
    });
  });
  
})(jQuery);
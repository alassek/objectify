(function($) {
  
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
    });
  });
  
})(jQuery);
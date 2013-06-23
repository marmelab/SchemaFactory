/*global describe, before, it, after*/

var assert         = require('assert');
var schema = require('./SchemaFactory');


describe('Schema', function () {
  var Person;
  it('should register a type string without throwing an error', function () {
    schema.registerType('string', null, function (value) {
      return typeof value === "string" || (typeof value === "object" && value.constructor === String);
    });
  });

  it('should throw an error if trying to register a type named string a second time', function (done) {
    try {
      schema.registerType('string', null, function (value) {
        console.log('verifying string');
        return typeof value === "string" || (typeof value === "object" && value.constructor === String);
      });
      return done(new Error('No error was raised'));
    } catch (error) {
      assert.equal(error.message, 'A type with the specified name already exists');
      return done();
    }
  });

  it('should throw an error if trying to register a pattern named string since a type with this name already exists', function (done) {
    try {
      schema.registerPattern('string', {
        brand : 'string',
        size : 'string'
      });
      return done(new Error('No error was raised'));
    } catch (error) {
      assert.equal(error.message, 'A type with the specified name already exists');
      return done();
    }
  });

  it('should register a pattern named Person without throwing an error', function () {
    schema.registerPattern('Person', {name : 'string', firstName : 'string'});
  });

  it('should register a pattern named Family without throwing an error', function () {
    schema.registerPattern('Family', {father : 'Person', mother : 'Person', brother : 'Person', sister : 'Person'});
  });

  it('should throw an error if trying to register a pattern named Person a second time', function (done) {
    try {
      schema.registerPattern('Person', {name : 'string', firstName : 'string', adress : 'string'});
      return done(new Error('No error was raised'));
    } catch (error) {
      assert.equal(error.message, 'A Pattern with the specified name already exists');
      return done();
    }
  });

  it('should throw an error if trying to register a type named Person since a pattern with this name already exists', function (done) {
    try {
      schema.registerType('Person', null, function (value) {
        return value === 'Person';
      });
      return done(new Error('No error was raised'));
    } catch (error) {
      assert.equal(error.message, 'A pattern with the specified name already exists');
      return done();
    }
  });

  it('should throw an error if trying to register a pattern using unregistered type', function (done) {
    try {
      schema.registerPattern('user', {name : 'string', firstName : 'string', password : 'password'});
      return done(new Error('No error was raised'));
    } catch (error) {
      assert.equal(error.message, 'Invalid type, no pattern nor type registered for : undefined at key : password');
      return done();
    }
  });

  it('should return a constructor if calling factory with Person', function () {
    Person = schema.factory('Person');
    assert(Person);
  });

  it('Person should create a new Person Object with attribute name and firstName but ignoring adress', function () {
    var person = new Person({name : 'michel', firstName : 'thiery', adress : '5, rotating corner street'});
    assert.equal(JSON.stringify(person.literal), '{"name":"michel","firstName":"thiery"}');
    assert.equal(person.name, 'michel');
    assert.equal(person.firstName, 'thiery');

  });

  it('person should throw an error if trying to set a person name to an array', function (done) {
    var person = new Person({name : 'michel', firstName : 'thiery'});
    try {
      person.firstName = ['thiery', 'georges', 'henri'];
      return done(new Error('No error was thrown'));
    } catch (error) {
      assert.equal(error.message, 'Incorrect value for type : string');
      return done();
    }
  });

  it('Person should throw an error if trying to create an object with an array in the name', function (done) {
    try {
      var person = new Person({name : 'michel', firstName : ['thiery']});
      return done(new Error('No error was thrown'));
    } catch (error) {
      assert.equal(error.message, 'Incorrect value for type : string');
      return done();
    }
  });

  it.skip('should create a family without throwing an error', function () {
    var Family = schema.factory('Family');
    var family = new Family();
    family.father = new Person({name : 'michel', firstName : 'thiery'});
    // console.dir(family);
    console.log(family.father);
  });

});
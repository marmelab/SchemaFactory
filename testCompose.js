/*global describe, before, it, after*/

var assert = require('assert');
var compose = require('./compose');

describe('compose2', function () {
  var fList = [];

  before(function () {
    fList.push(function inc(value) {
      console.log('inc');
      return value + 1;
    });
  });

  it('shoud create a function that increment by 1, if called with an array containing function inc', function () {
    var result = compose(fList);
    assert.equal(result(1), 2);
  });

  it('shoud create a function that increment by 1 and then multiply by 2, if mul2 is added to the list', function () {
    fList.push(function mul2(value) {
      console.log('mul2');
      return value * 2;
    });
    var result = compose(fList);
    assert.equal(result(1), 4);
  });

  it('shoud create a function that increment by 1 multiply by 2 and then decrease by 1, if dec is added to the list', function () {
    fList.push(function dec(value) {
      console.log('dec');
      return value - 1;
    });
    var result = compose(fList);
    assert.equal(result(1), 3);
  });

  it('shoud create a function that do the previous operation and then multiply by 10, if mul10 is added to the list', function () {
    fList.push(function mul10(value) {
      console.log('mul10');
      return value * 10;
    });
    var result = compose(fList);
    assert.equal(result(1), 30);
  });

  it('shoud create a function that do the previous operation and then divide by 5, if div5 is added to the list', function () {
    fList.push(function div5(value) {
      console.log('div5');
      return value / 5;
    });
    var result = compose(fList);
    assert.equal(result(1), 6);
  });

});
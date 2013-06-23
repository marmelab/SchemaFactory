var schema = (function () {

  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }
  /*
   * compose seferal function passed in the array function list and return a function that do f[0](f[1](...f[n](value))) in the callback
  */
  function compose(fList) {
    if (fList.length === 1) { // The function is the result
      return fList[0];
    }
    // Create a new function composed of the last two function of the array
    var f1 = fList.pop();
    var f2 = fList.pop();
    var f = function (value) {
      return f1(f2(value));
    };
    fList.push(f);
    return compose(fList);
  }


  var type = {};
  var pattern = {};
  var constructor = {};

  function getSetter(name, typeName) {
    return function (value) {
      this.literal[name] = type[typeName].preSetter(value);
    };
  }

  function getGetter(name) {
    return function () {
      return this.literal[name];
    };
  }

  schema = {
    /**
     * Register a type in schema to be used by the pattern.
     * A type has a name, 
     * a transform function applied to the value before validation
     * A validate function to test the validation of the value
     * A finish function to operate on the value after validation.
     */
    registerType : function (name, transform, validate, finish) {
      if (pattern[name]) { throw new Error('A pattern with the specified name already exists'); }
      if (type[name]) { throw new Error('A type with the specified name already exists'); }
      type[name] = {};
      var fList = [];
      if (transform) {
        fList.push(transform);
      }
      if (validate) {
        fList.push(function (value) {
          if (validate(value) === false) {
            throw new Error('Incorrect value for type : ' + name);
          }
          return value;
        });
      }
      if (finish) {
        fList.push(finish);
      }
      type[name].preSetter = compose(fList);
    },
    /**
     * Register a pattern in schema to be used by the factory
     * The new Pattern is an object literal of only one dimension
     * All its value must be valid
     * They can be either type or other schema
     */
    registerPattern : function (name, newPattern) {
      if (pattern[name]) { throw new Error('A Pattern with the specified name already exists'); }
      if (type[name]) { throw new Error('A type with the specified name already exists'); }
      // var attr = Object.keys(newPattern);
      var attr;
      var preSetterList = {};
      type[name] = {};
      for  (attr in newPattern) {
        if (newPattern.hasOwnProperty(attr)) {
          // If an attribute has a value that correspond to no type or pattern
          if (!type[newPattern[attr]] && !pattern[newPattern[attr]]) {
            throw new Error('Invalid type, no pattern nor type registered for : ' + pattern[attr] + ' at key : ' + attr);
          }
          preSetterList[attr] = type[newPattern[attr]].preSetter;
        }
      }
      pattern[name] = newPattern;
      return this;
    },
    /**
     * SchemaFactory return a constructor returning an object validating its data after the pattern named name.
     */
    factory : function factory(name) {
      if (!pattern[name]) { return null; }
      if (constructor[name]) { return constructor[name]; }
      var i;
      var myPattern = pattern[name];
      var attr;

      function isType(attr) {
        if (!type[myPattern[attr]]) { return false; }
        return true;
      }

      var Constructor = function (literal) {
        var attr;
        this.literal = {};
        literal = literal || {};
        for (attr in myPattern) {
          if (isType(attr)) {
            if (literal[attr]) {
              this[attr] = literal[attr];
            }
          }
        }
        return this;
      };
      for (attr in myPattern) {
        if (isType(attr)) {
          Constructor.prototype.__defineSetter__(attr, getSetter(attr, myPattern[attr]));
          Constructor.prototype.__defineGetter__(attr, getGetter(attr));
        }
      }
      return Constructor;
    }
  };

  return schema;

}());
if (module) {
  module.exports = schema;
}
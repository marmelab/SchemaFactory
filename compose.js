module.exports = function compose(fList) {
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
};
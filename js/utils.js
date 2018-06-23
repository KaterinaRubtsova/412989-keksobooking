'use strict';
(function () {

  var getRandomNumber = function (min, max) {
    return Math.floor(min + Math.random() * (max - min));
  };

  var getRandomArrayElem = function (arr) {
    var randomElem = Math.floor(Math.random() * arr.length);
    return arr[randomElem];
  };

  var getRandomSubArray = function (arr, count) {
    var arrCopy = arr.slice();
    var result = [];
    for (var i = 0; i < count; i++) {
      var index = Math.floor(Math.random() * arrCopy.length);
      result.push(arrCopy[index]);
      arrCopy.splice(index, 1);
    }
    return result;
  };

  window.utils = {
    getRandomNumber: getRandomNumber,
    getRandomArrayElem: getRandomArrayElem,
    getRandomSubArray: getRandomSubArray
  };
})();

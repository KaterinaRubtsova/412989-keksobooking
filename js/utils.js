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

  var getMinPriceForHouseType = function (houseType, houseTypes) {
    for (var i = 0; i < houseTypes.length; i++) {
      if (houseTypes[i].name === houseType) {
        return houseTypes[i].minPrice;
      }
    }
    return null;
  };

  var getHouseType = function (type) {
    var houseTypes = {
      'palace': 'Дворец',
      'flat': 'Квартира',
      'house': 'Дом',
      'bungalo': 'Бунгало',
    };
    return houseTypes[type];
  };

  window.utils = {
    getRandomNumber: getRandomNumber,
    getRandomArrayElem: getRandomArrayElem,
    getRandomSubArray: getRandomSubArray,
    getMinPriceForHouseType: getMinPriceForHouseType,
    getHouseType: getHouseType
  };
})();

'use strict';
// модуль, который создаёт данные

(function () {
  var CARDS_COUNT = 8;

  var HOUSE_TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var HOUSE_CHECKIN_TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var HOUSE_CHECKOUT_TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var HOUSE_FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var HOUSE_PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var HOUSE_TYPES = [{
    'name': 'palace',
    'desc': 'Дворец',
    'minPrice': 10000
  },
  {
    'name': 'house',
    'desc': 'Дом',
    'minPrice': 5000
  },
  {
    'name': 'flat',
    'desc': 'Квартира',
    'minPrice': 1000
  },
  {
    'name': 'bungalo',
    'desc': 'Бунгало',
    'minPrice': 0
  }
  ];

  var getMinPriceForHouseType = function (houseType) {
    for (var i = 0; i < HOUSE_TYPES.length; i++) {
      if (HOUSE_TYPES[i].name === houseType) {
        return HOUSE_TYPES[i].minPrice;
      }
    }
    return null;
  };

  var generateCards = function (cardsAmount) {
    var cards = [];
    for (var i = 0; i < cardsAmount; i++) {
      var randomX = window.utils.getRandomNumber(300, 900);
      var randomY = window.utils.getRandomNumber(130, 630);
      var card = {
        'author': {
          'avatar': 'img/avatars/user0' + (i + 1) + '.png'
        },
        'offer': {
          'title': HOUSE_TITLES[i],
          'address': '' + randomX + ', ' + randomY,
          'price': window.utils.getRandomNumber(1000, 1000000),
          'type': window.utils.getRandomArrayElem(HOUSE_TYPES).name,
          'rooms': window.utils.getRandomNumber(1, 5),
          'guests': window.utils.getRandomNumber(1, 10),
          'checkin': window.utils.getRandomArrayElem(HOUSE_CHECKIN_TIMES),
          'checkout': window.utils.getRandomArrayElem(HOUSE_CHECKOUT_TIMES),
          'features': window.utils.getRandomSubArray(HOUSE_FEATURES, Math.floor(1 + Math.random() * HOUSE_FEATURES.length)),
          'description': '',
          'photos': window.utils.getRandomSubArray(HOUSE_PHOTOS, HOUSE_PHOTOS.length)
        },
        'location': {
          'x': randomX,
          'y': randomY
        }
      };
      cards.push(card);
    }
    return cards;
  };

  var cards = generateCards(CARDS_COUNT);

  var getHouseType = function (type) {
    var houseTypes = {
      'palace': 'Дворец',
      'flat': 'Квартира',
      'house': 'Дом',
      'bungalo': 'Бунгало',
    };
    return houseTypes[type];
  };

  window.data = {
    generateCards: generateCards,
    cards: cards,
    getMinPriceForHouseType: getMinPriceForHouseType,
    getHouseType: getHouseType,
    cardsCount: CARDS_COUNT
  };

})();

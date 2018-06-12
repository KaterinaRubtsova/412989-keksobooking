'use strict';
// Создайте массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления неподалёку
// для начала объявляю переменные
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

var HOUSE_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
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

var CARDS_COUNT = 8;

// размер пина взят из style.css
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max - min));
};

var getRandomElem = function (arr) {
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

var generateCards = function () {
  var cards = [];
  for (var i = 0; i < CARDS_COUNT; i++) {
    var randomX = getRandomNumber(300, 900);
    var randomY = getRandomNumber(130, 630);
    var card = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'title': HOUSE_TITLES[i],
        'address': '' + randomX + ', ' + randomY,
        'price': getRandomNumber(1000, 1000000),
        'type': getRandomElem(HOUSE_TYPES),
        'rooms': getRandomNumber(1, 5),
        'guests': getRandomNumber(1, 10),
        'checkin': getRandomElem(HOUSE_CHECKIN_TIMES),
        'checkout': getRandomElem(HOUSE_CHECKOUT_TIMES),
        'features': getRandomSubArray(HOUSE_FEATURES, Math.floor(1 + Math.random() * HOUSE_FEATURES.length)),
        'description': '',
        'photos': getRandomSubArray(HOUSE_PHOTOS, HOUSE_PHOTOS.length)
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

// var getHouseType = function (type) {
//   if (type === 'palace') {
//     return 'Дворец';
//   } else if (type === 'flat') {
//     return 'Квартира';
//   } else if (type === 'house') {
//     return 'Дом';
//   } else if (type === 'bungalo') {
//     return 'Бунгало';
//   } else {
//     return 'Неизвестно';
//   }
// };

// вариант с объектом
var getHouseType = function (type) {
  var houseTypes = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало',
    'default': 'Неизвестно'
  }
  return houseTypes[type];
};


var cards = generateCards();

var userMap = document.querySelector('.map');
userMap.classList.remove('map--faded');

var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

var pinFragment = document.createDocumentFragment();

for (var i = 0; i < CARDS_COUNT; i++) {
  var pinClone = pinTemplate.cloneNode(true);
  pinClone.style = 'left: ' + (cards[i].location.x - (PIN_WIDTH / 2)) + 'px;' + 'top: ' + (cards[i].location.y - (PIN_HEIGHT / 2)) + 'px';
  pinClone.querySelector('img').src = cards[i].author.avatar;
  pinClone.querySelector('img').alt = cards[i].offer.title;

  pinFragment.appendChild(pinClone);
}

document.querySelector('.map__pins').appendChild(pinFragment);

var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

var cardFragment = document.createDocumentFragment();

var cardClone = cardTemplate.cloneNode(true);

cardClone.querySelector('.popup__title').textContent = cards[0].offer.title;
cardClone.querySelector('.popup__text--address').textContent = cards[0].offer.address;
cardClone.querySelector('.popup__text--price').textContent = cards[0].offer.price + ' ₽/ночь';
cardClone.querySelector('.popup__type').textContent = getHouseType(cards[0].offer.type);
cardClone.querySelector('.popup__text--capacity').textContent = cards[0].offer.rooms + ' комнаты для ' + cards[0].offer.guests + ' гостей';
cardClone.querySelector('.popup__text--time').textContent = 'Заезд после ' + cards[0].offer.checkin + ', выезд до ' + cards[0].offer.checkout;
// В список .popup__features выведите все доступные удобства в объявлении.
// cardClone.querySelector('.popup__features').

var featuresList = cardClone.querySelector('.popup__features');

var featuresListItemTemplate = featuresList.querySelector('.popup__feature--wifi').cloneNode(false); // насколько универсально
featuresListItemTemplate.classList.remove('popup__feature--wifi');

//featuresList.innerHTML = ''; // убрала innerHTML

 while (featuresList.hasChildNodes()) {
   featuresList.removeChild(featuresList.firstChild);
 }

for (i = 0; i < cards[0].offer.features.length; i++) {
  var listElement = featuresListItemTemplate.cloneNode(false);
  listElement.classList.add('popup__feature--' + cards[0].offer.features[i]);
  featuresList.appendChild(listElement);
}

cardClone.querySelector('.popup__description').textContent = cards[0].offer.description;

var photosList = cardClone.querySelector('.popup__photos');

var photosListItemTemplate = photosList.querySelector('.popup__photo').cloneNode(false);

//photosList.innerHTML = ''; // убрала innerHTML

while (photosList.hasChildNodes()) {
  photosList.removeChild(photosList.firstChild);
}

for (i = 0; i < cards[0].offer.photos.length; i++) {
  var photosListElement = photosListItemTemplate.cloneNode(false);
  photosListElement.src = cards[0].offer.photos[i];
  photosList.appendChild(photosListElement);
}

cardClone.querySelector('.popup__avatar').src = cards[0].author.avatar;

cardFragment.appendChild(cardClone);

userMap.insertBefore(cardFragment, document.querySelector('.map__filters-container'));

'use strict';
// Создайте массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления неподалёку

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

var CARDS_COUNT = 8;

// размер пина взят из style.css для класса .map__pin--main строка 224
var PIN_WIDTH = 65;
var PIN_HEIGHT = 65;
var PIN_TIP_HEIGHT = 22;

var HOUSE_TYPES = [
  {
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

// переменные для пинов, карты, формы
var userMap = document.querySelector('.map');
var mapPinMain = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var adFormFieldset = adForm.querySelectorAll('fieldset');

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

var generateCards = function (cardsAmount) {
  var cards = [];
  for (var i = 0; i < cardsAmount; i++) {
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
        'type': getRandomArrayElem(HOUSE_TYPES).name,
        'rooms': getRandomNumber(1, 5),
        'guests': getRandomNumber(1, 10),
        'checkin': getRandomArrayElem(HOUSE_CHECKIN_TIMES),
        'checkout': getRandomArrayElem(HOUSE_CHECKOUT_TIMES),
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

var getHouseType = function (type) {
  var houseTypes = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало',
  };
  return houseTypes[type];
};

var cards = generateCards(CARDS_COUNT);

var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

// обернула ранее написанный код в функцию, чтобы было удобнее работать с обработчиком событий при переводе страницы в активное состояние
var renderPins = function (pinsAmount) {
  var pinFragment = document.createDocumentFragment();

  for (var i = 0; i < pinsAmount; i++) {
    var pinClone = pinTemplate.cloneNode(true);
    pinClone.style = 'left: ' + (cards[i].location.x - (PIN_WIDTH / 2)) + 'px;' + 'top: ' + (cards[i].location.y - (PIN_HEIGHT / 2)) + 'px';
    pinClone.querySelector('img').src = cards[i].author.avatar;
    pinClone.querySelector('img').alt = cards[i].offer.title;
    pinClone.id = '#cid' + i;
    pinClone.addEventListener('click', function (evt) {
      renderCard(evt.currentTarget.id.substring(4, 5));
    });
    pinFragment.appendChild(pinClone);
  }

  document.querySelector('.map__pins').appendChild(pinFragment);
};

var renderCard = function (cardIndex) {
  var cardFragment = document.createDocumentFragment();

  var cardClone = cardTemplate.cloneNode(true);

  var cardOffer = cards[cardIndex].offer;

  cardClone.querySelector('.popup__title').textContent = cardOffer.title;
  cardClone.querySelector('.popup__text--address').textContent = cardOffer.address;
  cardClone.querySelector('.popup__text--price').textContent = cardOffer.price + ' ₽/ночь';
  cardClone.querySelector('.popup__type').textContent = getHouseType(cardOffer.type);
  cardClone.querySelector('.popup__text--capacity').textContent = cardOffer.rooms + ' комнаты для ' + cardOffer.guests + ' гостей';
  cardClone.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardOffer.checkin + ', выезд до ' + cardOffer.checkout;

  var featuresList = cardClone.querySelector('.popup__features');

  var featuresListItemTemplate = featuresList.querySelector('.popup__feature--wifi').cloneNode(false); // насколько универсально
  featuresListItemTemplate.classList.remove('popup__feature--wifi');

  while (featuresList.hasChildNodes()) {
    featuresList.removeChild(featuresList.firstChild);
  }

  for (var i = 0; i < cardOffer.features.length; i++) {
    var listElement = featuresListItemTemplate.cloneNode(false);
    listElement.classList.add('popup__feature--' + cardOffer.features[i]);
    featuresList.appendChild(listElement);
  }

  cardClone.querySelector('.popup__description').textContent = cardOffer.description;

  var photosList = cardClone.querySelector('.popup__photos');

  var photosListItemTemplate = photosList.querySelector('.popup__photo').cloneNode(false);

  while (photosList.hasChildNodes()) {
    photosList.removeChild(photosList.firstChild);
  }

  for (i = 0; i < cardOffer.photos.length; i++) {
    var photosListElement = photosListItemTemplate.cloneNode(false);
    photosListElement.src = cardOffer.photos[i];
    photosList.appendChild(photosListElement);
  }

  cardClone.querySelector('.popup__avatar').src = cards[cardIndex].author.avatar;

  cardClone.querySelector('.popup__close').addEventListener('click', function () {
    deletePopup();
  });

  cardFragment.appendChild(cardClone);

  deletePopup();

  userMap.insertBefore(cardFragment, document.querySelector('.map__filters-container'));
};

var deletePopup = function () {
  if (userMap.querySelector('.popup')) {
    userMap.querySelector('.popup').remove();
  }
};

// ------- module4-task1 ----------------------------------------------------- //

// блок с картой находится в неактивном состоянии, форма подачи заявления заблокирована

// toggle ( String [, Boolean])
// Когда вторым параметром передано false - удаляет указанный класс, а если true - добавляет.

var toggleDisabledForm = function (formDisabled) {
  adForm.classList.toggle('ad-form--disabled', formDisabled);
  for (var i = 0; i < adFormFieldset.length; i++) {
    adFormFieldset[i].disabled = formDisabled;
  }
};

var toggleDisabledMap = function (mapFaded) {
  userMap.classList.toggle('map--faded', mapFaded);
};

// перемещение метки приводит к заполнению поля адреса
// В значении поля записаны координаты, на которые метка указывает своим острым концом
// в обработчике события mouseup на элементе метки, кроме вызова метода, переводящего страницу в активное состояние,
// должен находиться вызов метода, который устанавливает значения поля ввода адреса/
// поле адреса должно быть заполнено всегда, в том числе сразу после открытия страницы
// в неактивном режиме страницы метка круглая, поэтому мы можем взять за исходное значение поля адреса середину метки
// при «перетаскивании» значение поля изменится на то, на которое будет указывать острый конец метки

var getMainPinCords = function () {
  var mainPinX = parseInt(mapPinMain.style.left, 10) + (PIN_WIDTH / 2);
  var mainPinY = parseInt(mapPinMain.style.top, 10) + (PIN_HEIGHT / 2);

  if (!userMap.classList.contains('map--faded')) {
    mainPinY += (PIN_HEIGHT / 2) + PIN_TIP_HEIGHT;
  }

  return Math.floor(mainPinX) + ', ' + Math.floor(mainPinY);
};

var inputLocation = adForm.querySelector('input[name="address"]');

var fillAddress = function () {
  inputLocation.value = getMainPinCords();
};

fillAddress();

// Единственное доступное действие в неактивном состоянии — перетаскивание метки .map__pin--main,
// являющейся контролом указания адреса объявления.
// Первое перемещение метки переводит страницу в активное состояние

var mapPinMainClickHandler = function () {
  toggleDisabledForm(false);
  toggleDisabledMap(false);
  fillAddress();
  renderPins(CARDS_COUNT);
  mapPinMain.removeEventListener('mouseup', mapPinMainClickHandler);
};

mapPinMain.addEventListener('mouseup', mapPinMainClickHandler);


// ------- module4-task2  ----------------------------------------------------- //


// п. 2.5. ТЗ Поля «Время заезда» и «Время выезда» синхронизированы:
// при изменении значения одного поля, во втором выделяется соответствующее ему.
// Например, если время заезда указано «после 14», то время выезда будет равно «до 14» и наоборот

var adFormTimeInField = adForm.querySelector('#timein');
var adFormTimeOutField = adForm.querySelector('#timeout');

var syncFormTimeFields = function (timeSrc, timeDst) {
  timeDst.value = timeSrc.value;
};

adFormTimeInField.addEventListener('change', function () {
  syncFormTimeFields(adFormTimeInField, adFormTimeOutField);
});

adFormTimeOutField.addEventListener('change', function () {
  syncFormTimeFields(adFormTimeOutField, adFormTimeInField);
});

// Поле «Количество комнат» синхронизировано с полем «Количество мест» таким образом,
// что при выборе количества комнат вводятся ограничения на допустимые варианты выбора количества гостей
// 1 комната — «для 1 гостя»;   2 комнаты — «для 2 гостей» или «для 1 гостя»;
// 3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»;
// 100 комнат — «не для гостей»;
var adFormRoomNumberField = adForm.querySelector('#room_number');
var adFormCapacityField = adForm.querySelector('#capacity');

var checkRoomCapacity = function () {
  var roomNumber = parseInt(adFormRoomNumberField.value, 10);
  var guestCount = parseInt(adFormCapacityField.value, 10);

  if (roomNumber === 100 && guestCount > 0) {
    adFormCapacityField.setCustomValidity('Доступно только не для гостей');
  } else if (roomNumber < 100 && guestCount === 0) {
    adFormCapacityField.setCustomValidity('Выберите количество гостей');
  } else if (guestCount > roomNumber) {
    adFormCapacityField.setCustomValidity('Максимум гостей: ' + roomNumber);
  } else {
    adFormCapacityField.setCustomValidity('');
  }
  adFormCapacityField.checkValidity();
};

adFormCapacityField.addEventListener('change', checkRoomCapacity);
adFormRoomNumberField.addEventListener('change', checkRoomCapacity);

var adFormPriceField = adForm.querySelector('#price');
var adFormRoomTypeField = adForm.querySelector('#type');

var changeFormMinPriceForHouseType = function () {
  var minPrice = getMinPriceForHouseType(adFormRoomTypeField.value);
  adFormPriceField.setAttribute('min', minPrice);
  adFormPriceField.setAttribute('placeholder', minPrice);
};

adFormRoomTypeField.addEventListener('change', changeFormMinPriceForHouseType);

toggleDisabledForm(true);
toggleDisabledMap(true);
changeFormMinPriceForHouseType();
checkRoomCapacity();

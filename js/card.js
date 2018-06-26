'use strict';

// модуль, который отвечает за создание карточки объявлений (удаление карточки объявлений)

(function () {
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

  var renderCard = function (cardIndex) {
    var cardFragment = document.createDocumentFragment();

    var cardClone = cardTemplate.cloneNode(true);

    var featuresList = cardClone.querySelector('.popup__features');
    var featuresListItemTemplate = featuresList.querySelector('.popup__feature--wifi').cloneNode(false);
    featuresListItemTemplate.classList.remove('popup__feature--wifi');

    var photosList = cardClone.querySelector('.popup__photos');
    var photosListItemTemplate = photosList.querySelector('.popup__photo').cloneNode(false);

    var listElement;
    var photosListElement;

    var cardOffer = window.data.cards[cardIndex].offer;
    cardClone.querySelector('.popup__title').textContent = cardOffer.title;
    cardClone.querySelector('.popup__text--address').textContent = cardOffer.address;
    cardClone.querySelector('.popup__text--price').textContent = cardOffer.price + ' ₽/ночь';
    cardClone.querySelector('.popup__type').textContent = window.utils.getHouseType(cardOffer.type);
    cardClone.querySelector('.popup__text--capacity').textContent = cardOffer.rooms + ' комнаты для ' + cardOffer.guests + ' гостей';
    cardClone.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardOffer.checkin + ', выезд до ' + cardOffer.checkout;

    while (featuresList.hasChildNodes()) {
      featuresList.removeChild(featuresList.firstChild);
    }

    for (var i = 0; i < cardOffer.features.length; i++) {
      listElement = featuresListItemTemplate.cloneNode(false);
      listElement.classList.add('popup__feature--' + cardOffer.features[i]);
      featuresList.appendChild(listElement);
    }

    cardClone.querySelector('.popup__description').textContent = cardOffer.description;

    while (photosList.hasChildNodes()) {
      photosList.removeChild(photosList.firstChild);
    }

    for (i = 0; i < cardOffer.photos.length; i++) {
      photosListElement = photosListItemTemplate.cloneNode(false);
      photosListElement.src = cardOffer.photos[i];
      photosList.appendChild(photosListElement);
    }

    cardClone.querySelector('.popup__avatar').src = window.data.cards[cardIndex].author.avatar;

    cardClone.querySelector('.popup__close').addEventListener('click', function () {
      deletePopup();
    });

    cardFragment.appendChild(cardClone);

    deletePopup();

    window.map.userMap.insertBefore(cardFragment, document.querySelector('.map__filters-container'));
  };

  var deletePopup = function () {
    if (window.map.userMap.querySelector('.popup')) {
      window.map.userMap.querySelector('.popup').remove();
    }
  };

  window.card = {
    renderCard: renderCard,
    deletePopup: deletePopup
  };

})();

'use strict';

//  модуль, который отвечает за создание пина — метки на карте

(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var renderPins = function (pinsAmount) {
    var pinFragment = document.createDocumentFragment();

    for (var i = 0; i < pinsAmount; i++) {
      var pinClone = pinTemplate.cloneNode(true);
      pinClone.style = 'left: ' + (window.data.cards[i].location.x - (window.map.pinWidth / 2)) + 'px;' + 'top: ' + (window.data.cards[i].location.y - (window.map.pinHeight / 2)) + 'px';
      pinClone.querySelector('img').src = window.data.cards[i].author.avatar;
      pinClone.querySelector('img').alt = window.data.cards[i].offer.title;
      pinClone.id = '#cid' + i;
      pinClone.addEventListener('click', function (evt) {
        window.card.renderCard(evt.currentTarget.id.substring(4, 5));
      });
      pinFragment.appendChild(pinClone);
    }

    document.querySelector('.map__pins').appendChild(pinFragment);
  };

  window.pin = {
    renderPins: renderPins
  };

})();

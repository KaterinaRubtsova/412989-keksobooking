'use strict';
// отвечает за состояние карты (активное и неактивное), отвечает за взаимодействие с главным пином, перемещение пина по карте
(function () {
  var PIN_WIDTH = 65;
  var PIN_HEIGHT = 65;
  var PIN_TIP_HEIGHT = 22;

  var userMap = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');

  // вспомогательные переменные для перемещения главного пина
  var MIN_VALUE_Y = 130;
  var MAX_VALUE_Y = 630;
  var MAX_VALUE_X = 1200;
  var MIN_VALUE_X = 0;

  var toggleDisabledMap = function (mapFaded) {
    userMap.classList.toggle('map--faded', mapFaded);
  };

  // перемещение метки приводит к заполнению поля адреса

  var getMainPinCords = function () {
    var mainPinX = parseInt(mapPinMain.style.left, 10) + (PIN_WIDTH / 2);
    var mainPinY = parseInt(mapPinMain.style.top, 10) + (PIN_HEIGHT / 2);

    if (!userMap.classList.contains('map--faded')) {
      mainPinY += (PIN_HEIGHT / 2) + PIN_TIP_HEIGHT;
    }

    return Math.floor(mainPinX) + ', ' + Math.floor(mainPinY);
  };

  // Единственное доступное действие в неактивном состоянии — перетаскивание метки .map__pin--main,
  // являющейся контролом указания адреса объявления.
  // Первое перемещение метки переводит страницу в активное состояние

  var mapPinMainClickHandler = function () {
    window.form.toggleDisabledForm(false);
    toggleDisabledMap(false);
    window.form.fillAddress();
    window.pin.renderPins(window.data.cardsCount);
    mapPinMain.removeEventListener('mouseup', mapPinMainClickHandler);
  };

  mapPinMain.addEventListener('mouseup', mapPinMainClickHandler);

  // Чтобы метку невозможно было поставить выше горизонта или ниже панели фильтров,
  // значение координаты Y должно быть ограничено интервалом от 130 до 630.
  // Значение координаты X должно быть ограничено размерами блока, в котором перетаскивается метка.

  var minMapPinMainCoordinates = {
    x: (MIN_VALUE_X),
    y: (MIN_VALUE_Y - PIN_HEIGHT - PIN_TIP_HEIGHT)
  };

  var maxMapPinMainCoordinates = {
    x: (MAX_VALUE_X - PIN_WIDTH),
    y: (MAX_VALUE_Y - PIN_HEIGHT - PIN_TIP_HEIGHT)
  };

  var calcMapPinMainCoordsToMove = function (offsetPin, shiftCoords, min, max) {
    var mapPinMainCoordsToMove = offsetPin + shiftCoords;
    mapPinMainCoordsToMove = mapPinMainCoordsToMove >= max ? max : mapPinMainCoordsToMove;
    mapPinMainCoordsToMove = mapPinMainCoordsToMove <= min ? min : mapPinMainCoordsToMove;
    return mapPinMainCoordsToMove;
  };

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mapPinMainMouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      // смещение относительно изначальной точки
      var shift = {
        x: moveEvt.clientX - startCoords.x,
        y: moveEvt.clientY - startCoords.y
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mapPinMain.style.top = calcMapPinMainCoordsToMove(mapPinMain.offsetTop, shift.y, minMapPinMainCoordinates.y, maxMapPinMainCoordinates.y) + 'px';
      mapPinMain.style.left = calcMapPinMainCoordsToMove(mapPinMain.offsetLeft, shift.x, minMapPinMainCoordinates.x, maxMapPinMainCoordinates.x) + 'px';
      window.form.fillAddress();
    };

    var mapPinMainMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      // при отпускании кнопки перестаем слушать события передвижения мыши и отпускания кнопки мыши
      document.removeEventListener('mousemove', mapPinMainMouseMoveHandler);
      document.removeEventListener('mouseup', mapPinMainMouseUpHandler);
    };

    //  обработчики события передвижения мыши и отпускания кнопки мыши.
    document.addEventListener('mousemove', mapPinMainMouseMoveHandler);
    document.addEventListener('mouseup', mapPinMainMouseUpHandler);
  });


  toggleDisabledMap(true);


  window.map = {
    userMap: userMap,
    pinWidth: PIN_WIDTH,
    pinHeight: PIN_HEIGHT,
    getMainPinCords: getMainPinCords
  };

})();
